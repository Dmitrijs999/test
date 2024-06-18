import React, { useEffect, useState } from 'react';

import { OverlayLoader } from '@minterest-finance/ui-kit';
import { Web3OnboardProvider, init } from '@web3-onboard/react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_NETWORK } from 'features/index';
import { useAppSelector } from 'features/store';
import { selectWallets } from 'features/wallet/redux';
import { Languages } from 'utils';

import './Web3Provider.module.scss';

const chains = [
  {
    id: DEFAULT_NETWORK.addNetworkParams[0].chainId,
    token: DEFAULT_NETWORK.addNetworkParams[0].nativeCurrency.symbol,
    label: DEFAULT_NETWORK.publicName,
    rpcUrl: DEFAULT_NETWORK.httpRpc,
    blockExplorerUrl: DEFAULT_NETWORK.blockExplorerUrl,
  },
];

const translationOptions = {
  lng: Languages.en,
};

export const Web3Provider = ({ children }) => {
  const [web3Onboard, setWeb3Onboard] = useState(null);
  const wallets = useAppSelector(selectWallets);
  const { t } = useTranslation();

  const walletsModules = wallets.map((w) => w.module);

  useEffect(() => {
    setWeb3Onboard(
      init({
        i18n: {
          [Languages.en]: {
            connect: {
              selectingWallet: {
                header: t(
                  'blocknative.connect.selectingWallet.header',
                  translationOptions
                ),
                sidebar: {
                  heading: t(
                    'blocknative.connect.selectingWallet.sidebar.heading',
                    translationOptions
                  ),
                  subheading: t(
                    'blocknative.connect.selectingWallet.sidebar.subheading',
                    translationOptions
                  ),
                  paragraph: t(
                    'blocknative.connect.selectingWallet.sidebar.paragraph',
                    translationOptions
                  ),
                },
                recommendedWalletsPart1: t(
                  'blocknative.connect.selectingWallet.recommendedWalletsPart1',
                  translationOptions
                ),
                recommendedWalletsPart2: t(
                  'blocknative.connect.selectingWallet.recommendedWalletsPart2',
                  translationOptions
                ),
                installWallet: t(
                  'blocknative.connect.selectingWallet.installWallet',
                  translationOptions
                ),
                agreement: {
                  agree: t(
                    'blocknative.connect.selectingWallet.agreement.agree',
                    translationOptions
                  ),
                  terms: t(
                    'blocknative.connect.selectingWallet.agreement.terms',
                    translationOptions
                  ),
                  and: t(
                    'blocknative.connect.selectingWallet.agreement.and',
                    translationOptions
                  ),
                  privacy: t(
                    'blocknative.connect.selectingWallet.agreement.privacy',
                    translationOptions
                  ),
                },
              },
              connectingWallet: {
                header: t(
                  'blocknative.connect.connectingWallet.header',
                  translationOptions
                ),
                sidebar: {
                  subheading: t(
                    'blocknative.connect.connectingWallet.sidebar.subheading',
                    translationOptions
                  ),
                  paragraph: t(
                    'blocknative.connect.connectingWallet.sidebar.paragraph',
                    translationOptions
                  ),
                },
                mainText: t(
                  'blocknative.connect.connectingWallet.mainText',
                  translationOptions
                ),
                paragraph: t(
                  'blocknative.connect.connectingWallet.paragraph',
                  translationOptions
                ),
                previousConnection: t(
                  'blocknative.connect.connectingWallet.previousConnection',
                  translationOptions
                ),
                rejectedText: t(
                  'blocknative.connect.connectingWallet.rejectedText',
                  translationOptions
                ),
                rejectedCTA: t(
                  'blocknative.connect.connectingWallet.rejectedCTA',
                  translationOptions
                ),
                primaryButton: t(
                  'blocknative.connect.connectingWallet.primaryButton',
                  translationOptions
                ),
              },
              connectedWallet: {
                header: t(
                  'blocknative.connect.connectedWallet.header',
                  translationOptions
                ),
                sidebar: {
                  subheading: t(
                    'blocknative.connect.connectedWallet.sidebar.subheading',
                    translationOptions
                  ),
                  paragraph: t(
                    'blocknative.connect.connectedWallet.sidebar.paragraph',
                    translationOptions
                  ),
                },
                mainText: t(
                  'blocknative.connect.connectedWallet.mainText',
                  translationOptions
                ),
              },
            },
            /* any needs because we don't need to localize all texts for now */
          } as any,
        },
        wallets: walletsModules,
        chains,
        appMetadata: {
          name: 'Minterest',
          icon: '<svg></svg>',
          description: 'Connect wallet',
          /* can be enabled in the future */
          agreement: {
            version: '1.0.0',
            termsUrl: `${window.location.origin}/terms-of-use`,
          },
        },
      })
    );
  }, [wallets]);

  if (web3Onboard) {
    return (
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        {children}
      </Web3OnboardProvider>
    );
  }
  return (
    <OverlayLoader text={t('common.loading')} subtext={t('common.wait')} />
  );
};
