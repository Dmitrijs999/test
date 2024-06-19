import React, { useEffect } from 'react';

import {
  connectApiSuccess,
  connectApiStart,
  connectApiFail,
  setNetwork,
  TransactionService,
  useGetOraclePricesQuery,
  getMarketOraclePrice,
} from 'features';
import { useAppDispatch } from 'features/store';
import { useWalletProvider } from 'features/wallet';
import { NATIVE_TOKEN_MARKET_SYMBOL } from 'utils/constants';

const ApiHandler = (): React.ReactElement | null => {
  const dispatch = useAppDispatch();
  const provider = useWalletProvider();
  const { data: prices } = useGetOraclePricesQuery();
  const nativeTokenPrice = getMarketOraclePrice(
    prices,
    NATIVE_TOKEN_MARKET_SYMBOL
  );

  useEffect(() => {
    const handler = async () => {
      try {
        dispatch(connectApiStart());
        const network = await provider.getNetwork();
        dispatch(setNetwork(network.chainId));
        dispatch(connectApiSuccess(provider));
        TransactionService.setProvider(provider);
      } catch (e) {
        dispatch(connectApiFail((e as Error).message));
      }
    };
    if (provider) handler();
  }, [provider]);

  useEffect(() => {
    if (nativeTokenPrice) {
      TransactionService.setEthPrice(nativeTokenPrice);
    }
  }, [nativeTokenPrice]);

  return null;
};

export default ApiHandler;
