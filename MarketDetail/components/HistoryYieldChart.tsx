import React, { useMemo, useState } from 'react';

import { Card, useMediaValue } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { ChartLoader } from 'common';
import {
  useGetHistoryYieldDataQuery,
  useChartPeriods,
  getTimeframesToDelete,
} from 'features';
import { ChartTimeFrame, ExtMarketMeta } from 'types';
import { CHART_NAME } from 'utils/constants';
import { getHistoryYieldConfig } from 'utils/constants/configs/historicalYieldConfig';

const HistoryChart: React.FC<{ marketMeta?: ExtMarketMeta; mb?: string }> = ({
  marketMeta,
  mb = '0',
}) => {
  const { t } = useTranslation();
  const [frame, setFrame] = useState(ChartTimeFrame.all);

  const { data, isLoading } = useGetHistoryYieldDataQuery(
    {
      symbol: marketMeta?.symbol,
      frame,
    },
    { skip: !marketMeta }
  );

  const chartData = useMemo(() => {
    return (
      data &&
      getHistoryYieldConfig(data, frame, t, data.firstEntryTimestamp as number)
    );
  }, [data]);

  useChartPeriods({
    chartData,
    graphName: CHART_NAME.historicalYield,
    setFrame,
  });

  const chartHeight = useMediaValue(325, 341, 325);

  return (
    <Card mode='light' sx={{ width: '100%', mb }}>
      {isLoading ? (
        <ChartLoader width='100%' height={chartHeight} />
      ) : (
        <div style={{ width: '100%', height: `${chartHeight}px` }}>
          <line-graph
            title={t('charts.historicalYield.title', {
              market: marketMeta?.name,
            })}
            graphName={CHART_NAME.historicalYield}
            config={encodeURIComponent(JSON.stringify(chartData))}
            exclude={encodeURIComponent(
              JSON.stringify(getTimeframesToDelete(data?.firstEntryTimestamp))
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default HistoryChart;
