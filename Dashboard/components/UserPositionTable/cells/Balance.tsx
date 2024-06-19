import React from 'react';

import { NumericInfo } from '@minterest-finance/ui-kit';
import { GridRenderCellParams } from '@mui/x-data-grid';

import { Balance } from '../constants';
import { UserTableRow } from '../UserPositionTable';

export const BalanceCell: React.FC<{
  balance: Balance;
  item: GridRenderCellParams<any, UserTableRow>;
  isLoading: boolean;
}> = ({ balance, item, isLoading }) => {
  const isSupply = balance === Balance.supply;
  const {
    userSupplyDisplay,
    userSupplyUnderlying,
    userBorrowDisplay,
    userBorrowUnderlying,
  } = item.row;
  return (
    <NumericInfo
      value={isSupply ? userSupplyDisplay : userBorrowDisplay}
      subValue={isSupply ? userSupplyUnderlying : userBorrowUnderlying}
      isLoading={isLoading}
    />
  );
};
