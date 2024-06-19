import React, { useCallback } from 'react';

import { TransactionButton, TooltipWrapper } from '@minterest-finance/ui-kit';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import { createMarketTransaction } from 'features';
import { useAppDispatch } from 'features/store';
import { MarketTableType } from 'types';

export const ButtonCell: React.FC<{
  item: GridRenderCellParams;
  isLoading: boolean;
  isSupplyType: boolean;
  type: MarketTableType;
}> = ({ item, isLoading, isSupplyType }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const buttonProps = {
    children: isSupplyType ? t('markets.supply') : t('markets.borrow'),
    disabled: item.row.buttonDisabled || isLoading,
  };

  const onButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      dispatch(
        createMarketTransaction({
          type: isSupplyType ? 'supply' : 'borrow',
          symbol: item.row.symbol,
        })
      );
    },
    [isSupplyType]
  );
  return (
    <TooltipWrapper
      title={t('tooltips.nftHoldersCanUse')}
      withoutIcon
      disableTouchListener={!item.row.operationDisabledTooltipAvailable}
      disableFocusListener={!item.row.operationDisabledTooltipAvailable}
      disableHoverListener={!item.row.operationDisabledTooltipAvailable}
    >
      <TransactionButton
        size={'small'}
        onClick={onButtonClick}
        {...buttonProps}
        vr={isSupplyType ? 'primary' : 'secondary'}
      />
    </TooltipWrapper>
  );
};
