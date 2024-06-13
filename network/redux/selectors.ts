import { supportedChainIds } from 'features';
import { RootState } from 'features/store';
import { ApiProvider } from 'types';

export const selectEthApi = (state: RootState): ApiProvider | undefined => {
  return state.network.api;
};

export const selectIsEthApiConnecting = (state: RootState): boolean => {
  return state.network.connecting;
};

export const selectNetwork = (state: RootState): number | undefined => {
  return state.network.chainId;
};

export const selectIsNetworkSupported = (state: RootState): boolean => {
  return Boolean(
    state.network.chainId && supportedChainIds.includes(state.network.chainId)
  );
};
