import { WalletInit } from '@web3-onboard/common';

import { SVGIcon } from './components.types';

export interface IWallet {
  id: string;
  logo: SVGIcon;
  smallLogo: SVGIcon;
  name: string;
  provider: WalletProviders;
  module: WalletInit;
}

export enum WalletProviders {
  Metamask = 'MetaMask',
  SafePal = 'SafePal',
  WalletConnect = 'WalletConnect',
  UnstoppableDomains = 'Unstoppable',
  MathWallet = 'MathWallet',
  BitGet = 'BitKeep',
  RabbyWallet = 'Rabby Wallet',
  Okx = 'OKX Wallet',
  ByBitWallet = 'ByBit Wallet',
}

export interface WalletState {
  wallets: IWallet[];
  account?: string;
  wallet?: WalletProviders;
}
