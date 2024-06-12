import { DateTime } from 'luxon';
import { orange, purple } from 'styles/variables';

import { getExtremumValues, getAllAxisLabels } from './utils';
import { GraphType, ILendBorrowChart } from 'types';

const generalConfig: GraphType = {
  isCurvePath: false,
  y: {
    name: '',
    unit: '$',
    minValue: 0,
    maxValue: 0,
    divideValue: 0,
    altUnit: '',
    minAltValue: 0,
    maxAltValue: 0,
    divideAltValue: 0,
  },
  lines: [
    {
      translationKey: 'charts.labels.totalBorrowInUSD',
      shortTranslationKey: 'charts.labels.totalBorrowInUSDShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: orange,
      isFill: true,
      isAltValue: false,
      points: [],
    },
    {
      translationKey: 'charts.labels.totalLentInUSD',
      shortTranslationKey: 'charts.labels.totalLentInUSDShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: purple,
      isFill: true,
      isAltValue: false,
      points: [],
    },
  ],
};

const getGraphConfig = (startDate: number) => ({
  ...generalConfig,
  firstEntryTimestamp: +DateTime.fromSeconds(+startDate),
  x: { name: '', labels: getAllAxisLabels(startDate) },
});

export const getUtilizationChartConfig = (
  data: ILendBorrowChart,
  t: (string: string) => string,
  startDate: number
): GraphType => {
  const result = getExtremumValues([data.borrow, data.lend]);
  const config = getGraphConfig(startDate);
  config.y.minValue = result.minValue;
  config.y.maxValue = result.maxValue;
  config.y.divideValue = result.divideValue;
  config.lines[0].points = data.borrow;
  config.lines[0].label = t(config.lines[0].translationKey);
  config.lines[0].shortLabel = t(config.lines[0].shortTranslationKey);
  config.lines[0].legendLabel = t(config.lines[0].translationKey);
  config.lines[1].points = data.lend;
  config.lines[1].label = t(config.lines[1].translationKey);
  config.lines[1].shortLabel = t(config.lines[1].shortTranslationKey);
  config.lines[1].legendLabel = t(config.lines[1].translationKey);
  return config;
};
