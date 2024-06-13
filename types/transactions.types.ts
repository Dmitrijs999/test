import { BigNumber } from 'ethers';

import { AlertPayload } from './components.types';
import { MNTSources } from './mnt.types';

export type MarketTransactionType = 'supply' | 'borrow' | 'redeem' | 'repay';
export type ConfirmationType = 'turnOn' | 'turnOff';
export type ABIInterface = Array<string>;
export type SingleCall = {
  method: string;
  abi: ABIInterface;
  address: string;
  args: unknown[];
  benchmark?: string;
  value?: BigNumber;
  data?: string;
};

export type MultiCall = {
  abi: ABIInterface;
  address: string;
  calls: { method: string; args: unknown[]; benchmark?: string }[];
};

export type TCall = SingleCall | MultiCall;

export type CallSchema = TCall[];

export enum TransactionStatus {
  ready = 'ready',
  signing = 'signing',
  waiting = 'waiting',
  succeed = 'succeed',
  failed = 'failed',
}

export type TxDetails = {
  hash?: string;
  timestamp?: string;
  amount?: BigNumber;
  amountUsd?: BigNumber;
  gas?: BigNumber;
  gasUsd?: BigNumber;
};

export type Transaction = {
  status: TransactionStatus;
  error?: string;
  details?: TxDetails;
  schema?: CallSchema;
  statusCode?: number;
};

export enum InputType {
  usd,
  token,
}

type ConfirmationTransaction = { type: ConfirmationType };

type TransactionWithPayload = {
  input: string;
  tokens: BigNumber;
  usd: BigNumber;
};

type TransactionWithAlert = {
  alert?: AlertPayload;
};

type ModalState = {
  opened: boolean;
};

export type MarketTransaction = ModalState &
  Transaction &
  TransactionWithAlert &
  TransactionWithPayload & {
    type: MarketTransactionType;
    symbol: string;
    inputType: InputType;
  };

export type StakeMntTransaction = ModalState &
  Transaction &
  TransactionWithAlert &
  TransactionWithPayload;

export type WithdrawSourceTransaction = Transaction & TransactionWithAlert;

export type GovernanceTransaction = Transaction & TransactionWithAlert;

export type WithdrawMntTransaction = ModalState &
  TransactionWithPayload &
  TransactionWithAlert & {
    [MNTSources.staked]: WithdrawSourceTransaction;
    [MNTSources.unstaked]: WithdrawSourceTransaction;
    [MNTSources.vested]: WithdrawSourceTransaction;
  };
export type WithdrawMantleTransaction = ModalState &
  Transaction &
  TransactionWithAlert &
  TransactionWithPayload;

export type AssetsBridgeTransaction = ModalState &
  Transaction &
  TransactionWithAlert;

export type AutostakingMntTransaction = ModalState &
  Transaction &
  TransactionWithAlert &
  ConfirmationTransaction;

export type CollateralTransaction = ModalState &
  Transaction &
  TransactionWithAlert &
  ConfirmationTransaction & { symbol: string };

export type TransactionsState = {
  market: MarketTransaction | undefined;
  stakeMnt: StakeMntTransaction | undefined;
  withdrawMnt: WithdrawMntTransaction | undefined;
  withdrawMantle: WithdrawMantleTransaction | undefined;
  assetsBridge: AssetsBridgeTransaction | undefined;
  autostakingMnt: AutostakingMntTransaction | undefined;
  collateral: CollateralTransaction | undefined;
  riskCalculationPending: boolean;
  oldRisk: number;
  governance: GovernanceTransaction | undefined;
};
