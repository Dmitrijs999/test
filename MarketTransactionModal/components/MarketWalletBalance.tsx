import React from 'react';

import classes from './MarketWalletBalance.module.scss';
import { WalletBalance } from 'common/PopupBuilder';
import { selectCurrentWallet } from 'features';
import { useAppSelector } from 'features/store';

const MarketWalletBalance = React.memo<{
  symbol: string;
  amount: string;
}>(function MarketBalanceComponent({ amount, symbol }) {
  const currentWallet = useAppSelector(selectCurrentWallet);
  const WalletIcon = currentWallet?.smallLogo;

  return (
    <WalletBalance
      value={amount}
      Icon={WalletIcon}
      symbol={symbol}
      textClassName={classes.walletBalanceText}
      darkSkeleton
    />
  );
});

export default MarketWalletBalance;
