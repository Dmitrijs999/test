import { ConfirmationState } from 'common/PopupBuilder';
import { TransactionStatus } from 'types';

export const Title = {
  turnOn: 'collateralModal.titleOn',
  turnOff: 'collateralModal.titleOff',
};

export const Description = {
  turnOn: 'collateralModal.descriptionOn',
  turnOff: 'collateralModal.descriptionOff',
};

export const Method = {
  turnOn: 'enableAsCollateral',
  turnOff: 'disableAsCollateral',
};

export const SuccessDescription = {
  turnOn: 'collateralModal.successMessageOn',
  turnOff: 'collateralModal.successMessageOff',
};

export const ButtonTitle = {
  turnOn: 'collateralModal.button.turnOn',
  turnOff: 'collateralModal.button.turnOff',
};

export const ModalState: Record<TransactionStatus, ConfirmationState> = {
  [TransactionStatus.ready]: 'pending',
  [TransactionStatus.signing]: 'pending',
  [TransactionStatus.waiting]: 'pending',
  [TransactionStatus.succeed]: 'success',
  [TransactionStatus.failed]: 'error',
};
