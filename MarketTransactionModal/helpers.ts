import { BigNumber, utils } from 'ethers';

import {
  MarketData,
  MarketTransactionType,
  TokenInfo,
  UserMarketData,
} from 'types';
import { expScale } from 'utils/constants';

export const convertToUsd = (
  tokens: BigNumber,
  price: string,
  decimals: number
): BigNumber => {
  return tokens.mul(utils.parseUnits(price, 36 - decimals)).div(expScale);
};

export const convertToTokens = (
  usd: BigNumber,
  price: string,
  decimals: number
): BigNumber => {
  return usd.mul(expScale).div(utils.parseUnits(price, 36 - decimals));
};

export const getTransactionMethod = ({
  type,
  isMaxed,
  tokenInfo,
}: {
  type: MarketTransactionType;
  isMaxed: boolean;
  tokenInfo: TokenInfo;
}): string => {
  if (tokenInfo.isNative) {
    switch (type) {
      case 'supply':
        return 'lendNative';
      case 'borrow':
        return 'borrowNative';
      case 'repay':
        return 'repayBorrowNative';
      case 'redeem':
        return isMaxed ? 'redeemNative' : 'redeemUnderlyingNative';
      default:
        // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unused-vars
        const _: never = type;
        throw new Error('type not found');
    }
  } else if (tokenInfo.symbol === 'mUSD') {
    switch (type) {
      case 'supply':
        return 'lendRUSDY';
      case 'borrow':
        return 'borrowRUSDY';
      case 'repay':
        return 'repayBorrowRUSDY';
      case 'redeem':
        return isMaxed ? 'redeemRUSDY' : 'redeemUnderlyingRUSDY';
      default:
        // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unused-vars
        const _: never = type;
        throw new Error('type not found');
    }
  } else {
    switch (type) {
      case 'supply':
        return 'lend';
      case 'borrow':
        return 'borrow';
      case 'repay':
        return 'repayBorrow';
      case 'redeem':
        return isMaxed ? 'redeem' : 'redeemUnderlying';
      default:
        // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unused-vars
        const _: never = type;
        throw new Error('type not found');
    }
  }
};

export const isBorrowingMethod = (type: MarketTransactionType): boolean =>
  type === 'borrow' || type === 'repay';

export const getInterestRate = (
  type: MarketTransactionType,
  md?: MarketData
): BigNumber => {
  if (!md) {
    return BigNumber.from(0);
  } else {
    return isBorrowingMethod(type)
      ? utils.parseUnits(md.economic.apr)
      : utils.parseUnits(md.economic.apy);
  }
};

export const getMarketMntRewardsAPY = (
  type: MarketTransactionType,
  umd: UserMarketData
): BigNumber => {
  if (!umd) {
    return BigNumber.from(0);
  } else {
    return isBorrowingMethod(type)
      ? utils.parseUnits(umd.mntBorrowAPY)
      : utils.parseUnits(umd.mntSupplyAPY);
  }
};
