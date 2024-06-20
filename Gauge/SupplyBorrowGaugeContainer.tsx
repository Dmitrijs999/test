import React, { useMemo } from 'react';

import { usd } from '@minterest-finance/ui-kit';
import { utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { SupplyBorrowGauge } from 'common';
import {
  getMarketData,
  selectUserAddress,
  useExtendedMarketMeta,
  useGetMarketsDataQuery,
  useGetUserDataQuery,
  selectMarketTransaction,
} from 'features';
import { useAppSelector } from 'features/store';
import { MarketTransactionType } from 'types';
import { useProgressLoader } from 'utils';

const impactSign: Record<
  MarketTransactionType,
  Record<'supply', string> | Record<'borrow', string>
> = {
  supply: {
    supply: '+',
  },
  borrow: {
    borrow: '+',
  },
  redeem: {
    supply: '-',
  },
  repay: {
    borrow: '-',
  },
};

export const SupplyBorrowGaugeContainer = React.memo<{
  type: 'supply' | 'borrow';
}>(function SupplyBorrowGaugeComponent({ type }) {
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: userData, isFetching: isUserDataFetching } =
    useGetUserDataQuery({ accountAddress }, { skip: !accountAddress });
  const { data: marketsData, isFetching: isMarketDataFetching } =
    useGetMarketsDataQuery();

  const { symbol } = useParams<{ symbol: string }>();
  const marketData = getMarketData(marketsData, symbol);
  const marketMeta = useExtendedMarketMeta(marketData?.meta);
  const transaction = useAppSelector(selectMarketTransaction);

  const delta = useMemo(() => {
    if (!transaction) return;
    if (
      !transaction.input ||
      transaction.usd.eq(0) ||
      transaction.status === 'succeed' ||
      transaction.status === 'failed'
    )
      return;

    const sign = impactSign[transaction.type][type];
    if (!sign) return;

    return `(${usd(utils.formatUnits(transaction.usd), {
      compact: true,
      sign,
    })})`;
  }, [transaction]);

  const title = useMemo(() => {
    if (type === 'supply') {
      if (accountAddress)
        return t('protocolGeneralValues.yourTotalSupply.title');
      return t('protocolGeneralValues.totalMarketsSupply.title');
    } else {
      if (accountAddress)
        return t('protocolGeneralValues.yourTotalBorrow.title');
      return t('protocolGeneralValues.totalMarketsBorrow.title');
    }
  }, [type, accountAddress, marketMeta]);

  const value = useMemo(() => {
    if (type === 'supply') {
      if (accountAddress) return userData?.userTotalSupplyUSD;
      return marketsData?.totalSupplyUSD;
    } else {
      if (accountAddress) return userData?.userTotalBorrowUSD;
      return marketsData?.totalBorrowUSD;
    }
  }, [accountAddress, type, marketsData, userData]);

  const userProgress = useProgressLoader(isUserDataFetching, 1500);
  const marketProgress = useProgressLoader(isMarketDataFetching, 1500);
  const progress = useMemo(() => {
    return accountAddress ? userProgress : marketProgress;
  }, [accountAddress, userProgress, marketProgress]);

  return (
    <SupplyBorrowGauge
      isLoading={progress && progress < 100}
      loadingPercent={progress}
      title={title}
      value={usd(value, { compact: true, sign: '' })}
      delta={delta}
    />
  );
});
