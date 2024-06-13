import { SVGIcon } from './components.types';

export enum MANTLESources {
  staked = 'staked',
  unstaked = 'unstaked',
  vested = 'vested',
}

export type MantleDetails = {
  name: string;
  icon: SVGIcon;
  decimals: number;
  address: string;
};
