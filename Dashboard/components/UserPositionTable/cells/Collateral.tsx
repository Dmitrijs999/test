import React, { useMemo } from 'react';

import { ToggleButton } from '@minterest-finance/ui-kit';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import { SkeletonRect } from 'common';
import config from 'config';
import {
  useGetUserDataQuery,
  selectUserAddress,
  createCollateralTransaction,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';

import { UserTableRow } from '../UserPositionTable';

// TODO: add logic here when new contracts is released
export const CollateralCell: React.FC<{
  isLoading: boolean;
  item: GridRenderCellParams<any, UserTableRow>;
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ isLoading, item }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const accountAddress = useAppSelector(selectUserAddress);

  const { data, isFetching } = useGetUserDataQuery(
    {
      accountAddress,
    },
    { skip: !accountAddress }
  );
  const collateralEnabled = useMemo(() => {
    if (!data) return;
    return data?.userMarkets?.find((m) => m.symbol === item.row.symbol)
      ?.collateralStatus;
  }, [data]);

  const handleCollateralToggle = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    dispatch(
      createCollateralTransaction({
        type: collateralEnabled ? 'turnOff' : 'turnOn',
        symbol: item.row.symbol,
        alert: collateralEnabled
          ? {
              variant: 'warn',
              text: t('collateralModal.disableCollateralWarning'),
            }
          : null,
      })
    );
    e.stopPropagation();
  };

  if (isFetching || isLoading) {
    return <SkeletonRect width={64} height={21} rectProps={{ rx: 4, ry: 4 }} />;
  }
  return (
    <ToggleButton
      disabled={!config.FEATURE.MARKET_AS_COLLATERAL}
      variant='default'
      checked={collateralEnabled}
      onClick={handleCollateralToggle}
    />
  );
};
