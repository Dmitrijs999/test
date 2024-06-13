import { WalletInit } from '@web3-onboard/common';

export function ByBitWalletModule(): WalletInit {
  // @ts-ignore
  if (typeof window?.bybitWallet === 'undefined') {
    return () => null;
  } else {
    window.ethereum = null;
  }

  return () => {
    return {
      label: 'ByBit Wallet',
      type: 'evm',
      getIcon: async () => {
        const response = await fetch('src/assets/svg/ByBitDarkLogo.svg');
        return response.text();
      },
      getInterface: async () => {
        // @ts-ignore
        const provider = window?.bybitWallet.currentProvider;
        return { provider };
      },
    };
  };
}
