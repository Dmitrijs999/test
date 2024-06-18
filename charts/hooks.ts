import { useEffect, useCallback } from 'react';

import { ChartTimeFrame } from 'types';

const monthLength = 2628288;
const yearLength = 31536000;

type SwitcherChangeEvent = {
  data: {
    type: string;
    graphName: string;
    frame: ChartTimeFrame;
  };
};

enum TimeframeToDelete {
  year = 'year',
  month = 'month',
}

export const getTimeframesToDelete = (
  timestamp?: number
): TimeframeToDelete[] => {
  if (!timestamp) return [];
  const timeframes: TimeframeToDelete[] = [];
  const now = Date.now() / 1000;
  if (now - timestamp < yearLength) timeframes.push(TimeframeToDelete.year);
  if (now - timestamp < monthLength) timeframes.push(TimeframeToDelete.month);
  return timeframes;
};

export const useChartPeriods = ({
  chartData,
  graphName,
  setFrame,
}: {
  chartData: any;
  graphName: string;
  setFrame: any;
  timestamp?: number;
}): void => {
  useEffect(() => {
    window.postMessage({
      type: 'new-chart-config',
      graphName,
      terms: chartData,
    });
  }, [chartData]);

  const graphSwitchHandler = useCallback(
    (event: SwitcherChangeEvent) => {
      if (
        !event.data ||
        event.data.type !== 'switcher-change' ||
        event.data.graphName !== graphName
      )
        return;
      setFrame(event.data.frame);
    },
    [setFrame]
  );

  useEffect(() => {
    window.addEventListener('message', graphSwitchHandler);
    return () => {
      window.removeEventListener('message', graphSwitchHandler);
    };
  }, [graphSwitchHandler]);
};
