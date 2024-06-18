import { RootState } from 'features/store';
import {
  AutostakingMntTransaction,
  MarketTransaction,
  StakeMntTransaction,
  WithdrawMntTransaction,
  CollateralTransaction,
  GovernanceTransaction,
  WithdrawTaikoTransaction,
  AssetsBridgeTransaction,
} from 'types';

export const selectMarketTransaction = (
  state: RootState
): MarketTransaction | undefined => {
  return state.transactions.market;
};

export const selectStakeMntTransaction = (
  state: RootState
): StakeMntTransaction | undefined => {
  return state.transactions.stakeMnt;
};

export const selectWithdrawMntTransaction = (
  state: RootState
): WithdrawMntTransaction | undefined => {
  return state.transactions.withdrawMnt;
};

export const selectWithdrawTaikoTransaction = (
  state: RootState
): WithdrawTaikoTransaction | undefined => {
  return state.transactions.withdrawTaiko;
};

export const selectAssetsBridgeTransaction = (
  state: RootState
): AssetsBridgeTransaction | undefined => {
  return state.transactions.assetsBridge;
};

export const selectAutostakingMntTransaction = (
  state: RootState
): AutostakingMntTransaction | undefined => {
  return state.transactions.autostakingMnt;
};

export const selectCollateralTransaction = (
  state: RootState
): CollateralTransaction | undefined => {
  return state.transactions.collateral;
};

export const selectRiskCalculationPending = (
  state: RootState
): {
  riskCalculationPending: boolean;
  oldRisk: number;
} => {
  return {
    riskCalculationPending: state.transactions.riskCalculationPending,
    oldRisk: state.transactions.oldRisk,
  };
};

export const selectGovernanceTransaction = (
  state: RootState
): GovernanceTransaction | undefined => {
  return state.transactions.governance;
};
