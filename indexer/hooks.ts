import { useCallback } from 'react';

import { MantleSmallIcon, MinterestSmallBlackIcon } from '@src/assets/svg';
import {
  MntDetails,
  MarketTransactionType,
  MarketMeta,
  SVGIcon,
  MantleDetails,
  ExtMarketMeta,
} from '@src/types';
import {
  MANTLE_DECIMALS,
  MNT_DECIMALS,
  NATIVE_TOKEN_MARKET_SYMBOL,
  NATIVE_TOKEN_SYMBOL,
} from '@src/utils';

import {
  useGetUserDashboardAvailableQuery,
  getMarketIcon,
  getMarketName,
  useGetPausedOperationsQuery,
  getTokenIcon,
  getTokenSymbol,
  useAddressesQuery,
  selectUserAddress,
} from 'features';

import { useAppSelector } from '../store';

export const useIsDashboardAvailable = (): {
  loading: boolean;
  isAvailable: boolean;
} => {
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: isDashboardAvailableOnChain, isLoading: onChainLoading } =
    useGetUserDashboardAvailableQuery(accountAddress as string, {
      skip: !accountAddress,
    });

  return {
    loading: onChainLoading,
    isAvailable: accountAddress && isDashboardAvailableOnChain,
  };
};

export const useNativeTokenInfo = (): {
  symbol: string;
  name: string;
  icon: SVGIcon;
} => {
  return {
    name: getTokenSymbol(NATIVE_TOKEN_SYMBOL),
    icon: getMarketIcon(NATIVE_TOKEN_MARKET_SYMBOL),
    symbol: NATIVE_TOKEN_MARKET_SYMBOL,
  };
};

export const useMntDetails = (): MntDetails => {
  const { data } = useAddressesQuery();
  return {
    name: getTokenSymbol('minty'),
    icon: MinterestSmallBlackIcon,
    decimals: MNT_DECIMALS,
    address: data?.Mnt,
  };
};

export const useMantleDetails = (): MantleDetails => {
  return {
    name: getTokenSymbol('wmnt'),
    icon: MantleSmallIcon,
    decimals: MANTLE_DECIMALS,
    address: '0x04BEb76D62369761C56c9cffBFD0606191E08d52',
  };
};

export const usePausedOperationDetector = () => {
  const { data: addresses, isFetching: isAddressesFetching } =
    useAddressesQuery();
  const { data: pausedOperations, isFetching: isPausedOpsFetching } =
    useGetPausedOperationsQuery();
  const checkPaused = useCallback(
    (contractAddress: string, operation: string, subject?: string) => {
      if (!pausedOperations) return true;
      return pausedOperations.some((po) => {
        let isExist =
          po.contractAddress.toLowerCase() === contractAddress.toLowerCase() &&
          po.operation.toLowerCase() === operation.toLowerCase();
        if (subject) {
          isExist =
            isExist && po.subject.toLowerCase() === subject.toLowerCase();
        }
        return isExist;
      });
    },
    [addresses, pausedOperations]
  );
  const isMarketOperationPaused = useCallback(
    (meta: MarketMeta, operation: MarketTransactionType): boolean => {
      if (!addresses) return true;
      const ops = {
        supply: 'lend',
        borrow: 'borrow',
        repay: 'repayborrow',
        redeem: 'redeem',
      };
      return checkPaused(
        addresses.Supervisor_Proxy,
        ops[operation],
        meta.address
      );
    },
    [checkPaused]
  );
  const isBuybackOperationPaused = useCallback(
    (operation: 'stake' | 'unstake' | 'leave' | 'participate'): boolean => {
      if (!addresses) return true;
      return checkPaused(addresses.Buyback_Proxy, operation);
    },
    [checkPaused]
  );
  const isRewardsHubOperationPaused = useCallback(
    (operation: 'withdraw' | 'distributeAllMnt'): boolean => {
      if (!addresses) return true;
      return checkPaused(addresses.RewardsHub_Proxy, operation);
    },
    [checkPaused]
  );
  const isVestingOperationPaused = useCallback(
    (operation: 'withdraw'): boolean => {
      if (!addresses) return true;
      return checkPaused(addresses.Vesting, operation);
    },
    [checkPaused]
  );
  return {
    isLoading: isAddressesFetching || isPausedOpsFetching,
    isMarketOperationPaused,
    isBuybackOperationPaused,
    isRewardsHubOperationPaused,
    isVestingOperationPaused,
    checkPaused,
  };
};

export const useExtendedMarketMeta = (
  meta?: MarketMeta
): ExtMarketMeta | undefined => {
  if (!meta) {
    return undefined;
  }
  const extMeta: ExtMarketMeta = {
    ...meta,
    name: getMarketName(meta.symbol), // Also a token name
    icon: getMarketIcon(meta.symbol),
  };
  extMeta.underlyingTokenInfo = {
    ...meta.underlyingTokenInfo,
    icon: getTokenIcon(meta.underlyingTokenInfo.symbol),
  };
  if (meta.alternativeUnderlyingTokenInfo)
    extMeta.alternativeUnderlyingTokenInfo = {
      ...meta.alternativeUnderlyingTokenInfo,
      icon: getTokenIcon(meta.alternativeUnderlyingTokenInfo.symbol),
    };
  return extMeta;
};
