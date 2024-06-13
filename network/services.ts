import {
  ExternalProvider,
  JsonRpcFetchFunc,
} from '@ethersproject/providers/src.ts/web3-provider';

import config from 'config';
import { DEFAULT_NETWORK } from 'features/network';
import { Networks } from 'types';

export type ExpectedProvider = JsonRpcFetchFunc | ExternalProvider;

export const switchNetwork = async (): Promise<void> => {
  const { ethereum } = window as any;
  try {
    // for default metamask chains
    // TODO fix ganache connection
    const allNetworks = Object.values(Networks);
    if (allNetworks.includes(config.NETWORK)) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: DEFAULT_NETWORK.switchNetworkParams,
      });
      // for custom chains
    } else {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: DEFAULT_NETWORK.addNetworkParams,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export const composeExplorerLink = (
  hash: string,
  islayerZeroExplorer = false
): string => {
  if (islayerZeroExplorer) return `${DEFAULT_NETWORK.bridgeExplorerUrl}${hash}`;
  return `${DEFAULT_NETWORK.blockExplorerUrl}tx/${hash}`;
};
