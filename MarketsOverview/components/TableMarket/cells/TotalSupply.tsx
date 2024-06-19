import React from 'react';

import { NumericInfo, useMediaValue } from '@minterest-finance/ui-kit';
import { GridRenderCellParams } from '@mui/x-data-grid';

export const TotalSupplyCell: React.FC<{
  item: GridRenderCellParams;
  isLoading: boolean;
}> = ({ item, isLoading }) => {
  const containerHeight = useMediaValue('32px', '35px', '41px');

  const { balanceDisplay, marketUnderlyingDisplay } = item.row;
  return (
    <NumericInfo
      value={balanceDisplay}
      subValue={marketUnderlyingDisplay}
      isLoading={isLoading}
      containerStyle={{ height: containerHeight }}
    />
  );
};
