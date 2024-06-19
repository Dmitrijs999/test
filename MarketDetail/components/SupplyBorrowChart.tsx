import React, { useMemo } from 'react';

import { Card, useMediaValue } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { ChartLoader } from 'common';
import { useGetUtilizationChartDataQuery } from 'features';
import { ExtMarketMeta } from 'types';
import { CHART_NAME } from 'utils/constants';
import { getUtilizationChartConfig } from 'utils/constants/configs/lentBorrowConfig';

const SupplyBorrowChart: React.FC<{
  marketMeta?: ExtMarketMeta;
  mb?: string;
}> = ({ marketMeta, mb = '0' }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetUtilizationChartDataQuery(
    marketMeta?.symbol,
    {
      skip: !marketMeta,
    }
  );
  const chartData = useMemo(() => {
    return (
      data &&
      getUtilizationChartConfig(data, t, data.firstEntryTimestamp as number)
    );
  }, [data]);

  const chartHeight = useMediaValue(325, 341, 325);

  return (
    <Card mode='light' sx={{ width: '100%', mb }}>
      {isLoading ? (
        <ChartLoader width='100%' height={chartHeight} />
      ) : (
        <div style={{ width: '100%', height: `${chartHeight}px` }}>
          <line-graph
            title={t('charts.supplyBorrow.title')}
            graphName={CHART_NAME.lentBorrow}
            config={encodeURIComponent(JSON.stringify([{ config: chartData }]))}
          />
        </div>
      )}
    </Card>
  );
};

export default SupplyBorrowChart;
