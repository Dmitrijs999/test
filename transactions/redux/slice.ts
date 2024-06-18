/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { AlertPayload } from 'types/components.types';

import { getActions } from 'features/utils';
import {
  MarketTransaction,
  MarketTransactionType,
  StakeMntTransaction,
  WithdrawMntTransaction,
  TransactionsState,
  TransactionStatus,
  ConfirmationType,
  CollateralTransaction,
  InputType,
  GovernanceTransaction,
  AssetsBridgeTransaction,
  WithdrawTaikoTransaction,
} from 'types';

const initialState: TransactionsState = {
  market: undefined,
  stakeMnt: undefined,
  withdrawMnt: undefined,
  withdrawTaiko: undefined,
  autostakingMnt: undefined,
  collateral: undefined,
  riskCalculationPending: false,
  oldRisk: null,
  governance: undefined,
  assetsBridge: undefined,
};

const TransactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    createMarketTransaction(
      state,
      action: PayloadAction<{ type: MarketTransactionType; symbol: string }>
    ) {
      state.market = {
        opened: true,
        type: action.payload.type,
        symbol: action.payload.symbol,
        input: '',
        tokens: BigNumber.from(0),
        usd: BigNumber.from(0),
        status: TransactionStatus.ready,
        inputType: InputType.token,
      };
    },
    updateMarketTransaction(
      state,
      action: PayloadAction<Partial<MarketTransaction>>
    ) {
      state.market = {
        ...state.market,
        ...action.payload,
      };
    },
    dropMarketTransaction(state) {
      state.market = undefined;
    },
    createStakeMntTransaction(state) {
      state.stakeMnt = {
        opened: true,
        input: '',
        tokens: BigNumber.from(0),
        usd: BigNumber.from(0),
        status: TransactionStatus.ready,
      };
    },
    updateStakeMntTransaction(
      state,
      action: PayloadAction<Partial<StakeMntTransaction>>
    ) {
      state.stakeMnt = {
        ...state.stakeMnt,
        ...action.payload,
      };
    },
    dropStakeMntTransaction(state) {
      state.stakeMnt = undefined;
    },
    createAssetsBridgeTransaction(state) {
      state.assetsBridge = {
        opened: true,
        status: TransactionStatus.ready,
      };
    },
    updateAssetsBridgeTransaction(
      state,
      action: PayloadAction<Partial<AssetsBridgeTransaction>>
    ) {
      state.assetsBridge = {
        ...state.assetsBridge,
        ...action.payload,
      };
    },
    dropAssetsBridgeTransaction(state) {
      state.assetsBridge = undefined;
    },
    createWithdrawMntTransaction(state) {
      state.withdrawMnt = {
        opened: true,
        input: '',
        tokens: BigNumber.from(0),
        usd: BigNumber.from(0),
        staked: {
          status: TransactionStatus.ready,
        },
        unstaked: {
          status: TransactionStatus.ready,
        },
        vested: {
          status: TransactionStatus.ready,
        },
      };
    },
    updateWithdrawMntTransaction(
      state,
      action: PayloadAction<Partial<WithdrawMntTransaction>>
    ) {
      state.withdrawMnt = {
        ...state.withdrawMnt,
        ...action.payload,
      };
    },
    dropWithdrawMntTransaction(state) {
      state.withdrawMnt = undefined;
    },

    createWithdrawTaikoTransaction(state) {
      state.withdrawTaiko = {
        opened: true,
        input: '',
        tokens: BigNumber.from(0),
        usd: BigNumber.from(0),
        status: TransactionStatus.ready,
      };
    },
    updateWithdrawTaikoTransaction(
      state,
      action: PayloadAction<Partial<WithdrawTaikoTransaction>>
    ) {
      state.withdrawTaiko = {
        ...state.withdrawTaiko,
        ...action.payload,
      };
    },
    dropWithdrawTaikoTransaction(state) {
      state.withdrawTaiko = undefined;
    },

    createAutostakingMntTransaction(
      state,
      action: PayloadAction<{ type: ConfirmationType }>
    ) {
      state.autostakingMnt = {
        opened: true,
        status: TransactionStatus.ready,
        type: action.payload.type,
      };
    },
    updateAutostakingMntTransaction(
      state,
      action: PayloadAction<Partial<WithdrawMntTransaction>>
    ) {
      state.autostakingMnt = {
        ...state.autostakingMnt,
        ...action.payload,
      };
    },
    dropAutostakingMntTransaction(state) {
      state.autostakingMnt = undefined;
    },
    createCollateralTransaction(
      state,
      action: PayloadAction<{
        type: ConfirmationType;
        symbol: string;
        alert?: AlertPayload;
      }>
    ) {
      state.collateral = {
        opened: true,
        status: TransactionStatus.ready,
        type: action.payload.type,
        symbol: action.payload.symbol,
        alert: action.payload.alert,
      };
    },
    updateCollateralTransaction(
      state,
      action: PayloadAction<Partial<CollateralTransaction>>
    ) {
      state.collateral = {
        ...state.collateral,
        ...action.payload,
      };
    },
    dropCollateralTransaction(state) {
      state.collateral = undefined;
    },
    setRickCalculationPending(state, action) {
      state.riskCalculationPending = action.payload.state;
      state.oldRisk = action.payload.oldRisk;
    },
    createGovernanceTransaction(state) {
      state.governance = {
        status: TransactionStatus.ready,
      };
    },
    updateGovernanceTransaction(
      state,
      action: PayloadAction<Partial<GovernanceTransaction>>
    ) {
      state.governance = {
        ...state.governance,
        ...action.payload,
      };
    },
    dropGovernanceTransaction(state) {
      state.governance = undefined;
    },
  },
});

const { actions, reducer } = TransactionsSlice;

export const TransactionsReducer = reducer;
export const TransactionsActionsKeys = getActions(TransactionsSlice);
export const {
  createMarketTransaction,
  updateMarketTransaction,
  dropMarketTransaction,
  createStakeMntTransaction,
  updateStakeMntTransaction,
  dropStakeMntTransaction,
  createWithdrawMntTransaction,
  updateWithdrawMntTransaction,
  dropWithdrawMntTransaction,
  createWithdrawTaikoTransaction,
  updateWithdrawTaikoTransaction,
  dropWithdrawTaikoTransaction,
  createAutostakingMntTransaction,
  updateAutostakingMntTransaction,
  dropAutostakingMntTransaction,
  createCollateralTransaction,
  updateCollateralTransaction,
  dropCollateralTransaction,
  setRickCalculationPending,
  createGovernanceTransaction,
  updateGovernanceTransaction,
  dropGovernanceTransaction,
  createAssetsBridgeTransaction,
  dropAssetsBridgeTransaction,
  updateAssetsBridgeTransaction,
} = actions;
