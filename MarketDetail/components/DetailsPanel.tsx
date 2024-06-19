import React from 'react';

import {
  Row,
  useMediaValue,
  Col,
  Typography,
  usd,
  unit,
  pct,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { SkeletonRect } from 'common';
import {
  getMarketData,
  getMarketOraclePrice,
  useGetMarketsDataQuery,
  useGetOraclePricesQuery,
} from 'features';
import { ExtMarketMeta } from 'types';

const ValueWithLoader: React.FC<{
  title: string;
  value: string;
  isLoading: boolean;
}> = ({ title, value, isLoading }) => {
  const alignItems = useMediaValue('flex-start', 'center', 'center');
  const pt = useMediaValue('24px', '32px', '32px');
  return (
    <Col sx={{ alignItems, pt }}>
      <Typography
        style={{ marginBottom: '4px', color: '#A3A7B6' }}
        variant='copySBold'
        text={title}
      />
      {isLoading ? (
        <SkeletonRect
          foregroundColor='#21272D'
          backgroundColor='#42484E'
          width={70}
          height={24}
        />
      ) : (
        <Typography
          style={{ color: '#FCFDFF' }}
          variant='copyLBold'
          text={value}
        />
      )}
    </Col>
  );
};

const DetailsPanel: React.FC<{
  marketMeta: ExtMarketMeta | undefined;
  mb: string;
  mt: string;
}> = ({ marketMeta, mb = '0', mt = '0' }) => {
  const { t } = useTranslation();

  const { data: marketsData, isFetching } = useGetMarketsDataQuery();
  const marketData = getMarketData(marketsData, marketMeta?.symbol);
  const { data: prices, isFetching: isPricesFetching } =
    useGetOraclePricesQuery();
  const oraclePrice = getMarketOraclePrice(prices, marketMeta?.symbol);

  const gridTemplateColumns = useMediaValue(
    'auto auto auto',
    'auto auto auto auto auto auto',
    'auto auto auto auto auto auto'
  );

  // FIXME: Remove it after integration real API3 price oracle for TAIKO token
  const priceText =
    marketData.meta.symbol === 'mtaiko'
      ? 'Placeholder price'
      : t('marketDetail.price');

  return (
    <Row
      sx={{
        width: '100%',
        display: 'inline-grid',
        gridTemplateColumns,
        borderTop: '2px solid rgba(202, 208, 214, 0.08)',
        justifyContent: 'space-around',
        mb,
        mt,
      }}
    >
      <ValueWithLoader
        isLoading={isPricesFetching}
        title={priceText}
        value={usd(oraclePrice)}
      />
      <ValueWithLoader
        isLoading={isFetching}
        title={t('marketWidget.marketLiquidity')}
        value={
          unit(marketData?.economic.marketLiquidityUnderlying, {
            compact: true,
          }) + ` ${marketMeta?.name}`
        }
      />
      <ValueWithLoader
        isLoading={isFetching}
        title={t('marketWidget.supplied')}
        value={
          unit(marketData?.economic.marketValueLocked, { compact: true }) +
          ` ${marketMeta?.name}`
        }
      />
      <ValueWithLoader
        isLoading={isFetching}
        title={t('marketWidget.utilizationRatio')}
        value={pct(marketData?.economic.utilisationRate)}
      />
      <ValueWithLoader
        isLoading={isFetching}
        title={t('marketWidget.borrowed')}
        value={
          unit(marketData?.economic.marketBorrowUnderlying, { compact: true }) +
          ` ${marketMeta?.name}`
        }
      />
      <ValueWithLoader
        isLoading={isFetching}
        title={t('marketWidget.collateralFactor')}
        value={pct(marketData?.economic.utilisationFactor)}
      />
    </Row>
  );
};

export default DetailsPanel;
