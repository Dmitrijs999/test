import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IWallet, WalletProviders, WalletState } from 'types';

const initialState: WalletState = {
  wallets: [],
};

const WalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWeb3Modules(state, action: PayloadAction<IWallet[]>) {
      state.wallets = action.payload;
    },
    setUserAddress(state, action: PayloadAction<string>) {
      state.account = action.payload;
    },
    setUserWallet(state, action: PayloadAction<WalletProviders>) {
      state.wallet = action.payload;
    },
    disconnectWallet(state) {
      state.wallet = initialState.wallet;
    },
    resetWalletState() {
      return { ...initialState, reconnecting: false };
    },
  },
});

const { actions, reducer } = WalletSlice;

export const WalletReducer = reducer;
export const {
  setUserWallet,
  disconnectWallet,
  resetWalletState,
  setUserAddress,
  setWeb3Modules,
} = actions;
