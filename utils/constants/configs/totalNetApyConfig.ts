import { DateTime } from 'luxon';
import { orange } from 'styles/variables';

import { AXIS_LABELS, getExtremumValues, getAllAxisLabels } from './utils';
import { TimeframeGraphType, ChartTimeFrame, Point, GraphType } from 'types';

const generalConfig: GraphType = {
  isCurvePath: false,
  width: 170 * 7,
  height: 308,
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
      translationKey: 'charts.labels.totalNetApy',
      shortTranslationKey: 'charts.labels.totalNetApyShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: orange,
      isFill: true,
      isAltValue: false,
      points: [],
    },
  ],
};

const getGraphConfigs = (startDate: number) => ({
  all: {
    ...generalConfig,
    x: { name: '', labels: getAllAxisLabels(startDate) },
  },
  year: { ...generalConfig, x: { name: '', labels: AXIS_LABELS.year } },
  month: { ...generalConfig, x: { name: '', labels: AXIS_LABELS.month } },
  day: { ...generalConfig, x: { name: '', labels: AXIS_LABELS.day } },
});

export const getTotalNetAPYConfig = (
  data: Point[],
  frame: ChartTimeFrame,
  t: (string: string) => string,
  startDate: number
): TimeframeGraphType[] => {
  const result = getExtremumValues([data]);
  const config = {
    ...getGraphConfigs(startDate)[frame],
    firstEntryTimestamp: +DateTime.fromSeconds(+startDate),
  };
  config.y.minValue = result.minValue;
  config.y.maxValue = result.maxValue;
  config.y.divideValue = result.divideValue;
  config.lines[0].points = data;
  config.lines[0].label = t(config.lines[0].translationKey);
  config.lines[0].shortLabel = t(config.lines[0].shortTranslationKey);
  config.lines[0].legendLabel = t(config.lines[0].translationKey);
  return [
    { value: ChartTimeFrame.day, config },
    { value: ChartTimeFrame.month, config },
    { value: ChartTimeFrame.year, config },
    { value: ChartTimeFrame.all, config },
  ];
};
