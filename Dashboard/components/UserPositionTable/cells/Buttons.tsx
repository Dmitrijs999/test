import React, { useCallback } from 'react';

import {
  TransactionButton,
  useMediaBrakepoint,
  TooltipWrapper,
} from '@minterest-finance/ui-kit';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import { SkeletonRect } from 'common';
import { createMarketTransaction } from 'features';
import { useAppDispatch } from 'features/store';

import { Emission } from '../constants';
import { UserTableRow } from '../UserPositionTable';

export const ButtonsCell: React.FC<{
  isLoading: boolean;
  item: GridRenderCellParams<any, UserTableRow>;
  emission: Emission;
}> = ({ isLoading, item, emission }) => {
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useMediaBrakepoint();
  const dispatch = useAppDispatch();

  const onBorrowClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!item.row.borrowDisabled) {
        dispatch(
          createMarketTransaction({ type: 'borrow', symbol: item.row.symbol })
        );
      }
      e.stopPropagation();
    },
    [item.row]
  );
  const onLendClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!item.row.supplyDisabled) {
        dispatch(
          createMarketTransaction({ type: 'supply', symbol: item.row.symbol })
        );
      }
      e.stopPropagation();
    },
    [item.row]
  );

  const SupplyButton = ({ mr }: { mr?: number }) => (
    <TooltipWrapper
      title={t('tooltips.nftHoldersCanUse')}
      withoutIcon
      disableTouchListener={!item.row.operationDisabledTooltipAvailable}
      disableFocusListener={!item.row.operationDisabledTooltipAvailable}
      disableHoverListener={!item.row.operationDisabledTooltipAvailable}
    >
      <TransactionButton
        disabled={item.row.supplyDisabled}
        style={{ marginRight: mr }}
        vr='primary'
        size='small'
        onClick={onLendClick}
      >
        {t('markets.supply')}
      </TransactionButton>
    </TooltipWrapper>
  );

  const BorrowButton = () => (
    <TooltipWrapper
      title={t('tooltips.nftHoldersCanUse')}
      withoutIcon
      disableTouchListener={!item.row.operationDisabledTooltipAvailable}
      disableFocusListener={!item.row.operationDisabledTooltipAvailable}
      disableHoverListener={!item.row.operationDisabledTooltipAvailable}
    >
      <TransactionButton
        disabled={item.row.borrowDisabled}
        onClick={onBorrowClick}
        vr='secondary'
        size='small'
      >
        {t('markets.borrow')}
      </TransactionButton>
    </TooltipWrapper>
  );

  if (isLoading) {
    return <SkeletonRect width={64} height={21} rectProps={{ rx: 4, ry: 4 }} />;
  }

  if (isDesktop) {
    return (
      <div>
        <SupplyButton mr={16} />
        <BorrowButton />
      </div>
    );
  }
  if (isTablet) {
    if (emission === Emission.apy) return <SupplyButton />;
    if (emission === Emission.apr) return <BorrowButton />;
  }
  return null;
};
