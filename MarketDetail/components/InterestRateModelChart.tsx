import React, { useMemo } from 'react';

import {
  Card,
  Typography,
  useMediaBrakepoint,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { ChartLoader } from 'common';
import {
  useGetInterestRateChartDataQuery,
  getMarketData,
  useGetMarketsDataQuery,
} from 'features';
import { ExtMarketMeta } from 'types';
import { CHART_NAME } from 'utils/constants';
import { getInterestRateConfig } from 'utils/constants/configs/interestRateConfig';

const InterestRateModelChart: React.FC<{
  marketMeta?: ExtMarketMeta;
  spacing: string;
}> = ({ marketMeta, spacing = '0' }) => {
  const { isDesktop } = useMediaBrakepoint();
  const { data: marketsData, isLoading: marketsIsLoading } =
    useGetMarketsDataQuery();
  const { t } = useTranslation();
  const { data, isLoading: interestRateIsLoading } =
    useGetInterestRateChartDataQuery(marketMeta?.symbol, {
      skip: !marketMeta,
    });
  const { economic } = getMarketData(marketsData, marketMeta?.symbol);
  const chartData = useMemo(() => {
    return (
      data &&
      economic && {
        ...getInterestRateConfig(data, t),
        utilisationRate: economic.utilisationRate,
      }
    );
  }, [data, economic.utilisationRate]);

  return (
    <Card
      titleProps={{ style: { marginBottom: '8px' } }}
      title={t('charts.interestRate.title')}
      sx={{
        // height: '100%',
        flex: 1,
        mr: isDesktop ? spacing : 0,
        mb: !isDesktop ? spacing : 0,
      }}
    >
      <Typography
        style={{ color: '#8B8F9E' }}
        variant={'copyM'}
        text={t('charts.interestRate.subtitle')}
      />
      {interestRateIsLoading || marketsIsLoading ? (
        <ChartLoader width={'100%'} height={302} />
      ) : (
        <div style={{ width: '100%', height: '302px' }}>
          <line-graph
            graphName={CHART_NAME.interestRate}
            config={encodeURIComponent(JSON.stringify([{ config: chartData }]))}
          />
        </div>
      )}
    </Card>
  );
};

export default InterestRateModelChart;
