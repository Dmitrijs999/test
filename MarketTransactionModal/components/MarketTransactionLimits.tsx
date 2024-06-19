import React from 'react';

import { unit } from '@minterest-finance/ui-kit';
import { BigNumber, utils } from 'ethers';
import { useTranslation } from 'react-i18next';

import classes from './MarketTransactionLimit.module.scss';
import MarketWalletBalance from './MarketWalletBalance';
import { TitledBalance } from 'common/PopupBuilder';
import {
  getMarketOraclePrice,
  useGetOraclePricesQuery,
  useGetUserBorrowBalanceQuery,
  useGetUserTokenBalanceQuery,
} from 'features';
import { ExtMarketMeta, MarketTransactionType, TokenInfo } from 'types';
import { expScale } from 'utils/constants';

export const MarketTransactionLimits = React.memo<{
  type: MarketTransactionType;
  max: BigNumber;
  maxLoading?: boolean;
  marketMeta: ExtMarketMeta;
  accountAddress: string;
  selectedToken: TokenInfo;
  nativeBalance: string;
}>(function MarketTransactionLimitsComponent({
  type,
  max,
  maxLoading,
  marketMeta,
  accountAddress,
  selectedToken,
}) {
  const { t } = useTranslation();
  const { data: userBalance } = useGetUserTokenBalanceQuery({
    accountAddress,
    tokenSymbol: selectedToken.symbol,
  });
  const { data: userBorrowBalance } = useGetUserBorrowBalanceQuery({
    accountAddress,
    marketSymbol: marketMeta.symbol,
  });

  const { data: prices } = useGetOraclePricesQuery();

  const getAmount = (balance: BigNumber) => {
    if (!balance) return;
    return utils.formatUnits(balance, selectedToken.decimals);
  };

  const getTitle = (type: MarketTransactionType) => {
    switch (type) {
      case 'borrow':
        return t('common.modal.borrowable');
      case 'redeem':
        return t('common.modal.withdrawable');
      case 'repay':
        return t('common.modal.yourBorrow');
      default:
        return '';
    }
  };

  const getTitleBalanceValue = (type: MarketTransactionType) => {
    if (type === 'borrow' || type === 'redeem') {
      return unit(getAmount(max), { compact: true });
    } else if (type === 'repay') {
      if (!userBorrowBalance) return;
      if (selectedToken.symbol === 'mUSD') {
        const price = getMarketOraclePrice(prices, marketMeta.symbol);
        const usdyPrice = utils.parseUnits(
          price,
          36 - marketMeta.underlyingTokenInfo.decimals
        );
        const mUSDBorrowBalance = userBorrowBalance
          .mul(usdyPrice)
          .div(expScale);
        return unit(getAmount(mUSDBorrowBalance), {
          compact: true,
        });
      } else {
        return unit(getAmount(userBorrowBalance), { compact: true });
      }
    } else {
      return '';
    }
  };

  /*
                T    M
        supply  0    1
        borrow  1    0
        redeem  1    0
        repay   1    1
     */
  return (
    <>
      {(type === 'supply' || type === 'repay') && (
        <MarketWalletBalance
          symbol={selectedToken.symbol}
          amount={unit(getAmount(userBalance), { compact: true })}
        />
      )}
      {type !== 'supply' && (
        <TitledBalance
          title={getTitle(type)}
          value={getTitleBalanceValue(type)}
          loading={maxLoading}
          symbol={selectedToken.symbol}
          titleClassName={classes.balanceTitle}
          valueClassName={classes.balanceValue}
          darkSkeleton
        />
      )}
    </>
  );
});
