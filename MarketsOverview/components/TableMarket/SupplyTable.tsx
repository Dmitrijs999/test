import React, { useMemo } from 'react';

import { Conversion } from '@fuul/sdk/dist/types/api';
import { usd, unit, pct, useMediaBrakepoint } from '@minterest-finance/ui-kit';
import { utils } from 'ethers';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import TableMarket, { MarketTableRow } from './TableMarket';
import config from 'config';
import {
  getActiveMarketList,
  getMarketIcon,
  getMarketNameWithOverride,
  selectUserAddress,
  useGetMarketsDataQuery,
  useGetUserDataQuery,
  useGetUserNFTQuery,
  usePausedOperationDetector,
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
import { MarketTableType, MarketData, UserMarketData, UserData } from 'types';

const composeSupplyItem = (
  t: TFunction,
  md: MarketData,
  umd?: UserMarketData,
  isPaused?: boolean,
  ud?: UserData,
  conversions?: Conversion[],
  activeNftTier?: string
): MarketTableRow => {
  const apy = md.economic.apy ?? '0';
  const marketSupplyUSD = md.economic.marketSupplyUSD ?? '0';
  const marketSupplyUnderlying = md.economic.marketSupplyUnderlying ?? '0';
  const marketMntSupplyAPY = md.economic.marketMntSupplyAPY ?? '0';
  const marketTaikoSupplyAPY = md.economic.marketTaikoSupplyAPY ?? '0';

  const totalApyPercent =
    Number(apy) +
    Number(umd?.mntSupplyAPY || marketMntSupplyAPY) +
    Number(umd?.taikoSupplyAPY || marketTaikoSupplyAPY) +
    Number(umd?.nftBdrSupplyBoost || '0');

  const nftCtaValue = Number(
    NftCtaCoefficient * Number(umd?.mntSupplyAPY || marketMntSupplyAPY)
  );

  const result: MarketTableRow = {
    id: `supply_table_row_${md.meta.symbol}`,
    totalApyPercent,
    symbol: md.meta.symbol,
    assetName: getMarketNameWithOverride(md.meta.symbol),
    assetIcon: getMarketIcon(md.meta.symbol),
    marketUnderlyingDisplay: unit(marketSupplyUnderlying, { compact: true }),
    marketMNTDisplay: pct(marketMntSupplyAPY, { sign: '' }),
    marketTaikoDisplay: pct(marketTaikoSupplyAPY, { sign: '' }),
    rateValue: utils.parseUnits(apy).toBigInt(),
    rateDisplay: pct(apy, { sign: '' }),
    balanceValue: utils.parseUnits(marketSupplyUSD).toBigInt(),
    balanceDisplay: usd(marketSupplyUSD, { compact: true, sign: '' }),
    buttonDisabled: isPaused || !config.FEATURE.LEND.includes(md.meta.symbol),
    operationDisabledTooltipAvailable: ud && !ud?.isWhitelisted,
    nftCtaValue,
    mintsBoost: 0,
    mintsNftBoostPercentage: 0,
    mintsTotalRewards: 0,
  };
  if (umd) {
    const {
      userSupplyUSD,
      userSupplyUnderlying,
      underlyingBalance,
      mntSupplyAPY,
      taikoSupplyAPY,
      nftBdrSupplyBoost,
    } = umd;

    result.userBalanceValue = utils.parseUnits(userSupplyUSD).toBigInt();
    result.userBalanceDisplay = usd(userSupplyUSD, { compact: true, sign: '' });
    result.userBalanceUnderlying = unit(userSupplyUnderlying, {
      compact: true,
    });
    result.underlyingBalance = unit(underlyingBalance, {
      compact: true,
    });
    result.marketMNTDisplay = pct(mntSupplyAPY, { sign: '' });
    result.marketTaikoDisplay = pct(taikoSupplyAPY, { sign: '' });
    result.nftBdrDisplay = pct(nftBdrSupplyBoost, { sign: '' });
  }

  const marketConversion = findMarketConversion(
    conversions,
    md.meta.symbol.slice(1),
    QuestOperationTypes.SUPPLY
  );

  if (marketConversion) {
    const defaultReward = getDefaultReward(marketConversion);

    result.mintsBoost =
      (defaultReward / DEFAULT_POINTS_PER_OPERATION) * 100 - 100;

    result.mintsTotalRewards = defaultReward;
    if (activeNftTier) {
      const tierReward = getTierReward(marketConversion, activeNftTier);

      const nftBoostPercentage = (tierReward / defaultReward) * 100 - 100;

      result.mintsNftBoostPercentage = nftBoostPercentage;
      result.mintsTotalRewards = tierReward;
    }
  }

  return result;
};

export const SupplyTable: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useMediaBrakepoint();
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: marketsData, isFetching: isMarketsFetching } =
    useGetMarketsDataQuery();
  const { data: userData, isFetching: isUserDataFetching } =
    useGetUserDataQuery({ accountAddress }, { skip: !accountAddress });
  const { isLoading: isPausedOpsLoading, isMarketOperationPaused } =
    usePausedOperationDetector();
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
  const list = React.useMemo(() => {
    if (marketsData) {
      const marketList = getActiveMarketList(marketsData);
      return marketList.map((md) => {
        const umd = userData?.userMarkets.find(
          ({ symbol }) => symbol === md.meta.symbol
        );
        const isOpPaused = isMarketOperationPaused(md.meta, 'supply');

        return composeSupplyItem(
          t,
          md,
          umd,
          !userData?.isWhitelisted || isOpPaused,
          userData,
          conversions,
          activeNftTier
        );
      });
    }
    return [];
  }, [marketsData, userData, conversions, nftData]);

  return (
    <TableMarket
      type={MarketTableType.Lend}
      isLoading={isUserDataFetching || isMarketsFetching || isPausedOpsLoading}
      list={list}
      userData={userData}
      total={usd(marketsData?.totalSupplyUSD, { sign: '', compact: isMobile })}
      delta={+marketsData?.totalSupplyWeekDeltaUSD}
    />
  );
};
