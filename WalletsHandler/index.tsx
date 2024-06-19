import React, { useCallback, useEffect } from 'react';

import { Span } from '@appsignal/javascript/dist/cjs/span';
import { useConnectWallet, useAccountCenter } from '@web3-onboard/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import classes from './NetworkModal.module.scss';
import { ConfirmationModal, Modal } from 'common/PopupBuilder';
import {
  selectIsNetworkSupported,
  setUserWallet,
  switchNetwork,
  setNetwork,
  useLogout,
  useSaveSessionMutation,
} from 'features';
import { useAppSelector } from 'features/store';
import { WalletProviders } from 'types';
import { getDeviceType } from 'utils';
import appsignal from 'utils/appsignal';
import { trackerControls } from 'utils/trackers';

const { ethereum } = window as any;

const WalletsHandler: React.FC = () => {
  const [{ wallet }] = useConnectWallet();

  const onLogout = useLogout();
  const dispatch = useDispatch();
  const [handleSession] = useSaveSessionMutation();
  const updateAccountCenter = useAccountCenter();

  useEffect(() => {
    if (wallet) {
      updateAccountCenter({ enabled: false });
    }
  }, [wallet]);

  const account = wallet?.accounts[0]?.address;

  const saveSession = useCallback(
    async (walletType: WalletProviders) => {
      if (account) {
        const response = await handleSession({
          accountAddress: account,
          walletType,
          deviceType: getDeviceType(),
        });
        if ('error' in response) {
          appsignal.sendError(
            new Error(JSON.stringify(response.error)),
            (span: Span) => {
              span.setAction('SaveOffchainerSession');
              span.setParams({
                user: account,
                walletType,
                deviceType: getDeviceType(),
              });
            }
          );
        }
      }
    },
    [handleSession, account]
  );

  useEffect(() => {
    if (!wallet?.label) return;

    if (wallet.label === 'Detected Wallet') {
      // @ts-ignore
      if (ethereum?.isBybit) {
        wallet.label = WalletProviders.ByBitWallet;
      }
    }

    dispatch(setUserWallet(wallet.label as WalletProviders));
    // skip reconnection
    if (!localStorage.getItem('walletID')) {
      saveSession(wallet.label as WalletProviders);
    }
    localStorage.setItem('walletID', wallet.label);
    if (account && wallet) trackerControls.trackLogin(account, wallet.label);

    const walletProviders = Object.values(WalletProviders) as string[];
    if (walletProviders.includes(wallet.label)) {
      switchNetwork();

      if (ethereum && ethereum.on) {
        const handleNetworkChanged = (network: string) => {
          dispatch(setNetwork(Number(network)));
        };

        ethereum.on('networkChanged', handleNetworkChanged);
        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener('networkChanged', handleNetworkChanged);
          }
        };
      }
    }
  }, [wallet?.label, dispatch, saveSession]);

  const { t } = useTranslation();
  const isNetworkSupported = useAppSelector(selectIsNetworkSupported);

  useEffect(() => {
    if (!isNetworkSupported) {
      trackerControls.trackLoginNetworkError();
    }
  }, [isNetworkSupported]);

  return (
    <Modal
      isOpen={account && !isNetworkSupported}
      shouldCloseOnOverlayClick={true}
      onRequestClose={onLogout}
      overlayClassName={classes.modalOverlay}
    >
      <ConfirmationModal
        state='error'
        title={t('networkWarningModal.title')}
        onClose={onLogout}
        description={
          t('networkWarningModal.description') +
          '\n' +
          t('networkWarningModal.footerDescription')
        }
      />
    </Modal>
  );
};

export default WalletsHandler;
