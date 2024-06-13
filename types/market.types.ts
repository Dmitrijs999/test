import { SVGIcon } from './components.types';

export type TokenInfo = {
  symbol: string;
  decimals: number;
  address?: string;
  isNative: boolean;
  icon?: SVGIcon;
};

export type MarketMeta = {
  address: string;
  symbol: string;
  marketDecimals: number;
  underlying: string;
  underlyingDecimals: number;
  underlyingTokenInfo: TokenInfo; // Wrapped token / default token meta
  alternativeUnderlyingTokenInfo: TokenInfo | null; // Unwrapped token meta
};

export type ExtMarketMeta = MarketMeta & {
  name: string;
  icon: SVGIcon;
};

export type MarketEconomic = {
  marketSupplyUSD: string;
  marketBorrowUSD: string;
  marketValueLockedUSD: string;
  apy: string;
  apr: string;
  marketSupplyUnderlying: string;
  marketBorrowUnderlying: string;
  marketMntSupplyAPY: string;
  marketMntBorrowAPY: string;
  marketMantleSupplyAPY: string;
  marketMantleBorrowAPY: string;
  marketLiquidityUnderlying: string;
  marketValueLocked: string;
  marketReservesUnderlying: string;
  utilisationRate: string;
  reserveRate: string;
  utilisationFactor: string;
  exchangeRate: string;
};

export type MarketStatistic = {
  numberOfSuppliers: number;
  numberOfBorrowers: number;
};

export type MarketData = {
  meta: MarketMeta;
  economic: MarketEconomic;
  statistics: MarketStatistic;
};

export type MarketsData = {
  totalSupplyUSD: string;
  totalBorrowUSD: string;
  totalSupplyWeekDeltaUSD: string;
  totalBorrowWeekDeltaUSD: string;
  markets: MarketData[];
};
