import React from 'react';

import {
  Typography,
  Card,
  Col,
  usd,
  unit,
  pct,
  Row,
  useMediaValue,
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
  return (
    <Col>
      <Typography
        style={{ marginBottom: '4px', color: '#8B8F9E' }}
        variant='copySBold'
        text={title}
      />
      {isLoading ? (
        <SkeletonRect width={70} height={20} />
      ) : (
        <Typography
          style={{ color: '#222A34' }}
          variant='copyLBold'
          text={value}
        />
      )}
    </Col>
  );
};

const DetailsTable: React.FC<{ marketMeta?: ExtMarketMeta }> = ({
  marketMeta,
}) => {
  const { t } = useTranslation();

  const { data, isFetching: isMarketDataFetching } = useGetMarketsDataQuery();
  const marketData = getMarketData(data, marketMeta?.symbol);

  const { data: prices, isFetching: isPricesFetching } =
    useGetOraclePricesQuery();
  const oraclePrice = getMarketOraclePrice(prices, marketMeta?.symbol);

  const rowGap = useMediaValue('9.25px', '16px', '15.5px');

  // FIXME: Remove it after integration real API3 price oracle for TAIKO token
  const priceText =
    marketData.meta.symbol === 'mtaiko'
      ? 'Placeholder price'
      : t('marketDetail.price');

  return (
    <Card title={t('marketDetail.marketDetails')} sx={{ flex: 1 }}>
      <Row
        style={{ flex: 1, maxWidth: '461px', justifyContent: 'space-between' }}
      >
        <Col
          style={{
            height: '100%',
            rowGap,
          }}
        >
          <ValueWithLoader
            isLoading={isPricesFetching}
            title={priceText}
            value={usd(oraclePrice)}
          />
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.noOfSuppliers')}
            value={marketData?.statistics.numberOfSuppliers.toString() ?? 'N/A'}
          />
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.supplied')}
            value={
              unit(marketData?.economic.marketValueLocked, { compact: true }) +
              ` ${marketMeta?.name}`
            }
          />
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.utilizationRatio')}
            value={pct(marketData?.economic.utilisationRate)}
          />
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.reserves')}
            value={
              unit(marketData?.economic.marketReservesUnderlying, {
                compact: true,
              }) + ` ${marketMeta?.name}`
            }
          />
        </Col>
        <Col
          style={{
            height: '100%',
            rowGap,
          }}
        >
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.marketLiquidity')}
            value={
              unit(marketData?.economic.marketLiquidityUnderlying, {
                compact: true,
              }) + ` ${marketMeta?.name}`
            }
          />
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.noOfBorrowers')}
            value={marketData?.statistics.numberOfBorrowers.toString() ?? 'N/A'}
          />
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.borrowed')}
            value={
              unit(marketData?.economic.marketBorrowUnderlying, {
                compact: true,
              }) + ` ${marketMeta?.name}`
            }
          />
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.collateralFactor')}
            value={pct(marketData?.economic.utilisationFactor)}
          />
          <ValueWithLoader
            isLoading={isMarketDataFetching}
            title={t('marketDetail.reserveFactor')}
            value={pct(marketData?.economic.reserveRate)}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default DetailsTable;
