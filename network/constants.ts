import config from 'config';
import { NetworkConfig, Networks, ChainIds } from 'types';

export const NetworkConfigs: Record<Networks, NetworkConfig> = {
  [Networks.Hardhat]: {
    chainId: ChainIds[Networks.Hardhat],
    httpRpc: config.HARDHAT_HTTP,
    wssRpc: config.HARDHAT_WSS,
    publicName: 'Hardhat',
    blockExplorerUrl: 'https://moonbase.moonscan.io/',
    addNetworkParams: [
      {
        chainId: '0x7A69',
        chainName: 'hardhat-localnet',
        nativeCurrency: {
          name: 'DEV Coin',
          symbol: 'DEV',
          decimals: 18,
        },
        rpcUrls: [config.HARDHAT_HTTP],
        blockExplorerUrls: ['https://moonbase.moonscan.io/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0x7A69' }],
  },
  [Networks.Ganache]: {
    chainId: ChainIds[Networks.Ganache],
    httpRpc: config.GANACHE_HTTP,
    wssRpc: config.GANACHE_WSS,
    publicName: 'Ganache',
    blockExplorerUrl: 'https://moonbase.moonscan.io/',
    addNetworkParams: [
      {
        chainId: '0x539',
        chainName: 'Ganache',
        nativeCurrency: {
          name: 'DEV Coin',
          symbol: 'DEV',
          decimals: 18,
        },
        rpcUrls: [config.GANACHE_HTTP],
        blockExplorerUrls: ['https://moonbeam.moonscan.io/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0x539' }],
  },
  [Networks.Rinkeby]: {
    chainId: ChainIds[Networks.Rinkeby],
    httpRpc: config.RINKEBY_HTTP,
    wssRpc: config.RINKEBY_WSS,
    publicName: 'Rinkeby',
    blockExplorerUrl: 'https://rinkeby.etherscan.io/',
    addNetworkParams: [
      {
        chainId: '0x4',
        chainName: 'Rinkeby',
        nativeCurrency: {
          name: 'Ethereum Infura Coin',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: [config.RINKEBY_HTTP],
        blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0x4' }],
  },
  [Networks.Sepolia]: {
    chainId: ChainIds[Networks.Sepolia],
    httpRpc: config.SEPOLIA_HTTP,
    wssRpc: config.SEPOLIA_WSS,
    publicName: 'Sepolia',
    blockExplorerUrl: 'https://sepolia.etherscan.io/',
    bridgeExplorerUrl: 'https://testnet.layerzeroscan.com/tx/',
    addNetworkParams: [
      {
        chainId: '0xAA36A7',
        chainName: 'Sepolia',
        nativeCurrency: {
          name: 'Ethereum Coin',
          symbol: 'SepoliaETH',
          decimals: 18,
        },
        rpcUrls: [config.SEPOLIA_HTTP],
        blockExplorerUrls: ['https://sepolia.etherscan.io/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0xAA36A7' }],
  },
  [Networks.ForkedMainnet]: {
    chainId: ChainIds[Networks.ForkedMainnet],
    httpRpc: config.FORKED_MAINNET_HTTP,
    wssRpc: config.FORKED_MAINNET_WSS,
    publicName: 'Forked Mainnet',
    blockExplorerUrl: 'https://moonbase.moonscan.io/',
    addNetworkParams: [
      {
        chainId: '0x53A',
        chainName: 'ForkedMainnet',
        nativeCurrency: {
          name: 'Ethereum Coin',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: [config.FORKED_MAINNET_HTTP],
        blockExplorerUrls: ['https://moonbeam.moonscan.io/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0x53A' }],
  },
  [Networks.Mainnet]: {
    chainId: ChainIds[Networks.Mainnet],
    httpRpc: config.MAINNET_HTTP,
    wssRpc: config.MAINNET_WSS,
    publicName: 'Mainnet',
    blockExplorerUrl: 'https://etherscan.io/',
    bridgeExplorerUrl: 'https://layerzeroscan.com/tx/',
    addNetworkParams: [
      {
        chainId: '0x1',
        chainName: 'Mainnet',
        nativeCurrency: {
          name: 'Ethereum Coin',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: [config.MAINNET_HTTP],
        blockExplorerUrls: ['https://etherscan.io/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0x1' }],
  },
  [Networks.MantleTestnet]: {
    chainId: ChainIds[Networks.MantleTestnet],
    httpRpc: config.MANTLE_TESTNET_HTTP,
    wssRpc: config.MANTLE_TESTNET_WSS,
    publicName: 'Mantle Testnet',
    blockExplorerUrl: 'https://explorer.sepolia.mantle.xyz/',
    bridgeExplorerUrl: 'https://testnet.layerzeroscan.com/tx/',
    addNetworkParams: [
      {
        chainId: '0x138B',
        chainName: 'MantleTestnet',
        nativeCurrency: {
          name: 'Mantle',
          symbol: 'MNT',
          decimals: 18,
        },
        rpcUrls: [config.MANTLE_TESTNET_HTTP],
        blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0x138B' }],
  },
  [Networks.MantleMainnet]: {
    chainId: ChainIds[Networks.MantleMainnet],
    httpRpc: config.MANTLE_MAINNET_HTTP,
    wssRpc: config.MANTLE_MAINNET_WSS,
    publicName: 'Mantle',
    blockExplorerUrl: 'https://explorer.mantle.xyz/',
    bridgeExplorerUrl: 'https://layerzeroscan.com/tx/',
    addNetworkParams: [
      {
        chainId: '0x1388',
        chainName: 'Mantle',
        nativeCurrency: {
          name: 'Mantle',
          symbol: 'MNT',
          decimals: 18,
        },
        rpcUrls: [config.MANTLE_MAINNET_HTTP],
        blockExplorerUrls: ['https://explorer.mantle.xyz/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0x1388' }],
  },
  [Networks.MantleSepolia]: {
    chainId: ChainIds[Networks.MantleTestnet],
    httpRpc: config.MANTLE_TESTNET_HTTP,
    wssRpc: config.MANTLE_TESTNET_WSS,
    publicName: 'Mantle Testnet',
    blockExplorerUrl: 'https://explorer.sepolia.mantle.xyz/',
    bridgeExplorerUrl: 'https://testnet.layerzeroscan.com/tx/',
    addNetworkParams: [
      {
        chainId: '0x138B',
        chainName: 'MantleTestnet',
        nativeCurrency: {
          name: 'Mantle',
          symbol: 'MNT',
          decimals: 18,
        },
        rpcUrls: [config.MANTLE_TESTNET_HTTP],
        blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz/'],
      },
    ],
    switchNetworkParams: [{ chainId: '0x138B' }],
  },
};

export const DEFAULT_NETWORK: NetworkConfig = NetworkConfigs[config.NETWORK];

export const supportedChainIds = [DEFAULT_NETWORK.chainId];
