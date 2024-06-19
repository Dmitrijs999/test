import React, { useMemo, useState } from 'react';

import { Card, useMediaValue } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './TotalNetAPYChart.module.scss';
import { ChartLoader } from 'common';
import {
  useGetTotalNetAPYDataQuery,
  useChartPeriods,
  selectUserAddress,
  getTimeframesToDelete,
} from 'features';
import { useAppSelector } from 'features/store';
import { ChartTimeFrame } from 'types';
import { CHART_NAME } from 'utils/constants';
import { getTotalNetAPYConfig } from 'utils/constants/configs/totalNetApyConfig';

const TotalNetAPYChart: React.FC = () => {
  const { t } = useTranslation();

  const skeletonHeight = useMediaValue(359, 391, 486);

  const address = useAppSelector(selectUserAddress) as string;
  const [frame, setFrame] = useState(ChartTimeFrame.all);
  const { data, isLoading } = useGetTotalNetAPYDataQuery(
    {
      address,
      frame,
    },
    { skip: !address }
  );

  const chartData = useMemo(() => {
    return (
      data &&
      getTotalNetAPYConfig(
        data.points,
        frame,
        t,
        data.firstEntryTimestamp as number
      )
    );
  }, [data]);

  useChartPeriods({
    chartData,
    graphName: CHART_NAME.totalNetApy,
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
        title={t('dashboard.TotalNetApy')}
        style={{ height: '100%', width: '100%' }}
        graphName={CHART_NAME.totalNetApy}
        config={encodeURIComponent(JSON.stringify(chartData))}
        exclude={encodeURIComponent(
          JSON.stringify(getTimeframesToDelete(data?.firstEntryTimestamp))
        )}
      />
    </Card>
  );
};

export default TotalNetAPYChart;
