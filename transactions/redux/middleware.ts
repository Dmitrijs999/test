import { Middleware } from 'redux';

import {
  selectAutostakingMntTransaction,
  selectCollateralTransaction,
  selectMarketTransaction,
  selectStakeMntTransaction,
  selectWithdrawMntTransaction,
} from './selectors';
import { TransactionsActionsKeys } from './slice';
import {
  ConfirmationType,
  MarketTransactionType,
  MNTSources,
  TransactionStatus,
  WithdrawMntTransaction,
} from 'types';
import { trackerControls, TrackTxType } from 'utils/trackers';

type CommonArguments = {
  error_description?: string;
  source?: MNTSources;
};

const getSource = (payload: Partial<WithdrawMntTransaction>): MNTSources => {
  if (payload.staked) return MNTSources.staked;
  if (payload.unstaked) return MNTSources.unstaked;
  if (payload.vested) return MNTSources.vested;
};

const trackStatusUpdate = (
  prevStatus: TransactionStatus,
  currentStatus: TransactionStatus,
  type: TrackTxType,
  args?: CommonArguments
): void => {
  if (
    prevStatus === TransactionStatus.ready &&
    currentStatus === TransactionStatus.signing
  ) {
    trackerControls.trackTransactionPending(type, args);
  } else if (
    prevStatus === TransactionStatus.waiting &&
    currentStatus === TransactionStatus.succeed
  ) {
    trackerControls.trackTransactionPending(type, args);
  } else if (
    prevStatus === TransactionStatus.waiting &&
    currentStatus === TransactionStatus.failed
  ) {
    trackerControls.trackTransactionError(type, args);
  }
};

export const trackTransactionsMiddleware: Middleware =
  (store) => (next) => (action) => {
    try {
      switch (action.type) {
        case TransactionsActionsKeys.createMarketTransaction: {
          trackerControls.trackTransactionInit(
            action.payload.type as MarketTransactionType
          );
          break;
        }
        case TransactionsActionsKeys.createStakeMntTransaction: {
          trackerControls.trackTransactionInit('stake');
          break;
        }
        case TransactionsActionsKeys.createAutostakingMntTransaction: {
          const type = action.payload.type as ConfirmationType;
          trackerControls.trackTransactionInit(
            type === 'turnOn' ? 'participate' : 'leave'
          );
          break;
        }
        case TransactionsActionsKeys.createWithdrawMntTransaction: {
          trackerControls.trackTransactionInit('withdraw_mnt');
          break;
        }
        case TransactionsActionsKeys.createCollateralTransaction: {
          const type = action.payload.type as ConfirmationType;
          trackerControls.trackTransactionInit(
            type === 'turnOn' ? 'enableCollateral' : 'disableCollateral'
          );
          break;
        }
        case TransactionsActionsKeys.updateMarketTransaction: {
          const tx = selectMarketTransaction(store.getState());
          const status = action.payload.status as TransactionStatus;
          const txType = action.payload.status as MarketTransactionType;
          const args: CommonArguments = {};
          if (status === TransactionStatus.failed) {
            args.error_description = action.payload.error;
          }
          trackStatusUpdate(tx.status, status, txType, args);
          break;
        }
        case TransactionsActionsKeys.updateStakeMntTransaction: {
          const tx = selectStakeMntTransaction(store.getState());
          const status = action.payload.status as TransactionStatus;
          const args: CommonArguments = {};
          if (status === TransactionStatus.failed) {
            args.error_description = action.payload.error;
          }
          trackStatusUpdate(tx.status, status, 'stake', args);
          break;
        }
        case TransactionsActionsKeys.updateAutostakingMntTransaction: {
          const tx = selectAutostakingMntTransaction(store.getState());
          const confType = action.payload.type as ConfirmationType;
          const txType = confType === 'turnOn' ? 'participate' : 'leave';
          const status = action.payload.status as TransactionStatus;
          const args: CommonArguments = {};
          if (status === TransactionStatus.failed) {
            args.error_description = action.payload.error;
          }
          trackStatusUpdate(tx.status, status, txType, args);
          break;
        }
        case TransactionsActionsKeys.updateCollateralTransaction: {
          const tx = selectCollateralTransaction(store.getState());
          const confType = action.payload.type as ConfirmationType;
          const txType =
            confType === 'turnOn' ? 'enableCollateral' : 'disableCollateral';
          const status = action.payload.status as TransactionStatus;
          const args: CommonArguments = {};
          if (status === TransactionStatus.failed) {
            args.error_description = action.payload.error;
          }
          trackStatusUpdate(tx.status, status, txType, args);
          break;
        }
        case TransactionsActionsKeys.updateWithdrawMntTransaction: {
          const source = getSource(action.payload);
          const tx = selectWithdrawMntTransaction(store.getState())[source];
          const status = action.payload[source] as TransactionStatus;
          const args: CommonArguments = { source };
          if (status === TransactionStatus.failed) {
            args.error_description = action.payload.error;
          }
          trackStatusUpdate(tx.status, status, 'withdraw_mnt', args);
          break;
        }
      }
    } catch (e) {
      console.log('error while tracking transactions', e);
    }
    return next(action);
  };
