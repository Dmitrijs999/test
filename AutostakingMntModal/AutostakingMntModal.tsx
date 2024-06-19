import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Title,
  Description,
  SuccessDescription,
  ModalState,
  Method,
  ButtonTitle,
} from './constants';
import { ConfirmationModal, Modal } from 'common/PopupBuilder';
import {
  dropAutostakingMntTransaction,
  isLoadingStatus,
  selectAutostakingMntTransaction,
  TransactionService,
  updateAutostakingMntTransaction,
  useAddressesQuery,
  useSetAutostakingMutation,
  useTransactionAlerts,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import { SingleCall, TransactionStatus } from 'types';
import { BuybackABI } from 'utils/constants';

const AutostakingMntModal = React.memo(function AutostakingMntModalComponent() {
  const { t } = useTranslation();
  const transaction = useAppSelector(selectAutostakingMntTransaction);
  const { data: addresses } = useAddressesQuery();
  const [invalidate] = useSetAutostakingMutation();
  const alerts = useTransactionAlerts();
  const dispatch = useAppDispatch();
  const description = useMemo(() => {
    if (!transaction) return '';
    if (transaction.status === TransactionStatus.failed) {
      return transaction.error;
    }
    if (transaction.status === TransactionStatus.succeed) {
      return t(SuccessDescription[transaction.type]);
    }
    return t(Description[transaction.type]);
  }, [transaction]);

  const onConfirm = useCallback(async () => {
    try {
      const call: SingleCall = {
        method: Method[transaction.type],
        address: addresses.Buyback_Proxy,
        abi: BuybackABI,
        args: [],
      };
      await TransactionService.callSingle(call, {
        onStart: (tx) => {
          dispatch(
            updateAutostakingMntTransaction({ ...tx, alert: alerts.signing })
          );
        },
        onSigned: (tx) => {
          dispatch(
            updateAutostakingMntTransaction({ ...tx, alert: alerts.waiting })
          );
        },
        onError: (tx) => {
          dispatch(
            updateAutostakingMntTransaction({ ...tx, alert: undefined })
          );
        },
        onSent: (tx) => {
          dispatch(
            updateAutostakingMntTransaction({ ...tx, alert: undefined })
          );
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      invalidate(null);
    }
  }, [transaction, addresses, invalidate]);
  const isTransactionLoading = isLoadingStatus(transaction?.status);
  const onClose = useCallback(() => {
    if (isTransactionLoading) return;
    dispatch(dropAutostakingMntTransaction());
  }, [dispatch, isTransactionLoading]);
  if (!transaction) return null;
  return (
    <Modal isOpen={transaction.opened}>
      <ConfirmationModal
        state={ModalState[transaction.status]}
        title={t(Title[transaction.type])}
        description={description}
        onClose={onClose}
        buttonTitle={t(ButtonTitle[transaction.type])}
        isLoading={isTransactionLoading}
        alert={transaction.alert}
        onConfirm={onConfirm}
      />
    </Modal>
  );
});

export default AutostakingMntModal;
