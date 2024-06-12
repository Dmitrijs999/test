import { DateTime } from 'luxon';
import { orange, purple, blue } from 'styles/variables';

import { AXIS_LABELS, getExtremumValues, getAllAxisLabels } from './utils';
import {
  IYield,
  NetTimeframeGraphType,
  ChartTimeFrame,
  ChartNetType,
  GraphType,
} from 'types';

const generalConfig: GraphType = {
  isCurvePath: false,
  width: 170 * 7,
  height: 275,
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
  lines: [],
};

const generalMNTRewardsConfig = {
  ...generalConfig,
  lines: [
    {
      translationKey: 'charts.labels.rewardsAPY',
      shortTranslationKey: 'charts.labels.rewardsAPYShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: orange,
      isFill: false,
      isAltValue: false,
      points: [],
    },
  ],
};

const generalInterestConfig = {
  ...generalConfig,
  lines: [
    {
      translationKey: 'charts.labels.lendAPY',
      shortTranslationKey: 'charts.labels.lendAPYShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: orange,
      isFill: false,
      isAltValue: false,
      points: [],
    },
    {
      translationKey: 'charts.labels.borrowAPR',
      shortTranslationKey: 'charts.labels.borrowAPRShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: purple,
      isFill: false,
      isAltValue: false,
      points: [],
    },
    {
      translationKey: 'charts.labels.netAPY',
      shortTranslationKey: 'charts.labels.netAPYShort',
      label: '',
      legendLabel: '',
      iconSrc: '',
      fill: blue,
      isFill: true,
      isAltValue: false,
      points: [],
    },
  ],
};

const getGraphConfigs = (startDate: number) => ({
  [ChartNetType.interest]: [
    {
      value: ChartTimeFrame.day,
      config: {
        ...generalInterestConfig,
        x: { name: '', labels: AXIS_LABELS.day },
      },
    },
    {
      value: ChartTimeFrame.month,
      config: {
        ...generalInterestConfig,
        x: { name: '', labels: AXIS_LABELS.month },
      },
    },
    {
      value: ChartTimeFrame.year,
      config: {
        ...generalInterestConfig,
        x: { name: '', labels: AXIS_LABELS.year },
      },
    },
    {
      value: ChartTimeFrame.all,
      config: {
        ...generalInterestConfig,
        x: { name: '', labels: getAllAxisLabels(startDate) },
      },
    },
  ],
  [ChartNetType.mntRewards]: [
    {
      value: ChartTimeFrame.day,
      config: {
        ...generalMNTRewardsConfig,
        x: { name: '', labels: AXIS_LABELS.day },
      },
    },
    {
      value: ChartTimeFrame.month,
      config: {
        ...generalMNTRewardsConfig,
        x: { name: '', labels: AXIS_LABELS.month },
      },
    },
    {
      value: ChartTimeFrame.year,
      config: {
        ...generalMNTRewardsConfig,
        x: { name: '', labels: AXIS_LABELS.year },
      },
    },
    {
      value: ChartTimeFrame.all,
      config: {
        ...generalMNTRewardsConfig,
        x: { name: '', labels: getAllAxisLabels(startDate) },
      },
    },
  ],
});

export const getYieldConfig = (
  data: IYield,
  frame: ChartTimeFrame,
  t: (string: string) => string,
  startDate: number
): NetTimeframeGraphType => {
  const resultInterest = getExtremumValues([
    data.lend,
    data.borrow,
    data.netApy,
  ]);
  const resultMNTRewards = getExtremumValues([data.mntRewardsAPY]);

  const index = getGraphConfigs(startDate)[ChartNetType.interest].findIndex(
    (term) => term.value === frame
  );

  const configInterest = JSON.parse(
    JSON.stringify(
      getGraphConfigs(startDate)[ChartNetType.interest][index].config
    )
  );
  const configMNTRewards = JSON.parse(
    JSON.stringify(
      getGraphConfigs(startDate)[ChartNetType.mntRewards][index].config
    )
  );

  configInterest.y.minValue = resultInterest.minValue;
  configInterest.y.maxValue = resultInterest.maxValue;
  configInterest.y.divideValue = resultInterest.divideValue;

  [data.lend, data.borrow, data.netApy].map((data, index) => {
    configInterest.lines[index].points = data;
    configInterest.lines[index].label = t(
      configInterest.lines[index].translationKey
    );
    configInterest.lines[index].shortLabel = t(
      configInterest.lines[index].shortTranslationKey
    );
    configInterest.lines[index].legendLabel = t(
      configInterest.lines[index].translationKey
    );
  });

  configMNTRewards.y.minValue = resultMNTRewards.minValue;
  configMNTRewards.y.maxValue = resultMNTRewards.maxValue;
  configMNTRewards.y.divideValue = resultMNTRewards.divideValue;
  configMNTRewards.lines[0].points = data.mntRewardsAPY;
  configMNTRewards.lines[0].label = t(configMNTRewards.lines[0].translationKey);
  configMNTRewards.lines[0].shortLabel = t(
    configMNTRewards.lines[0].shortTranslationKey
  );
  configMNTRewards.lines[0].legendLabel = t(
    configMNTRewards.lines[0].translationKey
  );
  const newConfig = { ...getGraphConfigs(startDate) };

  newConfig[ChartNetType.interest][index].config = {
    ...configInterest,
    firstEntryTimestamp: +DateTime.fromSeconds(+startDate),
  };
  newConfig[ChartNetType.mntRewards][index].config = {
    ...configMNTRewards,
    firstEntryTimestamp: +DateTime.fromSeconds(+startDate),
  };

  return newConfig;
};
