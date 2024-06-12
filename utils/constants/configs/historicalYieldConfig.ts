import { DateTime } from 'luxon';
import { orange, purple } from 'styles/variables';

import { AXIS_LABELS, getExtremumValues, getAllAxisLabels } from './utils';
import {
  ILendBorrowChart,
  TimeframeGraphType,
  ChartTimeFrame,
  GraphType,
} from 'types';

const generalConfig: GraphType = {
  width: 560,
  height: 275,
  isCurvePath: false,
  y: {
    name: '',
    unit: '%',
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
      translationKey: 'charts.labels.borrowAPR',
      shortTranslationKey: 'charts.labels.borrowAPRShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: orange,
      isFill: false,
      isAltValue: false,
      points: [],
    },
    {
      translationKey: 'charts.labels.lendAPY',
      shortTranslationKey: 'charts.labels.lendAPYShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: purple,
      isFill: false,
      isAltValue: false,
      points: [],
    },
  ],
};

const getGraphConfig = (startDate: number) => {
  return {
    all: {
      ...generalConfig,
      x: { name: '', labels: getAllAxisLabels(startDate) },
    },
    year: { ...generalConfig, x: { name: '', labels: AXIS_LABELS.year } },
    month: { ...generalConfig, x: { name: '', labels: AXIS_LABELS.month } },
    day: { ...generalConfig, x: { name: '', labels: AXIS_LABELS.day } },
  };
};

export const getHistoryYieldConfig = (
  data: ILendBorrowChart,
  frame: ChartTimeFrame,
  t: (string: string) => string,
  startDate: number
): TimeframeGraphType[] => {
  const result = getExtremumValues([data.borrow, data.lend]);
  const config = {
    ...getGraphConfig(startDate)[frame],
    firstEntryTimestamp: +DateTime.fromSeconds(+startDate),
  };
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
  return [
    { value: ChartTimeFrame.day, config },
    { value: ChartTimeFrame.month, config },
    { value: ChartTimeFrame.year, config },
    { value: ChartTimeFrame.all, config },
  ];
};
