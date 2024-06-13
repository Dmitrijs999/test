export type PausedOperation = {
  contractAddress: string;
  subject: string;
  operation: string;
};

export type GetGasPriceResponse = {
  baseFeePerGas: string[];
  gasUsedRation: number[];
  oldestBlock: string;
};

export type MiddleValueOfGBaseFeePerGas = {
  middleValue: number;
};

export type OraclePricesResponse = {
  mntOraclePriceUSD: string;
  markets: {
    symbol: string;
    oraclePriceUSD: string;
  }[];
};

export type Feature = {
  featureId: number;
  featureName: string;
  isWhitelistEnabled: boolean;
  whiteListedWallets: string[];
};

export type FeatureFlagsState = {
  features: Feature[];
  isLoading: boolean;
  error: string | null;
};
