import React from 'react';

import { AssetName } from '@minterest-finance/ui-kit';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import { selectCurrentWallet } from 'features';
import { useAppSelector } from 'features/store';

export const AssetNameCell: React.FC<{
  item: GridRenderCellParams;
  isLoading: boolean;
  hideUnderlying: boolean;
}> = ({ item, isLoading, hideUnderlying }) => {
  const { t } = useTranslation();
  const currentWallet = useAppSelector(selectCurrentWallet);
  return (
    <AssetName
      Icon={item.row.assetIcon}
      SubIcon={currentWallet?.smallLogo}
      balance={item.row.underlyingBalance}
      tooltipText={`${t('markets.currentBalance.left')} ${
        item.row.assetName
      } ${t('markets.currentBalance.right')}`}
      title={item.row.assetName}
      isLoading={isLoading}
      hideUnderlying={hideUnderlying}
    />
  );
};
