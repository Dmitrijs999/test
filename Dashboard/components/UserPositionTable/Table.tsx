import React, { useMemo } from 'react';

import { Conversion } from '@fuul/sdk/dist/types/api';
import { usd, unit, pct } from '@minterest-finance/ui-kit';
import { utils } from 'ethers';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import UserPositionTable, { UserTableRow } from './UserPositionTable';
import config from 'config';
import {
  selectUserAddress,
  getMarketNameWithOverride,
  getMarketIcon,
  useGetMarketsDataQuery,
  useGetUserDataQuery,
  getActiveMarketList,
  getUserMarketData,
  usePausedOperationDetector,
  useGetUserNFTQuery,
} from 'features';
import { NftCtaCoefficient } from 'features/indexer/constants';
import { useAppSelector } from 'features/store';
import { useGetConversionsQuery } from 'features/thirdPartyApi';
import {
  DEFAULT_POINTS_PER_OPERATION,
  QuestOperationTypes,
} from 'features/thirdPartyApi/constants';
import {
  findMarketConversion,
  getDefaultReward,
  getTierReward,
} from 'features/thirdPartyApi/utils';
import { MarketData, UserMarketData, UserData } from 'types';

const TableContainer: React.FC = () => {
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: marketsData, isFetching: isMarketsFetching } =
    useGetMarketsDataQuery();
  const { data: userData, isFetching: isUserDataFetching } =
    useGetUserDataQuery({ accountAddress }, { skip: !accountAddress });

  const { isMarketOperationPaused } = usePausedOperationDetector();

  const { data: conversions } = useGetConversionsQuery();
  const { data: nftData } = useGetUserNFTQuery(accountAddress as string, {
    skip: !accountAddress,
  });
  const activeNftTier = useMemo(() => {
    if (nftData && nftData.length > 0) {
      const activeNft = nftData?.find((nft) => nft.isActive);
      return activeNft.tier.toString();
    }
  }, [nftData]);

  const list = useMemo(() => {
    if (!userData || !marketsData) {
      return [];
    }
    const marketList = getActiveMarketList(marketsData);
    return marketList.map((md) => {
      const umd = getUserMarketData(userData, md.meta.symbol);
      const supplyPaused =
        isMarketOperationPaused(md.meta, 'supply') || !userData.isWhitelisted;
      const borrowPaused =
        isMarketOperationPaused(md.meta, 'borrow') || !userData.isWhitelisted;

      return composeUserTableItem(
        t,
        md,
        umd,
        supplyPaused,
        borrowPaused,
        userData,
        conversions,
        activeNftTier
      );
    });
  }, [userData, marketsData, conversions, nftData]);

  const isLoading = useMemo(() => {
    return isMarketsFetching || isUserDataFetching;
  }, [isMarketsFetching, isUserDataFetching]);

  return <UserPositionTable list={list} isLoading={isLoading} />;
};

const composeUserTableItem = (
  t: TFunction,
  md: MarketData,
  umd?: UserMarketData,
  supplyPaused?: boolean,
  borrowPaused?: boolean,
  ud?: UserData,
  conversions?: Conversion[],
  activeNftTier?: string
): UserTableRow => {
  const netAPY = umd?.netApy ?? '0';
  const userSupply = umd?.userSupplyUSD ?? '0';
  const userBorrow = umd?.userBorrowUSD ?? '0';

  const apy = md?.economic.apy ?? '0';
  const apr = md?.economic.apr ?? '0';
  const mntSupplyAPY = umd?.mntSupplyAPY ?? '0';
  const mntBorrowAPY = umd?.mntBorrowAPY ?? '0';
  const taikoSupplyAPY = umd?.taikoSupplyAPY ?? '0';
  const taikoBorrowAPY = umd?.taikoBorrowAPY ?? '0';
  const nftBdrSupplyBoost = umd?.nftBdrSupplyBoost ?? '0';
  const nftBdrBorrowBoost = umd?.nftBdrBorrowBoost ?? '0';

  const supplyTotalApyPercent =
    Number(apy) +
    Number(mntSupplyAPY) +
    Number(taikoSupplyAPY) +
    Number(nftBdrSupplyBoost);

  const borrowTotalAprPercent =
    -Number(apr) +
    Number(mntBorrowAPY) +
    Number(taikoBorrowAPY) +
    Number(nftBdrBorrowBoost || '0');

  const nftCtaValueSupply = Number(NftCtaCoefficient * Number(mntSupplyAPY));
  const nftCtaValueBorrow = Number(NftCtaCoefficient * Number(mntBorrowAPY));

  let mintsSupplyBoost = 0;
  let mintsSupplyNftBoostPercentage = 0;
  let mintsSupplyTotalRewards = 0;
  const marketSupplyConversion = findMarketConversion(
    conversions,
    md.meta.underlyingTokenInfo.symbol,
    QuestOperationTypes.SUPPLY
  );
  if (marketSupplyConversion) {
    const defaultReward = getDefaultReward(marketSupplyConversion);
    mintsSupplyBoost =
      (defaultReward / DEFAULT_POINTS_PER_OPERATION) * 100 - 100;
    mintsSupplyTotalRewards = defaultReward;
    if (activeNftTier) {
      const tierReward = getTierReward(marketSupplyConversion, activeNftTier);
      const nftBoostPercentage = (tierReward / defaultReward) * 100 - 100;
      mintsSupplyNftBoostPercentage = nftBoostPercentage;
      mintsSupplyTotalRewards = tierReward;
    }
  }

  let mintsBorrowBoost = 0;
  let mintsBorrowNftBoostPercentage = 0;
  let mintsBorrowTotalRewards = 0;
  const marketBorrowConversion = findMarketConversion(
    conversions,
    md.meta.underlyingTokenInfo.symbol,
    QuestOperationTypes.BORROW
  );
  if (marketBorrowConversion) {
    const defaultReward = getDefaultReward(marketBorrowConversion);
    mintsBorrowBoost =
      (defaultReward / DEFAULT_POINTS_PER_OPERATION) * 100 - 100;
    mintsBorrowTotalRewards = defaultReward;
    if (activeNftTier) {
      const tierReward = getTierReward(marketBorrowConversion, activeNftTier);
      const nftBoostPercentage = (tierReward / defaultReward) * 100 - 100;
      mintsBorrowNftBoostPercentage = nftBoostPercentage;
      mintsBorrowTotalRewards = tierReward;
    }
  }
  return {
    symbol: md.meta.symbol,
    id: `dashboard_item_${md.meta.symbol}`,
    assetName: getMarketNameWithOverride(md.meta.symbol),
    assetIcon: getMarketIcon(md.meta.symbol),
    userSupplyValue: utils.parseUnits(userSupply).toBigInt(),
    userSupplyDisplay: usd(userSupply, { compact: true, sign: '' }),
    userSupplyUnderlying: unit(umd?.userSupplyUnderlying ?? '0', {
      compact: true,
    }),
    userBorrowValue: utils.parseUnits(userBorrow).toBigInt(),
    userBorrowDisplay: usd(userBorrow, { compact: true, sign: '' }),
    userBorrowUnderlying: unit(umd?.userBorrowUnderlying || '0', {
      compact: true,
    }),
    supplyApyValue: utils.parseUnits(apy).toBigInt(),
    supplyTotalApyPercent,
    supplyApyDisplay: pct(apy, { sign: '' }),
    mntSupplyAPY: pct(mntSupplyAPY, { sign: '' }),
    taikoSupplyAPY: pct(taikoSupplyAPY, { sign: '' }),
    borrowAprValue: utils.parseUnits(apr).toBigInt(),
    borrowTotalAprPercent,
    borrowAprDisplay: pct(apr, { sign: '' }),
    mntBorrowAPY: pct(mntBorrowAPY, { sign: '' }),
    taikoBorrowAPY: pct(taikoBorrowAPY, { sign: '' }),
    netApyValue: utils.parseUnits(netAPY).toBigInt(),
    netApyDisplay: pct(netAPY, { sign: '' }),
    supplyDisabled:
      supplyPaused || !config.FEATURE.LEND.includes(md.meta.symbol),
    borrowDisabled:
      borrowPaused || !config.FEATURE.BORROW.includes(md.meta.symbol),
    underlyingBalance: unit(umd?.underlyingBalance, { compact: true }),
    operationDisabledTooltipAvailable: ud && !ud?.isWhitelisted,
    nftBdrSupplyBoost: pct(nftBdrSupplyBoost, { sign: '' }),
    nftBdrBorrowBoost: pct(nftBdrBorrowBoost, { sign: '' }),
    nftCtaValueBorrow,
    nftCtaValueSupply,
    mintsSupplyBoost,
    mintsSupplyNftBoostPercentage,
    mintsSupplyTotalRewards,
    mintsBorrowBoost,
    mintsBorrowNftBoostPercentage,
    mintsBorrowTotalRewards,
  };
};

export default TableContainer;
