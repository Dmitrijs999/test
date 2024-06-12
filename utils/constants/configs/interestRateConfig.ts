import { orange, purple } from 'styles/variables';

import { getExtremumValues } from './utils';
import { ILendBorrowChart, GraphType } from 'types';

const generalConfig: GraphType = {
  isCurvePath: false,
  specialHoverLabelTranslationKey: 'charts.labels.collateralRatio',
  specialHoverLabelTranslationKeyShort: 'charts.labels.collateralRatioShort',
  y: {
    translationKey: 'charts.axisNames.apy',
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
  x: {
    translationKey: 'charts.axisNames.utilisation',
    name: '',
    labels: ['', '20%', '40%', '60%', '80%', ''],
  },
  lines: [
    {
      translationKey: 'charts.labels.borrowAPR',
      shortTranslationKey: 'charts.labels.borrowAPRShort',
      label: '',
      legendLabel: '',
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
      fill: purple,
      isFill: false,
      isAltValue: false,
      points: [],
    },
  ],
};

export const getInterestRateConfig = (
  data: ILendBorrowChart,
  t: (string: string) => string
): GraphType => {
  const result = getExtremumValues([data.borrow, data.lend]);
  generalConfig.x.name = t(generalConfig.x.translationKey);
  generalConfig.y.name = t(generalConfig.y.translationKey);
  generalConfig.y.minValue = result.minValue;
  generalConfig.y.maxValue = result.maxValue;
  generalConfig.y.divideValue = result.divideValue;
  generalConfig.specialHoverLabel = t(
    generalConfig.specialHoverLabelTranslationKey
  );
  generalConfig.specialHoverLabelShort = t(
    generalConfig.specialHoverLabelTranslationKeyShort
  );

  generalConfig.lines[0].points = data.borrow;
  generalConfig.lines[0].label = t(generalConfig.lines[0].translationKey);
  generalConfig.lines[0].shortLabel = t(
    generalConfig.lines[0].shortTranslationKey
  );
  generalConfig.lines[0].legendLabel = t(generalConfig.lines[0].translationKey);

  generalConfig.lines[1].points = data.lend;
  generalConfig.lines[1].label = t(generalConfig.lines[1].translationKey);
  generalConfig.lines[1].shortLabel = t(
    generalConfig.lines[1].shortTranslationKey
  );
  generalConfig.lines[1].legendLabel = t(generalConfig.lines[1].translationKey);
  return generalConfig;
};

const termOptions = [{ config: generalConfig }];

export default termOptions;
