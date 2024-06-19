import { ConfirmationState } from 'common/PopupBuilder';
import { TransactionStatus } from 'types';

export const Title = {
  turnOn: 'autostakingModal.titleOn',
  turnOff: 'autostakingModal.titleOff',
};

export const Description = {
  turnOn: 'autostakingModal.automaticStakingStart',
  turnOff: 'autostakingModal.automaticStakingStop',
};

export const Method = {
  turnOn: 'participate',
  turnOff: 'leave',
};

export const SuccessDescription = {
  turnOn: 'autostakingModal.successMessageOn',
  turnOff: 'autostakingModal.successMessageOff',
};

export const ButtonTitle = {
  turnOn: 'autostakingModal.button.turnOn',
  turnOff: 'autostakingModal.button.turnOff',
};

export const ModalState: Record<TransactionStatus, ConfirmationState> = {
  [TransactionStatus.ready]: 'pending',
  [TransactionStatus.signing]: 'pending',
  [TransactionStatus.waiting]: 'pending',
  [TransactionStatus.succeed]: 'success',
  [TransactionStatus.failed]: 'error',
};
