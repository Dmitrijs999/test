import React, { useMemo } from 'react';

import { BigNumber, utils } from 'ethers';

import { NetApyGauge, NetApyGaugeType } from 'common';
import {
  selectMarketTransaction,
  selectUserAddress,
  useGetUserDataQuery,
  useGetUserNFTQuery,
} from 'features';
import { useAppSelector } from 'features/store';
import { useConnect } from 'features/wallet';
import { TransactionStatus } from 'types';
import { useProgressLoader, getTotalNetAPY } from 'utils';
import { expScale } from 'utils/constants';

const disabledGauge = [
  NetApyGaugeType.emissions,
  NetApyGaugeType.govReward,
  NetApyGaugeType.loyality,
  NetApyGaugeType.netInterest,
  NetApyGaugeType.nftBoost,
];

export const NetApyGaugeContainer = React.memo(function NetApyComponent() {
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: userData, isFetching } = useGetUserDataQuery(
    { accountAddress },
    { skip: !accountAddress }
  );
  const { data: nftData } = useGetUserNFTQuery(accountAddress as string, {
    skip: !accountAddress,
  });
  const connect = useConnect();
  const onConnectClick = () => connect();
  const transaction = useAppSelector(selectMarketTransaction);

  const newNetApyValue = useMemo(() => {
    if (
      !userData ||
      !transaction ||
      transaction?.usd?.isZero() ||
      transaction?.status === TransactionStatus.succeed ||
      transaction?.status === TransactionStatus.failed
    ) {
      return;
    }
    const { usd, symbol: target, type } = transaction;
    let totalAnnualIncome = BigNumber.from(userData.userBuyBackRewardsUSD);
    let newUserTotalSupplyUSD = utils.parseUnits(userData.userTotalSupplyUSD);
    userData.userMarkets.forEach((um) => {
      const {
        apy,
        apr,
        userBorrowUSD,
        userSupplyUSD,
        marketBorrowUSD,
        marketSupplyUSD,
        mntSupplyAPYNumerator,
        mntBorrowAPYNumerator,
        annualIncome,
        mntBorrowAPY,
        mntSupplyAPY,
        symbol,
      } = um;
      if (symbol !== target) {
        totalAnnualIncome = totalAnnualIncome.add(annualIncome);
      } else {
        switch (type) {
          case 'redeem':
          case 'supply': {
            let newSupplyUsd = utils.parseUnits(userSupplyUSD);
            let newMarketSupplyUsd = BigNumber.from(marketSupplyUSD);
            if (type === 'supply') {
              newMarketSupplyUsd = newMarketSupplyUsd.add(usd);
              newSupplyUsd = newSupplyUsd.add(usd);
              newUserTotalSupplyUSD = newUserTotalSupplyUSD.add(usd);
            } else {
              newMarketSupplyUsd = newMarketSupplyUsd.sub(usd);
              newSupplyUsd = newSupplyUsd.sub(usd);
              newUserTotalSupplyUSD = newUserTotalSupplyUSD.sub(usd);
            }
            const newMntSupplyAPY = newMarketSupplyUsd.eq(0)
              ? BigNumber.from(0)
              : BigNumber.from(mntSupplyAPYNumerator).div(newMarketSupplyUsd);
            const newAnnualIncome = BigNumber.from(0)
              .add(newSupplyUsd.mul(apy).div(expScale))
              .sub(utils.parseUnits(userBorrowUSD).mul(apr).div(expScale))
              .add(newSupplyUsd.mul(newMntSupplyAPY).div(expScale))
              .add(
                utils
                  .parseUnits(userBorrowUSD)
                  .mul(utils.parseUnits(mntBorrowAPY, 16))
                  .div(expScale)
              );
            totalAnnualIncome = totalAnnualIncome.add(newAnnualIncome);
            break;
          }
          case 'repay':
          case 'borrow': {
            let newBorrowUsd = utils.parseUnits(userBorrowUSD);
            let newMarketBorrowUsd = BigNumber.from(marketBorrowUSD);
            if (type === 'borrow') {
              newBorrowUsd = newBorrowUsd.add(usd);
              newMarketBorrowUsd = newMarketBorrowUsd.add(usd);
            } else {
              newBorrowUsd = newBorrowUsd.sub(usd);
              newMarketBorrowUsd = newMarketBorrowUsd.sub(usd);
            }
            const newMntBorrowAPY = newMarketBorrowUsd.eq(0)
              ? BigNumber.from(0)
              : BigNumber.from(mntBorrowAPYNumerator).div(newMarketBorrowUsd);
            const newAnnualIncome = BigNumber.from(0)
              .add(utils.parseUnits(userSupplyUSD).mul(apy).div(expScale))
              .sub(newBorrowUsd.mul(apr).div(expScale))
              .add(
                utils
                  .parseUnits(userSupplyUSD)
                  .mul(utils.parseUnits(mntSupplyAPY, 16))
                  .div(expScale)
              )
              .add(newBorrowUsd.mul(newMntBorrowAPY).div(expScale));
            totalAnnualIncome = totalAnnualIncome.add(newAnnualIncome);
            break;
          }
          default: {
            totalAnnualIncome = totalAnnualIncome.add(annualIncome);
          }
        }
      }
    });
    const newTotalNetApy = getTotalNetAPY(
      totalAnnualIncome,
      newUserTotalSupplyUSD,
      BigNumber.from(userData.userMntWithdrawableUSD)
    );
    return Number(utils.formatUnits(newTotalNetApy, 16));
  }, [userData, transaction]);

  const disabledTypes = useMemo(() => {
    if (!userData || newNetApyValue) return disabledGauge;
    const types = [];
    if (!Number(userData.netInterest)) {
      types.push(NetApyGaugeType.netInterest);
    }
    if (!Number(userData.emissions)) {
      types.push(NetApyGaugeType.emissions);
    }
    if (!Number(userData.govReward)) {
      types.push(NetApyGaugeType.govReward);
    }
    if (!Number(userData.userLoyaltyGroup)) {
      types.push(NetApyGaugeType.loyality);
    }
    if (!nftData) {
      types.push(NetApyGaugeType.nftBoost);
    }
    return types;
  }, [userData, newNetApyValue, nftData]);

  const progress = useProgressLoader(isFetching, 1500);
  return (
    <NetApyGauge
      connected={!!accountAddress}
      onConnectClick={onConnectClick}
      isActive={
        !utils.parseUnits(userData?.userTotalSupplyUSD ?? '0').isZero() ||
        !utils.parseUnits(userData?.userTotalBorrowUSD ?? '0').isZero()
      }
      nftBoostValue={Number(nftData?.find((i) => i.isActive)?.tier)}
      loyaltyGroup={Number(userData?.userLoyaltyGroup)}
      loyaltyFactor={Number(userData?.userLoyaltyFactor)}
      netInterestValue={Number(userData?.netInterest)}
      emissionsValue={Number(userData?.emissions)}
      govRewardValue={Number(userData?.govReward)}
      netApyValue={Number(userData?.totalNetApy)}
      newNetApyValue={newNetApyValue}
      disabledTypes={disabledTypes}
      isLoading={progress && progress < 100}
      loadingPercent={progress}
    />
  );
});
