export * from './wallet.types';
export * from './components.types';
export * from './network.types';
export * from './assets.types';
export * from './charts.types';
export * from './user.types';
export * from './market.types';
export * from './mnt.types';
export * from './mantle.types';
export * from './error.types';
export * from './utility.types';
export * from './graph.types';
export * from './offchain.types';
export * from './transactions.types';
export * from './config.types';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'line-graph': any;
      'bar-graph': any;
    }
  }
}
