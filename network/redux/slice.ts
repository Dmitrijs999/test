import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApiProvider, NetworkState } from 'types';

import { DEFAULT_NETWORK } from '../constants';

const initialState: NetworkState = {
  api: undefined,
  connecting: false,
  error: undefined,
  chainId: DEFAULT_NETWORK.chainId,
};

const NetWorkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    connectApiStart(state) {
      state.error = undefined;
      state.connecting = true;
    },
    connectApiSuccess(state, action: PayloadAction<ApiProvider>) {
      state.api = action.payload;
      state.connecting = false;
    },
    connectApiFail(state, action: PayloadAction<string>) {
      state.api = undefined;
      state.error = action.payload;
      state.connecting = false;
    },
    setNetwork(state, action: PayloadAction<number>) {
      state.chainId = action.payload;
    },
    resetNetworkState() {
      return initialState;
    },
  },
});

const { actions, reducer } = NetWorkSlice;

export const NetworkReducer = reducer;
export const {
  connectApiStart,
  connectApiSuccess,
  connectApiFail,
  setNetwork,
  resetNetworkState,
} = actions;
