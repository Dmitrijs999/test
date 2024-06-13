import { BigNumber } from 'ethers';

export type UserNFTResponse = {
  id: number;
  tier: number | string;
  name: string;
  emissionBoost: number | string;
  validity: number | string;
  validUntil: string;
  image: string;
  isActive: boolean;
  isStale: boolean;
};

export type BridgeMetadataResponse = {
  gasFeeEstimation: number;
  nativeFeeAmount: string;
  sendFromPayload: string;
};

/*
mntAvailableBalance: balance returned by available balance of cooldown
*/

export type IMntWithdrawResponse = {
  userBuyBackStaked: string;
  mntTotalBalance: string;
  mntAvailableBalance: string;
  currentCooldownEnd: string;
  currentCooldownStart: string;
  availableCharges: string;
  userMntAccruedDistribution: string;
  userVestingReleasable: string;
};

export type IMntWithdraw = {
  mntTotalBalance: BigNumber;
  userBuyBackStaked: BigNumber;
  userMntAccruedDistribution: BigNumber;
  userVestingReleasable: BigNumber;
  mntAvailableBalance: BigNumber;
  currentCooldownEnd: number;
  currentCooldownStart: number;
  availableCharges: number;
};

export type IMantleWithdrawResponse = {
  userWithdrawableBalance: string;
};

export type IMantleWithdraw = {
  userWithdrawableBalance: BigNumber;
};

export type IMntStakeResponse = {
  userMntUnderlyingBalance: string;
};

export type IMntStake = {
  userMntUnderlyingBalance: BigNumber;
};

export type IMantleStakeResponse = {
  userMantleUnderlyingBalance: string;
};

export type IMantleStake = {
  userMantleUnderlyingBalance: BigNumber;
};

export type IBDRAgreement = {
  endTimestamp: number;
  isActive: boolean;
  liquidityProviderBoost: string;
  distributedMnt: number;
};

export enum EventType {
  INVALID,
  LEND,
  BORROW,
  REDEEM,
  REPAY,
  AUTO_REPAY,
  SEIZE,
  TRANSFER_IN,
  TRANSFER_OUT,
}

export type EventHistoryResponseItem = {
  tx_hash: string;
  type: EventType;
  contract_address: string;
  user_address: string;
  data: Record<string, unknown>;
  block_number: number;
  timestamp: number;
  underlying_decimals: number;
  amount: string | null;
  amount_usd: string | null;
};

export type EventHistoryResponseItemExt = EventHistoryResponseItem & {
  token_symbol: string | null;
};

export type IEventHistoryItem = {
  id: string;
  type: EventType;
  date: string;
  time: string;
  underlyingDecimals: number;
  amount: string | null;
  amountUsd: string | null;
  txHash: string;
};

export type IEventHistoryItemExt = IEventHistoryItem & {
  tokenSymbol: string | null;
};

export type UserMarketData = {
  underlyingBalance: string;
  symbol: string;
  netApy: string;
  userSupplyUSD: string;
  userBorrowUSD: string;
  mntSupplyAPY: string;
  mntBorrowAPY: string;
  mantleSupplyAPY: string;
  mantleBorrowAPY: string;
  nftBdrSupplyBoost: string;
  nftBdrBorrowBoost: string;
  userSupplyUnderlying: string;
  userBorrowUnderlying: string;
  collateralStatus: boolean;
  userMarketCollateralUSD: string;
  mntSupplyAPYNumerator: string;
  mntBorrowAPYNumerator: string;
  marketSupplyUSD: string;
  marketBorrowUSD: string;
  annualIncome: string;
  apy: string;
  apr: string;
};

export type UserData = {
  totalNetApy: string;
  userTotalSupplyUSD: string;
  userTotalBorrowUSD: string;
  userTotalCollateralUSD: string;
  userTotalCollateralizedSupplyUSD: string;
  participating: boolean;
  isWhitelisted: boolean;
  collateralRatio: string;
  maxCollateralRatio: string;
  mntAPY: string;
  netInterest: string;
  emissions: string;
  govReward: string;
  userLoyaltyGroup: number;
  userLoyaltyFactor: string;
  userMntWithdrawableUSD: string;
  userBuyBackRewardsUSD: string;
  vesting: {
    totalAmount: string;
    vested: string;
    end: number;
    start: number;
    dailyVesting: string;
  };
  userMarkets: UserMarketData[];
};
