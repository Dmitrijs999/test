import { useMediaValue } from '@minterest-finance/ui-kit';
import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { GridSortDirection } from '@mui/x-data-grid';

const sortingOrder: GridSortDirection[] = ['desc', 'asc'];

export const commonCellParams = {
  hideSortIcons: true,
  filterable: false,
  disableColumnMenu: true,
  sortingOrder,
};

export const DUMMY_LIST = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

export const useCustomStyles = (): SxProps<Theme> => {
  const tPadding = useMediaValue('0 16px', '0 24px', '0 32px');

  const assetColumnWidth = useMediaValue<string | undefined>(
    '20% !important',
    '25% !important',
    '15% !important'
  );

  const userColumnWidth = useMediaValue<string | undefined>(
    '20% !important',
    '20% !important',
    '11% !important'
  );

  const apyColumnWidth = useMediaValue<string | undefined>(
    '30% !important',
    '20% !important',
    '16% !important'
  );

  const collateralColumnWidth = useMediaValue<string | undefined>(
    '25% !important',
    '15% !important',
    '11% !important'
  );

  const buttonColumnWidth = useMediaValue<string | undefined>(
    '25% !important',
    '15% !important',
    '20% !important'
  );

  return {
    border: 'none',
    '.MuiDataGrid-row': {
      padding: tPadding,
    },
    '.MuiDataGrid-row:hover': {
      cursor: 'pointer',
      '.asset-tooltip-container': {
        'max-height': '16px',
        opacity: 1,
      },
    },
    '& .MuiDataGrid-virtualScrollerContent': {
      width: '100% !important',
      '>div': {
        width: '100%',
      },
      '& .MuiDataGrid-row': {
        width: '100%',
      },
    },
    '& .MuiDataGrid-columnHeadersInner': {
      width: '100%',
      '>div': {
        width: '100%',
      },
    },
    '& .MuiDataGrid-columnHeaders': {
      borderBottom: '1px solid rgba(12, 45, 156, 0.08)',
      margin: tPadding,
    },
    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid rgba(12, 45, 156, 0.08)',
      padding: 0,
    },
    '& .MuiDataGrid-columnHeader': {
      padding: 0,
    },

    '& .assetHeaderCell': {
      width: assetColumnWidth,
      maxWidth: assetColumnWidth,
      minWidth: assetColumnWidth,
    },
    '& .assetColumn': {
      width: assetColumnWidth,
      maxWidth: assetColumnWidth,
      minWidth: assetColumnWidth,
    },

    '& .userHeaderCell': {
      width: userColumnWidth,
      maxWidth: userColumnWidth,
      minWidth: userColumnWidth,
    },
    '& .userColumn': {
      width: userColumnWidth,
      maxWidth: userColumnWidth,
      minWidth: userColumnWidth,
    },

    '& .apyHeaderCell': {
      width: apyColumnWidth,
      maxWidth: apyColumnWidth,
      minWidth: apyColumnWidth,
    },
    '& .apyColumn': {
      width: apyColumnWidth,
      maxWidth: apyColumnWidth,
      minWidth: apyColumnWidth,
    },

    '& .collateralHeaderCell': {
      width: collateralColumnWidth,
      maxWidth: collateralColumnWidth,
      minWidth: collateralColumnWidth,
    },
    '& .collateralColumn': {
      width: collateralColumnWidth,
      maxWidth: collateralColumnWidth,
      minWidth: collateralColumnWidth,
    },
    '& .buttonHeaderCell': {
      width: buttonColumnWidth,
      maxWidth: buttonColumnWidth,
      minWidth: buttonColumnWidth,
    },
    '& .buttonColumn': {
      width: buttonColumnWidth,
      maxWidth: buttonColumnWidth,
      minWidth: buttonColumnWidth,
    },
  };
};

export enum Emission {
  apy = 'apy',
  apr = 'apr',
}

export enum Balance {
  supply = 'supply',
  borrow = 'borrow',
}

export const initialState = {
  sorting: {
    sortModel: [{ field: 'userSupplyValue', sort: 'desc' }],
  },
};
