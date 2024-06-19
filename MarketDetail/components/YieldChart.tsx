import React, { useMemo, useState } from 'react';

import { Card, useMediaValue } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { ChartLoader } from 'common';
import {
  useGetYieldPercentDataQuery,
  useChartPeriods,
  getTimeframesToDelete,
} from 'features';
import { ChartTimeFrame, ExtMarketMeta } from 'types';
import { CHART_NAME } from 'utils/constants';
import { getYieldConfig } from 'utils/constants/configs/yieldPercentConfig';

interface YieldChartProps {
  marketMeta?: ExtMarketMeta;
  accountAddress: string;
  mb?: string;
}

const YieldChart: React.FC<YieldChartProps> = ({
  marketMeta,
  accountAddress,
  mb = '0',
}) => {
  const { t } = useTranslation();
  const [frame, setFrame] = useState(ChartTimeFrame.all);

  const chartHeight = useMediaValue(277, 333, 369);
  const titleMB = useMediaValue('24px', '24px', '32px');

  const { data, isLoading } = useGetYieldPercentDataQuery(
    {
      address: accountAddress,
      symbol: marketMeta?.symbol,
      frame,
    },
    { skip: !accountAddress || !marketMeta }
  );

  const chartData = useMemo(() => {
    return (
      data && getYieldConfig(data, frame, t, data.firstEntryTimestamp as number)
    );
  }, [data]);

  useChartPeriods({
    chartData,
    graphName: CHART_NAME.yieldPercent,
    setFrame,
  });

  if (!data?.lend.length && !data?.borrow.length) return null;

  return (
    <Card
      title={t('charts.yourYield.title')}
      mode='light'
      sx={{ width: '100%', mb }}
      titleProps={{ style: { marginBottom: titleMB } }}
    >
      {isLoading ? (
        <ChartLoader width='100%' height={chartHeight} />
      ) : (
        <div style={{ width: '100%', height: `${chartHeight}px` }}>
          <line-graph
            style={{ height: '100%', width: '100%' }}
            graphName={CHART_NAME.yieldPercent}
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

export default YieldChart;
