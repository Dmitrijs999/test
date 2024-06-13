import { RootState } from 'features/store';
import { IWallet } from 'types';

export const selectWallets = (state: RootState) => {
  return state.wallet.wallets;
};

export const selectUserAddress = (state: RootState): string | undefined => {
  return state.wallet.account;
};

export const selectCurrentWallet = (state: RootState): IWallet | undefined => {
  return selectWallets(state).find(
    ({ provider }) => provider === state.wallet.wallet
  );
};

export const selectIsWalletConnected = (state: RootState): boolean => {
  return !!(state.wallet.wallet && state.wallet.account);
};
