import { SVGIcon } from './components.types';

export enum MNTSources {
  unstaked = 'unstaked',
  staked = 'staked',
  vested = 'vested',
}

export type MntDetails = {
  name: string;
  icon: SVGIcon;
  decimals: number;
  address: string;
};
