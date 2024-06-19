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

// Can be moved if you want reuse
const composeBorrowItem = (
  t: TFunction,
  md: MarketData,
  umd?: UserMarketData,
  isPaused?: boolean,
  ud?: UserData,
  conversions?: Conversion[],
  activeNftTier?: string
): MarketTableRow => {
  const apr = md.economic.apr ?? '0';
  const marketBorrowUSD = md.economic.marketBorrowUSD ?? '0';
  const marketBorrowUnderlying = md.economic.marketBorrowUnderlying ?? '0';
  const marketMntBorrowAPY = md.economic.marketMntBorrowAPY ?? '0';
  const marketTaikoBorrowAPY = md.economic.marketTaikoBorrowAPY ?? '0';
  const totalApyPercent =
    -Number(apr) +
    Number(umd?.mntBorrowAPY || marketMntBorrowAPY) +
    Number(umd?.taikoBorrowAPY || marketTaikoBorrowAPY) +
    Number(umd?.nftBdrBorrowBoost || '0');

  const nftCtaValue = Number(
    NftCtaCoefficient * Number(umd?.mntBorrowAPY || marketMntBorrowAPY)
  );
  const result: MarketTableRow = {
    id: `borrow_table_row_${md.meta.symbol}`,
    symbol: md.meta.symbol,
    totalApyPercent,
    assetName: getMarketNameWithOverride(md.meta.symbol),
    assetIcon: getMarketIcon(md.meta.symbol),
    marketUnderlyingDisplay: unit(marketBorrowUnderlying, { compact: true }),
    marketMNTDisplay: pct(marketMntBorrowAPY, { sign: '' }),
    marketTaikoDisplay: pct(marketTaikoBorrowAPY, { sign: '' }),
    rateValue: utils.parseUnits(apr).toBigInt(),
    rateDisplay: pct(apr, { sign: '' }),
    balanceValue: utils.parseUnits(marketBorrowUSD).toBigInt(),
    balanceDisplay: usd(marketBorrowUSD, { compact: true, sign: '' }),
    buttonDisabled: isPaused || !config.FEATURE.BORROW.includes(md.meta.symbol),
    operationDisabledTooltipAvailable: ud && !ud?.isWhitelisted,
    nftCtaValue,
    mintsBoost: 0,
    mintsNftBoostPercentage: 0,
    mintsTotalRewards: 0,
  };
  if (umd) {
    const {
      userBorrowUSD,
      userBorrowUnderlying,
      mntBorrowAPY,
      taikoBorrowAPY,
      nftBdrBorrowBoost,
    } = umd;

    result.userBalanceValue = utils.parseUnits(userBorrowUSD).toBigInt();
    result.userBalanceDisplay = usd(userBorrowUSD, { compact: true, sign: '' });
    result.userBalanceUnderlying = unit(userBorrowUnderlying, {
      compact: true,
    });
    result.marketMNTDisplay = pct(mntBorrowAPY, { sign: '' });
    result.marketTaikoDisplay = pct(taikoBorrowAPY, { sign: '' });
    result.nftBdrDisplay = pct(nftBdrBorrowBoost, { sign: '' });
  }
  const marketConversion = findMarketConversion(
    conversions,
    md.meta.symbol.slice(1),
    QuestOperationTypes.BORROW
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

export const BorrowTable: React.FC = () => {
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: marketsData, isFetching: isMarketsFetching } =
    useGetMarketsDataQuery();
  const { data: userData, isFetching: isUserDataFetching } =
    useGetUserDataQuery({ accountAddress }, { skip: !accountAddress });
  const { isLoading: isPausedOpsLoading, isMarketOperationPaused } =
    usePausedOperationDetector();
  const { isMobile } = useMediaBrakepoint();
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
        const isOpPaused = isMarketOperationPaused(md.meta, 'borrow');
        return composeBorrowItem(
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
      type={MarketTableType.Borrow}
      isLoading={isMarketsFetching || isUserDataFetching || isPausedOpsLoading}
      list={list}
      userData={userData}
      total={usd(marketsData?.totalBorrowUSD, { sign: '', compact: isMobile })}
      delta={+marketsData?.totalBorrowWeekDeltaUSD}
    />
  );
};
