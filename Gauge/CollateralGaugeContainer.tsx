import React, { useMemo } from 'react';

import { BigNumber, utils } from 'ethers';

import { CollateralGauge } from 'common';
import {
  selectUserAddress,
  useGetUserDataQuery,
  selectMarketTransaction,
} from 'features';
import { useAppSelector } from 'features/store';
import { useProgressLoader } from 'utils';
import { expScale } from 'utils/constants';

export const CollateralGaugeContainer = React.memo(function NetApyComponent() {
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: userData, isFetching } = useGetUserDataQuery(
    { accountAddress },
    { skip: !accountAddress }
  );
  const transaction = useAppSelector(selectMarketTransaction);

  const collateralValue = Number(userData?.collateralRatio);

  const hasSupplyInCollateralMarket = useMemo(() => {
    if (!userData) return false;
    return !!utils.parseUnits(userData.userTotalCollateralUSD).gt(0);
  }, [userData]);

  const borrowInSameMarket = useMemo(() => {
    if (!transaction) return false;
    const { type, symbol } = transaction;
    const targetMarket = userData.userMarkets.find((m) => m.symbol === symbol);

    return (
      type === 'borrow' &&
      utils.parseUnits(targetMarket.userSupplyUSD).gt(0) &&
      !targetMarket.collateralStatus
    );
  }, [transaction]);

  const isActive = useMemo(() => {
    if (!accountAddress || !userData) return false;
    if (hasSupplyInCollateralMarket) return true;
    if (borrowInSameMarket) return true;
    return false;
  }, [
    accountAddress,
    userData,
    borrowInSameMarket,
    hasSupplyInCollateralMarket,
  ]);

  const newCollateralValue = useMemo(() => {
    if (!transaction) return collateralValue;
    const { type, usd, status, symbol } = transaction;
    if (status === 'succeed' || status === 'failed') return collateralValue;
    if (!userData.userTotalBorrowUSD || !userData.userTotalCollateralUSD)
      return collateralValue;

    const { userTotalBorrowUSD, userTotalCollateralizedSupplyUSD } = userData;

    const targetMarket = userData.userMarkets.find((m) => m.symbol === symbol);
    const isTargetMarketCollateral = targetMarket?.collateralStatus;

    const totalBorrowUSD = utils.parseUnits(userTotalBorrowUSD);
    const totalCollateralizedSupplyUSD = utils.parseUnits(
      userTotalCollateralizedSupplyUSD
    );

    let newCollateralValue: BigNumber | undefined;

    try {
      switch (type) {
        case 'redeem': {
          // `redeem` operation affects `collateralRatio` only when target market is enabled as collateral.

          const newTotalCollateralizedSupplyUSD =
            totalCollateralizedSupplyUSD.sub(usd);
          if (
            isTargetMarketCollateral &&
            newTotalCollateralizedSupplyUSD.gt(0)
          ) {
            newCollateralValue = totalBorrowUSD
              .mul(expScale)
              .div(newTotalCollateralizedSupplyUSD)
              .mul(100);
          }
          break;
        }
        case 'supply': {
          // `supply` operation affects `collateralRatio` only when target market is enabled as collateral.

          const newTotalCollateralizedSupplyUSD =
            totalCollateralizedSupplyUSD.add(usd);
          if (
            isTargetMarketCollateral &&
            newTotalCollateralizedSupplyUSD.gt(0)
          ) {
            newCollateralValue = totalBorrowUSD
              .mul(expScale)
              .div(newTotalCollateralizedSupplyUSD)
              .mul(100);
          }
          break;
        }
        case 'borrow': {
          // Borrow operation enables market as collateral.
          // In case when target market is not used as collateral ( flag `borrowInSameMarket` )
          // we have to take into account the supply amount in the target market.
          // Because after `borrow` operation this supply became a collateral and will also affect the `collateralRatio`.
          // Otherwise, when market is already enabled as collateral, user's supply in that market already counted in `totalCollateralizedSupplyUSD`

          const newTotalCollateralizedSupplyUSD = borrowInSameMarket
            ? totalCollateralizedSupplyUSD.add(
                utils.parseUnits(targetMarket.userSupplyUSD)
              )
            : totalCollateralizedSupplyUSD;

          if (newTotalCollateralizedSupplyUSD.gt(0)) {
            const newTotalBorrow = totalBorrowUSD.add(usd);

            newCollateralValue = newTotalBorrow
              .mul(expScale)
              .div(newTotalCollateralizedSupplyUSD)
              .mul(100);
          }
          break;
        }
        case 'repay': {
          if (totalCollateralizedSupplyUSD.gt(0)) {
            const newTotalBorrow = totalBorrowUSD.sub(usd);

            newCollateralValue = newTotalBorrow
              .mul(expScale)
              .div(totalCollateralizedSupplyUSD)
              .mul(100);
          }
          break;
        }
        default:
          return collateralValue;
      }
    } catch (e) {
      return collateralValue;
    }

    if (!newCollateralValue) return collateralValue;
    return Number(utils.formatUnits(newCollateralValue));
  }, [transaction, userData]);

  const maxCollateral = useMemo(() => {
    if (borrowInSameMarket && transaction?.status !== 'succeed') {
      const { symbol } = transaction;
      const targetMarket = userData.userMarkets.find(
        (m) => m.symbol === symbol
      );

      const { userTotalCollateralizedSupplyUSD, userTotalCollateralUSD } =
        userData;

      const totalCollateralizedSupplyUSD = utils.parseUnits(
        userTotalCollateralizedSupplyUSD
      );
      const totalCollateralUSD = utils.parseUnits(userTotalCollateralUSD);
      const targetMarketSupplyUsd = utils.parseUnits(
        targetMarket.userSupplyUSD
      );

      // Borrow operation enables market as collateral.
      // If user going to borrow in target market, we have to calculate `maxCollateralRatio`
      // taking into account the user's `supply` && `collateral` balances in the target market.
      const newTotalCollateralUsd = totalCollateralUSD.add(
        targetMarket.userMarketCollateralUSD
      );
      const newTotalCollateralizedSupplyUSD = totalCollateralizedSupplyUSD.add(
        targetMarketSupplyUsd
      );

      return Number(
        utils.formatUnits(
          newTotalCollateralUsd
            .mul(expScale)
            .div(newTotalCollateralizedSupplyUSD),
          16
        )
      );
    }
    return Number(userData?.maxCollateralRatio);
  }, [userData, transaction, borrowInSameMarket]);

  const progress = useProgressLoader(isFetching, 1500);

  return (
    <CollateralGauge
      isActive={isActive}
      isLoading={progress && progress < 100}
      loadingPercent={progress}
      collateralValue={collateralValue}
      newCollateralValue={newCollateralValue}
      maxCollateral={maxCollateral}
    />
  );
});
