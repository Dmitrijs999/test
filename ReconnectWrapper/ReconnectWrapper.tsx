import React, { useEffect, useState } from 'react';

import { CommonLoader } from 'common';
import { useConnect } from 'features';
import { WalletProviders } from 'types';

const { ethereum } = window as any;

export const ReconnectWrapper: React.FC<React.PropsWithChildren<any>> = ({
  children,
}) => {
  const connect = useConnect();
  const [reconnection, setReconnection] = useState(true);
  useEffect(() => {
    const checkAuthorized = async () => {
      const walletID = localStorage.getItem('walletID');
      let shouldReconnect = false;
      switch (walletID) {
        case WalletProviders.UnstoppableDomains:
        case WalletProviders.Metamask: {
          try {
            // For Onto wallet the error is thrown while updating app page if wallet is connected
            shouldReconnect = ethereum?.isConnected();
          } catch (error) {
            console.log(error);
            shouldReconnect = true;
          }
          break;
        }
        case WalletProviders.WalletConnect: {
          const rawSessionData = localStorage.getItem(
            'wc@2:client:0.3//session'
          );

          shouldReconnect = false;

          if (!rawSessionData) {
            break;
          }

          const currentTime = Math.floor(Date.now() / 1000);
          const sessionArray = JSON.parse(rawSessionData);

          for (const sessionData of sessionArray) {
            if (sessionData.expiry && sessionData.expiry > currentTime) {
              if (sessionData.acknowledged) {
                shouldReconnect = true;
                break;
              }
            }
          }

          break;
        }
        default:
          break;
      }
      if (!shouldReconnect) return setReconnection(false);
      try {
        await connect({
          autoSelect: { label: walletID, disableModals: true },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setReconnection(false);
      }
    };
    checkAuthorized();
  }, []);
  if (reconnection) {
    return <CommonLoader />;
  }
  return children;
};
