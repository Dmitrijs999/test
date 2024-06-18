import config from 'config';
import {
  MarketData,
  MarketsData,
  OraclePricesResponse,
  UserData,
  UserMarketData,
} from 'types';

export const getActiveMarketList = (
  marketsData?: MarketsData
): MarketData[] => {
  if (marketsData) {
    return marketsData.markets.filter(
      (ms) => !config.FEATURE.HIDE_ASSETS.includes(ms.meta.symbol.toLowerCase())
    );
  }
  return [];
};

export const getMarketData = (
  marketsData?: MarketsData,
  symbol?: string
): MarketData | undefined => {
  if (!marketsData || !symbol) return;
  return marketsData.markets.find(
    (md) => md.meta.symbol.toLowerCase() === symbol.toLowerCase()
  );
};

export const getUserMarketData = (
  userData?: UserData,
  symbol?: string
): UserMarketData | undefined => {
  if (!userData || !symbol) return;
  return userData.userMarkets.find(
    (umd) => umd.symbol.toLowerCase() === symbol.toLowerCase()
  );
};

export const getMarketOraclePrice = (
  prices?: OraclePricesResponse,
  symbol?: string
): string | undefined => {
  if (!prices || !symbol) return;
  return prices.markets.find(
    (p) => p.symbol.toLowerCase() === symbol.toLowerCase()
  )?.oraclePriceUSD;
};
