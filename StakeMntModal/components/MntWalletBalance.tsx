import React from 'react';

import { unit } from '@minterest-finance/ui-kit';
import { utils } from 'ethers';

import { WalletBalance } from 'common/PopupBuilder';
import { selectCurrentWallet, useMntDetails } from 'features';
import { useAppSelector } from 'features/store';
import { IMntStake } from 'types';

const MntWalletBalance = React.memo<{
  stakeData?: IMntStake;
  loading: boolean;
}>(function MntWalletBalanceComponent({ stakeData, loading }) {
  const currentWallet = useAppSelector(selectCurrentWallet);
  const mntDetails = useMntDetails();

  const WalletIcon = currentWallet?.smallLogo;
  if (!stakeData) return null;
  return (
    <WalletBalance
      value={unit(utils.formatUnits(stakeData?.userMntUnderlyingBalance), {
        compact: true,
      })}
      Icon={WalletIcon}
      symbol={mntDetails.name}
      loading={loading}
    />
  );
});

export default MntWalletBalance;
