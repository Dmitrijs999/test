import React, { useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ModalState,
  Title,
  SuccessDescription,
  Description,
  ButtonTitle,
} from './constants';
import { ConfirmationModal, Modal } from 'common/PopupBuilder';
import {
  selectCollateralTransaction,
  useCollateralMutation,
  TransactionService,
  updateCollateralTransaction,
  dropCollateralTransaction,
  isLoadingStatus,
  useTransactionAlerts,
  getMarketName,
  useGetMarketsDataQuery,
  getMarketData,
  useAddressesQuery,
} from 'features';
import { useAppSelector, useAppDispatch } from 'features/store';
import { SingleCall, TransactionStatus } from 'types';
import { SupervisorABI } from 'utils/constants';

const CollateralModal = React.memo(function CollateralModalComponent() {
  const { t } = useTranslation();
  const transaction = useAppSelector(selectCollateralTransaction);
  const dispatch = useAppDispatch();
  const { data: addresses } = useAddressesQuery();
  const { data: marketsData } = useGetMarketsDataQuery();
  const alerts = useTransactionAlerts();
  const [invalidate] = useCollateralMutation();

  const description = useMemo(() => {
    if (!transaction) return '';
    if (transaction.status === TransactionStatus.failed) {
      return transaction.error;
    }
    if (transaction.status === TransactionStatus.succeed) {
      return t(SuccessDescription[transaction.type], {
        assetName: getMarketName(transaction.symbol),
      });
    }
    return t(Description[transaction.type]);
  }, [transaction]);

  const onConfirm = useCallback(async () => {
    const marketData = getMarketData(marketsData, transaction.symbol);
    if (!marketData) return;

    const args = {
      turnOn: {
        method: 'enableAsCollateral',
        address: [marketData.meta.address],
      },
      turnOff: {
        method: 'disableAsCollateral',
        address: marketData.meta.address,
      },
    };
    try {
      const call: SingleCall = {
        method: args[transaction.type].method,
        address: addresses.Supervisor_Proxy,
        abi: SupervisorABI,
        args: [args[transaction.type].address],
      };
      await TransactionService.callSingle(call, {
        onStart: (tx) => {
          dispatch(
            updateCollateralTransaction({ ...tx, alert: alerts.signing })
          );
        },
        onSigned: (tx) => {
          dispatch(
            updateCollateralTransaction({ ...tx, alert: alerts.waiting })
          );
        },
        onError: (tx) => {
          dispatch(updateCollateralTransaction({ ...tx, alert: undefined }));
        },
        onSent: (tx) => {
          dispatch(updateCollateralTransaction({ ...tx, alert: undefined }));
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
    dispatch(dropCollateralTransaction());
  }, [dispatch, isTransactionLoading]);
  if (!transaction) return null;

  return (
    <Modal isOpen={transaction.opened}>
      <ConfirmationModal
        state={ModalState[transaction.status]}
        title={t(Title[transaction.type])}
        description={description}
        onClose={onClose}
        buttonTitle={t(ButtonTitle[transaction.type], {
          assetName: getMarketName(transaction.symbol),
        })}
        isLoading={isTransactionLoading}
        alert={transaction.alert}
        onConfirm={onConfirm}
      />
    </Modal>
  );
});

export default CollateralModal;
