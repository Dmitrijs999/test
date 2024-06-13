import { ethers } from 'ethers';

export enum Networks {
  Hardhat = 'hardhat',
  Ganache = 'ganache',
  Rinkeby = 'rinkeby',
  Sepolia = 'sepolia',
  ForkedMainnet = 'forkedMainnet',
  Mainnet = 'mainnet',
  MantleTestnet = 'mantleTestnet',
  MantleMainnet = 'mantleMainnet',
  MantleSepolia = 'mantleSepolia',
}

export const ChainIds = {
  [Networks.Hardhat]: 31337,
  [Networks.Ganache]: 1337,
  [Networks.Rinkeby]: 4,
  [Networks.Sepolia]: 11155111,
  [Networks.ForkedMainnet]: 1338,
  [Networks.Mainnet]: 1,
  [Networks.MantleTestnet]: 5003,
  [Networks.MantleMainnet]: 5000,
};
export const ChainNames = {
  [Networks.Hardhat]: 'Hardhat',
  [Networks.Ganache]: 'Ganache',
  [Networks.Rinkeby]: 'Rinkeby',
  [Networks.Sepolia]: 'Sepolia',
  [Networks.ForkedMainnet]: 'Forked Mainnet',
  [Networks.Mainnet]: 'Ethereum Mainnet',
  [Networks.MantleTestnet]: 'Mantle Testnet',
  [Networks.MantleMainnet]: 'Mantle Mainnet',
  [Networks.MantleSepolia]: 'Mantle Sepolia',
};
export type ApiProvider =
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider;

export interface NetworkConfig {
  chainId: number;
  httpRpc: string;
  wssRpc: string;
  publicName: string;
  blockExplorerUrl: string;
  addNetworkParams: any[];
  switchNetworkParams?: any[];
  bridgeExplorerUrl?: string;
}

export interface NetworkState {
  api?: ApiProvider;
  connecting: boolean;
  error?: string;
  chainId?: number;
}

//FIXME: Check this type for outdated contracts
export type ContractAddressesResponse = {
  BDSystem: string;
  Buyback_Proxy: string;
  BuybackDripper: string;
  ChainlinkPriceOracle: string;
  EmissionBooster_Proxy: string;
  mDAI_Proxy: string;
  MinterestNFT: string;
  Mnt: string;
  MNTSource: string;
  mUSDC_Proxy: string;
  mUSDT_Proxy: string;
  mWBTC_Proxy: string;
  mWETH_Proxy: string;
  SupervisorTestnet_Proxy?: string;
  Supervisor_Proxy: string;
  Vesting: string;
  Whitelist: string;
  RewardsHub_Proxy: string;
  MntGovernor: string;
  MntVote: string;
  ProxyONFT1155: string;
  MntProxyOft: string;
  IncentiveEmissionHub: string;
};

export type BenchmarkCase = { name: string; gas: number };
export type BenchmarkCostsResponse = Record<
  string,
  {
    methodId: string;
    source: string;
    signature: string;
    cases: BenchmarkCase[];
  }
>;

export enum ContractNames {
  Mnt = 'Mnt',
  Buyback = 'Buyback',
  Vesting = 'Vesting',
  Supervisor = 'Supervisor',
  RewardsHub = 'RewardsHub',
}
