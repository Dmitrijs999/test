import { ByBitWalletModule } from './unsupportedWallets/byBitWalletModule';
import {
  MetamaskIcon,
  SafePalIcon,
  WalletConnectIcon,
  MetaMaskSmallIcon,
  WalletConnectSmallIcon,
  //UnstoppableDomainsIcon,
  MathWalletIcon,
  BitGetWalletIcon,
  RabbyWalletIcon,
  ByBitWalletIcon,
  OkxIcon,
} from 'assets/svg';
import config from 'config';
import { IWallet, WalletProviders } from 'types';

declare const window: Window & {
  Buffer: typeof Buffer;
  process: typeof process;
  EventEmitter: any;
  okxwallet?: any;
};

const WalletsList = [
  {
    name: 'Metamask',
    provider: WalletProviders.Metamask,
    logo: MetamaskIcon,
    smallLogo: MetaMaskSmallIcon,
    id: 'metamask',
    module: () =>
      import('@web3-onboard/metamask').then((m) =>
        m.default({
          options: {
            checkInstallationImmediately: true,
            extensionOnly: true,
            dappMetadata: {
              url: 'https://mantle.minterest.com/',
            },
          },
        })
      ),
  },
  {
    name: 'MathWallet',
    provider: WalletProviders.MathWallet,
    logo: MathWalletIcon,
    smallLogo: MathWalletIcon,
    id: 'mathWallet',
    module: () =>
      import('@web3-onboard/injected-wallets').then((m) => m.default()),
  },
  {
    name: 'BitGet',
    provider: WalletProviders.BitGet,
    logo: BitGetWalletIcon,
    smallLogo: BitGetWalletIcon,
    id: 'bitGet',
    module: () =>
      import('@web3-onboard/injected-wallets').then((m) => m.default()),
  },
  {
    name: 'SafePal',
    provider: WalletProviders.SafePal,
    logo: SafePalIcon,
    smallLogo: SafePalIcon,
    id: 'SafePal',
    module: () =>
      import('@web3-onboard/injected-wallets').then((m) => m.default()),
  },
  {
    name: 'Rabby Wallet',
    provider: WalletProviders.RabbyWallet,
    logo: RabbyWalletIcon,
    smallLogo: RabbyWalletIcon,
    id: 'rabbyWallet',
    module: () =>
      import('@web3-onboard/injected-wallets').then((m) => m.default({})),
  },
  {
    name: 'ByBit Wallet',
    provider: WalletProviders.ByBitWallet,
    logo: ByBitWalletIcon,
    smallLogo: ByBitWalletIcon,
    id: 'bybitWallet',
    module: ByBitWalletModule,
  },
  {
    name: 'WalletConnect',
    provider: WalletProviders.WalletConnect,
    logo: WalletConnectIcon,
    smallLogo: WalletConnectSmallIcon,
    id: 'walletconnect',
    module: () =>
      import('@web3-onboard/walletconnect').then((m) =>
        m.default({
          projectId: '252d4183353a7dc8826100adb015f6c7',
          requiredChains: [config.WALLET_CONNECT_CHAIN_ID],
          optionalChains: [config.WALLET_CONNECT_CHAIN_ID],
          handleUri: (uri) => new Promise(() => console.log(uri)),
          version: 2,
          dappUrl: 'https://mantle.minterest.com/',
          qrModalOptions: {
            themeVariables: {
              '--wcm-z-index': '999999',
            },
          },
        })
      ),
  },
  {
    name: 'OKX',
    provider: WalletProviders.Okx,
    logo: OkxIcon,
    smallLogo: OkxIcon,
    id: 'okxwallet',
    module: () =>
      import('@web3-onboard/injected-wallets').then((m) => {
        const okxWalletGO = window.okxwallet;

        if (typeof okxWalletGO === 'undefined') {
          return m.default();
        } else {
          // This hack is needed to avoid displaying both MetaMask && oKX icon on connect modal
          okxWalletGO.isMetaMask = false;
        }
        return m.default();
      }),
  },
  /**
  {
    name: 'Unstoppable Domains',
    provider: WalletProviders.UnstoppableDomains,
    logo: UnstoppableDomainsIcon,
    smallLogo: UnstoppableDomainsIcon,
    id: 'unstoppabledomains',
    module: () =>
      import('@web3-onboard/uauth').then((m) =>
        m.default({
          clientID: config.UD_CLIENT_ID,
          redirectUri: config.UD_REDIRECT_URL,
          scope: config.UD_SCOPE,
          shouldLoginWithRedirect: false,
          requiredChains: [1, 5, 62],
          handleUri: (uri) => new Promise(() => console.log(uri)),
          walletConnectProjectId: '252d4183353a7dc8826100adb015f6c7',
        })
      ),
  },
  */
];

export const getWallets = async (): Promise<IWallet[]> => {
  const [process, EventEmitter, { Buffer }] = await Promise.all([
    import('process'),
    import('events'),
    import('buffer'),
  ]);

  window.Buffer = Buffer;
  window.process = process.default;
  window.EventEmitter = EventEmitter.default;

  const wallets = WalletsList.filter(
    ({ provider }) => !config.FEATURE.HIDE_WALLETS.includes(provider)
  );

  return await Promise.all(
    wallets.map(async (wallet) => ({
      ...wallet,
      module: await wallet.module(),
    }))
  );
};
