export enum DatasetTypes {
  'LentHistory' = 'LentHistory',
  'BorrowHistory' = 'BorrowHistory',
  'BorrowAprHistory' = 'BorrowAprHistory',
  'LendAprHistory' = 'LendAprHistory',
  'LendInterestModel' = 'LendInterestModel',
  'BorrowInterestModel' = 'BorrowInterestModel',
}

export enum ValuesType {
  usd,
  percent,
}

export interface IPoolHistoryItem {
  value: number;
  date: Date;
}

export interface IPoolInterestItem {
  apy: number;
  utilization: number;
}

export type Point = {
  x: number;
  y: number;
};

export interface ITotalNetApy {
  points: Point[];
  firstEntryTimestamp?: number;
}

export interface ILendBorrowChart {
  lend: Point[];
  borrow: Point[];
  firstEntryTimestamp?: number;
}

export interface IYield {
  lend: Point[];
  borrow: Point[];
  mntRewardsAPY: Point[];
  netApy: Point[];
  firstEntryTimestamp?: number;
}

export interface ITotalReturns {
  returnBTC: Point[];
  returnUSD: Point[];
  firstEntryTimestamp?: number;
}

type YAxis = {
  name: string;
  unit: string;
  minValue: number;
  maxValue: number;
  divideValue: number;
  altUnit: string;
  minAltValue: number;
  maxAltValue: number;
  divideAltValue: number;
  translationKey?: string;
};

type XAxis = {
  translationKey?: string;
  name: string;
  labels: string[];
};

type LineType = {
  translationKey: string;
  shortTranslationKey: string;
  points: Point[] | null;
  label: string;
  shortLabel?: string;
  legendLabel: string;
  iconSrc?: string;
  fill: string;
  isFill?: boolean;
  isAltValue?: boolean;
};

export type GraphType = {
  specialHoverLabelTranslationKey?: string;
  specialHoverLabelTranslationKeyShort?: string;
  specialHoverLabel?: string;
  specialHoverLabelShort?: string;
  showSignIcon?: boolean;
  width?: number;
  height?: number;
  lines: LineType[];
  isCurvePath: boolean;
  x?: XAxis;
  y: YAxis;
};

export enum ChartTimeFrame {
  'year' = 'year',
  'all' = 'all',
  'day' = 'day',
  'month' = 'month',
}

export enum ChartNetType {
  'interest' = 'interest',
  'mntRewards' = 'mntRewards',
}

export type TimeframeGraphType = {
  value: ChartTimeFrame;
  config: GraphType;
};

export type NetTimeframeGraphType = {
  [ChartNetType.interest]: TimeframeGraphType[];
  [ChartNetType.mntRewards]: TimeframeGraphType[];
};
