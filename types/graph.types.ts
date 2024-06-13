export interface IBarGraphPoint {
  label: string;
  percent: number;
  color: string;
}

export interface IBarGraphConfig {
  supply?: IBarGraphPoint[];
  borrow?: IBarGraphPoint[];
}
