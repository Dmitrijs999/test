import React, { useMemo, useState } from 'react';

import { Card, useMediaValue } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './TotalReturnsChart.module.scss';
import { ChartLoader } from 'common';
import {
  useGetTotalReturnsDataQuery,
  useChartPeriods,
  selectUserAddress,
  getTimeframesToDelete,
} from 'features';
import { useAppSelector } from 'features/store';
import { ChartTimeFrame } from 'types';
import { CHART_NAME } from 'utils/constants';
import { getTotalReturnsConfig } from 'utils/constants/configs/totalReturnsConfig';

const TotalReturnsChart: React.FC = () => {
  const { t } = useTranslation();

  const skeletonHeight = useMediaValue(359, 391, 486);

  const address = useAppSelector(selectUserAddress) as string;
  const [frame, setFrame] = useState(ChartTimeFrame.all);
  const { data, isLoading } = useGetTotalReturnsDataQuery(
    {
      address,
      frame,
    },
    { skip: !address }
  );

  const chartData = useMemo(() => {
    return (
      data &&
      getTotalReturnsConfig(data, frame, t, data.firstEntryTimestamp as number)
    );
  }, [data]);

  useChartPeriods({
    chartData,
    graphName: CHART_NAME.totalReturns,
    setFrame,
  });

  return isLoading ? (
    <ChartLoader
      width={'100%'}
      height={skeletonHeight}
      className={classes.placeholderMargin}
    />
  ) : (
    <Card className={classes.chart}>
      <line-graph
        title={t('dashboard.totalReturns')}
        style={{ height: '100%', width: '100%', paddingBottom: '0' }}
        graphName={CHART_NAME.totalReturns}
        config={encodeURIComponent(JSON.stringify(chartData))}
        exclude={encodeURIComponent(
          JSON.stringify(getTimeframesToDelete(data?.firstEntryTimestamp))
        )}
      />
    </Card>
  );
};

export default TotalReturnsChart;
