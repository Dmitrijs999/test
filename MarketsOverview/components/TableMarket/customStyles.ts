import { useMediaValue } from '@minterest-finance/ui-kit';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

import { selectUserAddress } from 'features';
import { useAppSelector } from 'features/store';

export const useCustomStyles = (): SxProps<Theme> => {
  const accountAddress = useAppSelector(selectUserAddress);

  const assetNameWidth = useMediaValue<string | undefined>(
    accountAddress ? '25% !important' : '30% !important',
    accountAddress ? '25% !important' : '25% !important',
    accountAddress ? '22% !important' : '25% !important'
  );

  const totalSupplyColumnWidth = useMediaValue<string | undefined>(
    accountAddress ? '20% !important' : '30% !important',
    accountAddress ? '17% !important' : '25% !important',
    accountAddress ? '14% !important' : '25% !important'
  );

  const rateColumnWidth = useMediaValue<string | undefined>(
    accountAddress ? '30% !important' : '40% !important',
    accountAddress ? '20% !important' : '25% !important',
    accountAddress ? '29% !important' : '25% !important'
  );

  const yourSupplyColumnWidth = useMediaValue<string | undefined>(
    '25% !important',
    '20% !important',
    '17% !important'
  );

  const buttonsColumnWidth = useMediaValue<string | undefined>(
    accountAddress ? '25% !important' : 'calc(100% / 3) !important',
    accountAddress ? '18% !important' : '25% !important',
    accountAddress ? '18% !important' : '25% !important'
  );

  const tPadding = useMediaValue('0 16px', '0 24px', '0 32px');

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
      margin: tPadding,
    },
    '& .MuiDataGrid-columnHeader': {
      paddingRight: 0,
      paddingLeft: 0,
    },
    '& .MuiDataGrid-cell': {
      paddingRight: 0,
      paddingLeft: 0,
    },
    '& .assetCell': {
      width: assetNameWidth,
      maxWidth: assetNameWidth,
      minWidth: assetNameWidth,
    },
    '& .assetHeaderCell': {
      width: assetNameWidth,
      maxWidth: assetNameWidth,
      minWidth: assetNameWidth,
    },
    '& .totalSupplyCell': {
      width: totalSupplyColumnWidth,
      maxWidth: totalSupplyColumnWidth,
      minWidth: totalSupplyColumnWidth,
    },
    '& .totalSupplyHeaderCell': {
      width: totalSupplyColumnWidth,
      maxWidth: totalSupplyColumnWidth,
      minWidth: totalSupplyColumnWidth,
    },
    '& .rateColumn': {
      width: rateColumnWidth,
      maxWidth: rateColumnWidth,
      minWidth: rateColumnWidth,
    },
    '& .rateHeaderCell': {
      width: rateColumnWidth,
      maxWidth: rateColumnWidth,
      minWidth: rateColumnWidth,
    },
    '& .yourSupplyCell': {
      width: yourSupplyColumnWidth,
      maxWidth: yourSupplyColumnWidth,
      minWidth: yourSupplyColumnWidth,
    },
    '& .yourSupplyHeaderCell': {
      width: yourSupplyColumnWidth,
      maxWidth: yourSupplyColumnWidth,
      minWidth: yourSupplyColumnWidth,
    },
    '& .buttonColumn': {
      width: buttonsColumnWidth,
      maxWidth: buttonsColumnWidth,
      minWidth: buttonsColumnWidth,
    },
    '& .buttonHeaderCell': {
      width: buttonsColumnWidth,
      maxWidth: buttonsColumnWidth,
      minWidth: buttonsColumnWidth,
    },
  };
};
