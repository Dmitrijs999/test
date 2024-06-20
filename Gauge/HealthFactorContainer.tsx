import React, { FC, useMemo } from 'react';

import { utils } from 'ethers';

import { HealthFactor } from 'common/Gauges/HealthFactor/HealthFactor';
import {
  getMarketData,
  selectMarketTransaction,
  selectUserAddress,
  useGetMarketsDataQuery,
  useGetUserDataQuery,
} from 'features';
import { useAppSelector } from 'features/store';
import { useProgressLoader } from 'utils';

export const HealthFactorContainer: FC = () => {
  const accountAddress = useAppSelector(selectUserAddress);

  const { data: userData, isFetching: userDataFetching } = useGetUserDataQuery(
    { accountAddress },
    { skip: !accountAddress }
  );

  const healthFactorValue = useMemo(() => {
    if (!userData) return 0;
    if (
      Number(userData?.userTotalCollateralUSD) == 0 ||
      Number(userData?.userTotalBorrowUSD) == 0
    )
      return 0;
    return (
      Number(userData?.userTotalCollateralUSD) /
      Number(userData?.userTotalBorrowUSD)
    );
  }, [userData]);

  const transaction = useAppSelector(selectMarketTransaction);

  const targetMarket = useMemo(() => {
    if (!transaction) return null;
    const { symbol } = transaction;
    return userData.userMarkets.find((m) => m.symbol === symbol);
  }, [transaction]);

  const borrowInSameMarket = useMemo(() => {
    if (!transaction || !targetMarket) return false;
    const { type } = transaction;

    return (
      type === 'borrow' &&
      utils.parseUnits(targetMarket.userSupplyUSD).gt(0) &&
      !targetMarket.collateralStatus
    );
  }, [transaction]);

  const { data, isFetching: isMarketDataFetching } = useGetMarketsDataQuery();

  const marketData = getMarketData(data, transaction?.symbol);

  const collateralStatus =
    transaction && targetMarket ? targetMarket.collateralStatus : false;

  const newHealthFactorValue = useMemo(() => {
    if (!transaction) return healthFactorValue;
    const { type, usd, status } = transaction;
    if (status === 'succeed' || status === 'failed') return healthFactorValue;

    let newTotalCollateralUsd;
    let newTotalBorrowUsd;

    try {
      switch (type) {
        case 'redeem': {
          newTotalCollateralUsd =
            Number(userData.userTotalCollateralUSD) -
            (Number(utils.formatUnits(usd.toBigInt())) *
              Number(marketData.economic.utilisationFactor)) /
              100;
          newTotalBorrowUsd = userData.userTotalBorrowUSD;

          break;
        }
        case 'supply': {
          const utilisationFactor =
            Number(marketData.economic.utilisationFactor) / 100;

          newTotalCollateralUsd =
            Number(userData.userTotalCollateralUSD) +
            Number(utils.formatUnits(usd.toBigInt())) * utilisationFactor;

          newTotalBorrowUsd = userData.userTotalBorrowUSD;

          break;
        }
        case 'borrow': {
          // Borrow operation enables market as collateral.
          // In case when target market is not used as collateral ( flag `borrowInSameMarket` )
          // we have to take into account the supply amount in the target market.
          // Because after `borrow` operation this supply became a collateral and will also affect the `healthyFactor`.
          // Otherwise, when market is already enabled as collateral, user's collateral in that market already counted in `userTotalCollateralUSD`

          newTotalCollateralUsd = borrowInSameMarket
            ? (
                Number(userData?.userTotalCollateralUSD) +
                Number(
                  utils.formatUnits(
                    targetMarket?.userMarketCollateralUSD ?? '0'
                  )
                )
              ).toString()
            : userData?.userTotalCollateralUSD;

          newTotalBorrowUsd =
            Number(userData?.userTotalBorrowUSD) +
            Number(utils.formatUnits(usd.toBigInt()));
          break;
        }
        case 'repay': {
          newTotalCollateralUsd = userData?.userTotalCollateralUSD;
          newTotalBorrowUsd = Math.max(
            Number(userData?.userTotalBorrowUSD) -
              Number(utils.formatUnits(usd.toBigInt())),
            0.0001
          );
          break;
        }
        default:
          return healthFactorValue;
      }
    } catch (e) {
      return healthFactorValue;
    }

    if (!newTotalBorrowUsd || !newTotalCollateralUsd) return healthFactorValue;
    return Number(newTotalCollateralUsd) / Number(newTotalBorrowUsd);
  }, [transaction, userData]);

  const loadingPercent = useProgressLoader(
    isMarketDataFetching || userDataFetching,
    1500
  );

  const checkBorrowOrRepay = useMemo(() => {
    if (transaction?.type === 'repay' || transaction?.type === 'borrow') {
      return true;
    }
    return false;
  }, [transaction]);

  return (
    <HealthFactor
      isActive={!!healthFactorValue}
      isLoading={userDataFetching || isMarketDataFetching}
      healthFactorValue={healthFactorValue}
      loadingPercent={loadingPercent}
      newHealthFactorValue={newHealthFactorValue}
      isNewHealthFactorActive={
        checkBorrowOrRepay
          ? !!newHealthFactorValue
          : !!newHealthFactorValue && collateralStatus
      }
    />
  );
};
