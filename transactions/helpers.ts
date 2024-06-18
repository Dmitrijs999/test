import { TransactionStatus } from 'types';

export const isLoadingStatus = (s?: TransactionStatus): boolean => {
  if (!s) return false;
  return s === TransactionStatus.signing || s === TransactionStatus.waiting;
};

export const isEndedStatus = (s?: TransactionStatus): boolean => {
  if (!s) return false;
  return s === TransactionStatus.failed || s === TransactionStatus.succeed;
};
