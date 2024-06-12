import { DateTime } from 'luxon';
import { orange, purple } from 'styles/variables';

import { AXIS_LABELS, getExtremumValues, getAllAxisLabels } from './utils';
import btcIconSrc from 'assets/svg/btc.svg';
import usdIconSrc from 'assets/svg/USDC.svg';
import {
  ITotalReturns,
  TimeframeGraphType,
  ChartTimeFrame,
  GraphType,
} from 'types';

const generalConfig: GraphType = {
  showSignIcon: true,
  isCurvePath: false,
  y: {
    name: '',
    unit: 'K',
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
      translationKey: 'charts.labels.totalReturn.btc',
      shortTranslationKey: 'charts.labels.totalReturn.btcShort',
      label: '',
      legendLabel: '',
      iconSrc: btcIconSrc,
      fill: orange,
      isFill: false,
      isAltValue: true,
      points: [],
    },
    {
      translationKey: 'charts.labels.totalReturn.usd',
      shortTranslationKey: 'charts.labels.totalReturn.usdShort',
      label: '',
      legendLabel: '',
      iconSrc: usdIconSrc,
      fill: purple,
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

export const getTotalReturnsConfig = (
  data: ITotalReturns,
  frame: ChartTimeFrame,
  t: (string: string) => string,
  startDate: number
): TimeframeGraphType[] => {
  const config = {
    ...getGraphConfigs(startDate)[frame],
    firstEntryTimestamp: +DateTime.fromSeconds(+startDate),
  };
  const usdReturn = getExtremumValues([data.returnUSD]);
  const btcReturn = getExtremumValues([data.returnBTC]);
  config.y.minValue = usdReturn.minValue;
  config.y.maxValue = usdReturn.maxValue;
  config.y.divideValue = usdReturn.divideValue;
  config.y.minAltValue = btcReturn.minValue;
  config.y.maxAltValue = btcReturn.maxValue;
  config.y.divideAltValue = btcReturn.divideValue;
  config.lines[0].points = data.returnBTC;
  config.lines[0].label = t(config.lines[0].translationKey);
  config.lines[0].shortLabel = t(config.lines[0].shortTranslationKey);
  config.lines[1].points = data.returnUSD;
  config.lines[1].label = t(config.lines[1].translationKey);
  config.lines[1].shortLabel = t(config.lines[1].shortTranslationKey);
  return [
    { value: ChartTimeFrame.day, config },
    { value: ChartTimeFrame.month, config },
    { value: ChartTimeFrame.year, config },
    { value: ChartTimeFrame.all, config },
  ];
};
