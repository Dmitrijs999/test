import { useEffect, useMemo } from 'react';

import { Span } from '@appsignal/javascript/dist/cjs/span';
import { useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

import { setUserAddress, setWeb3Modules, logout } from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import { getWallets } from 'features/wallet/constants';
import { selectWallets } from 'features/wallet/redux';
import appsignal from 'utils/appsignal';
import { trackerControls } from 'utils/trackers';

export const useConnect = () => {
  const wallets = useAppSelector(selectWallets);
  const [{ wallet }, connect] = useConnectWallet();
  const dispatch = useAppDispatch();

  const account = wallet?.accounts[0]?.address;

  useEffect(() => {
    if (account) {
      dispatch(setUserAddress(account));
    }
  }, [dispatch, account]);

  /**
   * This workaround corrects a height calculation issue on mobile Chrome by dynamically
   * resetting the height of the Blocknative popup background to match the current viewport.
   * It uses a MutationObserver to monitor the DOM for the presence of the popup background
   * element.
   */

  useEffect(() => {
    const resizePopupBackground = () => {
      const onboardComponent = document.querySelector('onboard-v2');
      if (onboardComponent && onboardComponent.shadowRoot) {
        const shadowRoot = onboardComponent.shadowRoot;
        const popupBackground = shadowRoot.querySelector(
          '.full-screen-background'
        ) as HTMLElement;
        if (popupBackground) {
          popupBackground.style.willChange = 'height';
          popupBackground.style.transition = 'height 0.3s ease-out';
          popupBackground.style.height = `${window.innerHeight}px`;
        }
      }
    };

    const mutationObserver = new MutationObserver(resizePopupBackground);
    mutationObserver.observe(document.querySelector('onboard-v2').shadowRoot, {
      childList: true,
      subtree: true,
    });

    resizePopupBackground();

    window.addEventListener('resize', resizePopupBackground);
    window.addEventListener('orientationchange', resizePopupBackground);

    return () => {
      window.removeEventListener('resize', resizePopupBackground);
      window.removeEventListener('orientationchange', resizePopupBackground);
      mutationObserver.disconnect();
    };
  }, []);

  return async (params?: {
    autoSelect: { label: string; disableModals: boolean };
  }) => {
    try {
      if (!params) {
        trackerControls.setLoginAttempt();
      }

      if (!wallets.length) {
        const wallets = await getWallets();

        dispatch(setWeb3Modules(wallets));
      }

      return await connect(params);
    } catch (error) {
      trackerControls.trackLoginError(error);
      appsignal.sendError(error, (span: Span) => {
        span.setAction('ConnectWallet');
      });
    }
  };
};

export const useLogout = (): (() => void) => {
  const [{ wallet }, , disconnect] = useConnectWallet();
  const history = useHistory();
  const dispatch = useAppDispatch();

  return async () => {
    await disconnect(wallet);
    logout(dispatch);
    history.replace({ search: '' });
  };
};

export const useWalletProvider = (): ethers.providers.Web3Provider | null => {
  const [{ wallet }] = useConnectWallet();

  const provider = useMemo(
    () => (wallet ? new ethers.providers.Web3Provider(wallet.provider) : null),
    [wallet]
  );

  return provider;
};
