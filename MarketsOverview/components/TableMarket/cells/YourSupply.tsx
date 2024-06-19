import React from 'react';

import { NumericInfo, useMediaValue } from '@minterest-finance/ui-kit';
import { GridRenderCellParams } from '@mui/x-data-grid';

export const YourSupplyCell: React.FC<{
  item: GridRenderCellParams;
  isLoading: boolean;
}> = ({ item, isLoading }) => {
  const containerHeight = useMediaValue('32px', '35px', '41px');

  const { userBalanceDisplay, userBalanceUnderlying } = item.row;
  return (
    <NumericInfo
      value={userBalanceDisplay}
      subValue={userBalanceUnderlying}
      isLoading={isLoading}
      containerStyle={{ height: containerHeight }}
    />
  );
};
