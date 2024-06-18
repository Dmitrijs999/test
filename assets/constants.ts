import {
  ETHIcon,
  WETHIcon,
  DAIIcon,
  USDCIcon,
  USDTIcon,
  DefaultTokenIcon,
  MantleSmallBlackIcon,
  EthereumSwitcherIcon,
  TaikoSwitcherIcon,
  BTCIcon,
  TaikoIcon,
} from 'assets/svg';
import { AssetsKeys, Networks, SVGIcon } from 'types';

const TokenIcons: Record<string, SVGIcon> = {
  weth: WETHIcon,
  eth: ETHIcon,
  wbtc: BTCIcon,
  dai: DAIIcon,
  usdc: USDCIcon,
  usdt: USDTIcon,
  taiko: TaikoIcon,
};
export const getTokenIcon = (symbol: string): SVGIcon => {
  return TokenIcons[symbol.toLowerCase()] ?? DefaultTokenIcon;
};

const NetworkIcons: Record<Networks, SVGIcon> = {
  [Networks.Mainnet]: EthereumSwitcherIcon,
  [Networks.MantleMainnet]: MantleSmallBlackIcon,
  [Networks.MantleSepolia]: MantleSmallBlackIcon,
  [Networks.MantleTestnet]: MantleSmallBlackIcon,
  [Networks.Hardhat]: EthereumSwitcherIcon,
  [Networks.Ganache]: EthereumSwitcherIcon,
  [Networks.Rinkeby]: EthereumSwitcherIcon,
  [Networks.Sepolia]: EthereumSwitcherIcon,
  [Networks.ForkedMainnet]: EthereumSwitcherIcon,
  [Networks.TaikoTestnet]: TaikoSwitcherIcon,
  [Networks.TaikoMainnet]: TaikoSwitcherIcon,
};
export const getNetworkIcons = (network: Networks): SVGIcon => {
  return NetworkIcons[network] ?? DefaultTokenIcon;
};

export const getMarketIcon = (marketSymbol: string): SVGIcon => {
  return getTokenIcon(marketSymbol.slice(1));
};

const TokenSymbol: Record<string, string> = {
  eth: 'ETH',
  mnt: 'MNT',
  weth: 'WETH',
  wmnt: 'WMNT',
  dai: 'DAI',
  usdc: 'USDC',
  usdt: 'USDT',
  usdy: 'USDY',
  meth: 'mETH',
  wbtc: 'WBTC',
  minty: 'MINTY',
  taiko: 'TAIKO',
};

export const getTokenSymbol = (symbol: string): string => {
  return TokenSymbol[symbol.toLowerCase()] ?? symbol;
};

export const getMarketName = (symbol: string): string => {
  return getTokenSymbol(symbol.slice(1));
};

export const getMarketNameWithOverride = (symbol: string): string => {
  return symbol.toLowerCase() == 'mweth' ? 'ETH/WETH' : getMarketName(symbol);
};

export const AssetsTitlesByKey = {
  [AssetsKeys.totalSupplyUSD]: 'protocolGeneralValues.totalLent.title',
  [AssetsKeys.yourTotalSupplyUSD]: 'protocolGeneralValues.yourTotalLent.title',
  [AssetsKeys.netApy]: 'protocolGeneralValues.netAPY.title',
  [AssetsKeys.totalBorrowBalanceUSD]:
    'protocolGeneralValues.totalBorrowed.title',
  [AssetsKeys.yourTotalBorrowBalanceUSD]:
    'protocolGeneralValues.yourTotalBorrowed.title',
  [AssetsKeys.tvl]: 'protocolGeneralValues.tvl.title',
  [AssetsKeys.utilization]: 'protocolGeneralValues.utilization.title',
};

export const AssetsTooltipsByKey = {
  [AssetsKeys.totalSupplyUSD]: 'protocolGeneralValues.totalLent.tooltip',
  [AssetsKeys.yourTotalSupplyUSD]:
    'protocolGeneralValues.yourTotalLent.tooltip',
  [AssetsKeys.netApy]: 'protocolGeneralValues.netAPY.tooltip',
  [AssetsKeys.totalBorrowBalanceUSD]:
    'protocolGeneralValues.totalBorrowed.tooltip',
  [AssetsKeys.yourTotalBorrowBalanceUSD]:
    'protocolGeneralValues.yourTotalBorrowed.tooltip',
};
