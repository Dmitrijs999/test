import React from 'react';

import { Col, Typography, useMediaValue, usd } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { SkeletonRect } from 'common';
import { useGetOraclePricesQuery } from 'features';

export const MntPrice: React.FC = () => {
  const { t } = useTranslation();
  const minWidth = useMediaValue('75px', '131px', '131px');
  const { data: prices, isFetching } = useGetOraclePricesQuery();

  const mntPrice = React.useMemo(() => {
    if (!prices) {
      return 'N/A';
    }
    return usd(prices.mntOraclePriceUSD);
  }, [prices]);

  return (
    <Col style={{ alignItems: 'center', minWidth, flex: 1 }}>
      <Typography
        variant='copyMBold'
        text={t('dashboard.mntRewards.priceTitle')}
        style={{ color: '#595D6C', marginBottom: '8px' }}
      />
      {isFetching ? (
        <SkeletonRect width={minWidth} height={24} />
      ) : (
        <Typography variant='copyLBold' text={mntPrice} />
      )}
    </Col>
  );
};
