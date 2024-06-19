import { MarketTransactionType } from 'types';

export const ModalTitles: Record<MarketTransactionType, string> = {
  supply: 'basicOperations.lend.modalTitle',
  borrow: 'basicOperations.borrow.modalTitle',
  redeem: 'basicOperations.withdraw.modalTitle',
  repay: 'basicOperations.repay.modalTitle',
};

export const ButtonTitles: Record<MarketTransactionType, string> = {
  supply: 'basicOperations.lend.buttonTitle',
  borrow: 'basicOperations.borrow.buttonTitle',
  redeem: 'basicOperations.withdraw.buttonTitle',
  repay: 'basicOperations.repay.buttonTitle',
};

export const ApiType: Record<MarketTransactionType, string> = {
  borrow: 'borrow',
  supply: 'supply',
  redeem: 'redeemUnderlying',
  repay: 'repayBorrow',
};

export const ButtonVariant: Record<MarketTransactionType, string> = {
  borrow: 'secondary',
  supply: 'primary',
  redeem: 'primary',
  repay: 'secondary',
};

export const SucceedTransactionAliases: Record<MarketTransactionType, string> =
  {
    supply: 'marketTransactionModal.status.supplied',
    borrow: 'marketTransactionModal.status.borrowed',
    redeem: 'marketTransactionModal.status.withdrawn',
    repay: 'marketTransactionModal.status.repayed',
  };

export const FailedTransactionAliases: Record<MarketTransactionType, string> = {
  supply: 'marketTransactionModal.supply',
  borrow: 'marketTransactionModal.borrow',
  redeem: 'marketTransactionModal.redeem',
  repay: 'marketTransactionModal.repay',
};
