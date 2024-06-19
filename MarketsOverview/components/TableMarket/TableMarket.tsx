import React, { useCallback, useMemo } from 'react';

import {
  Card,
  HeaderCategory,
  EnchancedTable,
  useMediaValue,
  useMediaBrakepoint,
  Row,
  Typography,
  TooltipWrapper,
} from '@minterest-finance/ui-kit';
import {
  GridColDef,
  GridSortDirection,
  GridCellParams,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { AssetNameCell } from './cells/AssetName';
import { ButtonCell } from './cells/Button';
import { Delta } from './cells/Delta';
import { Rate } from './cells/Rate';
import { TotalSupplyCell } from './cells/TotalSupply';
import { YourSupplyCell } from './cells/YourSupply';
import { useCustomStyles } from './customStyles';
import classes from './TableMarket.module.scss';
import { selectUserAddress } from 'features';
import { useAppSelector } from 'features/store';
import { MarketTableType, SVGIcon } from 'types';
import { bigintComparator, numberComparator } from 'utils';

const sortingOrder: GridSortDirection[] = ['desc', 'asc'];

const commonCellParams = {
  hideSortIcons: true,
  filterable: false,
  disableColumnMenu: true,
  sortingOrder,
};

export type MarketTableRow = {
  symbol: string;
  assetName: string;
  totalApyPercent: number;
  assetIcon: SVGIcon;
  id: string;
  rateValue: bigint;
  rateDisplay: string;
  balanceValue: bigint;
  balanceDisplay: string;
  userBalanceValue?: bigint;
  userBalanceDisplay?: string;
  marketUnderlyingDisplay: string;
  marketMNTDisplay: string;
  marketTaikoDisplay: string;
  nftBdrDisplay?: string;
  userBalanceUnderlying?: string;
  buttonDisabled: boolean;
  underlyingBalance?: string;
  operationDisabledTooltipAvailable?: boolean;
  nftCtaValue: number;
  mintsBoost: number;
  mintsNftBoostPercentage: number;
  mintsTotalRewards: number;
};

interface TableMarketProps {
  total: string;
  type: MarketTableType;
  isLoading?: boolean;
  list: MarketTableRow[];
  userData: { isWhitelisted };
  delta: number;
}

// TODO: refactor this component,  it very ugly and mixed with requests
const TableMarket: React.FC<TableMarketProps> = ({
  type,
  list,
  isLoading = false,
  total,
  delta,
}) => {
  const { t } = useTranslation();
  const isSupplyType = type === MarketTableType.Lend;
  const { isMobile } = useMediaBrakepoint();
  const accountAddress = useAppSelector(selectUserAddress);
  const history = useHistory();
  const hasNftBdrBoost = list.some((el) => Number(el.nftBdrDisplay) > 0);

  const [sortingModel, updateSortingModel] = React.useState({
    field: 'balanceValue',
    sort: 'desc',
  });

  const handleStateChange = (state: any) => {
    if (state.sorting.sortModel[0]) {
      updateSortingModel(state.sorting.sortModel[0]);
    }
  };

  const AssetNameColumn = useCallback(
    (overrides: Partial<GridColDef> = {}): GridColDef => ({
      ...commonCellParams,
      field: 'assetName',
      headerName: t('markets.asset'),
      headerClassName: 'assetHeaderCell',
      cellClassName: 'assetCell',
      renderCell: (item) => (
        <AssetNameCell
          isLoading={isLoading}
          item={item}
          hideUnderlying={!accountAddress || !isSupplyType}
        />
      ),
      renderHeader: (item) => {
        const headerCategoryProps = {
          label: item.colDef.headerName || '',
          sorted: sortingModel.field === item.field,
          sortOrder: sortingModel.sort,
        };
        return <HeaderCategory {...headerCategoryProps} />;
      },
      ...overrides,
    }),
    [isLoading, accountAddress, sortingModel]
  );

  const BalanceColumn = useCallback(
    (overrides: Partial<GridColDef> = {}): GridColDef => ({
      ...commonCellParams,
      field: 'balanceValue',
      headerName: isMobile
        ? isSupplyType
          ? t('markets.totalSupplyMobile')
          : t('markets.totalBorrowMobile')
        : isSupplyType
        ? t('markets.totalSupply')
        : t('markets.totalBorrow'),

      align: 'right',
      headerAlign: 'right',
      headerClassName: 'totalSupplyHeaderCell',
      cellClassName: 'totalSupplyCell',
      sortComparator: bigintComparator,
      renderHeader: (item) => {
        const headerCategoryProps = {
          label: item.colDef.headerName || '',
          sorted: sortingModel.field === item.field,
          sortOrder: sortingModel.sort,
        };
        return <HeaderCategory {...headerCategoryProps} />;
      },
      renderCell: (item) => (
        <TotalSupplyCell item={item} isLoading={isLoading} />
      ),
      ...overrides,
    }),
    [isLoading, isSupplyType, sortingModel, isMobile]
  );

  const RateColumn = useCallback(
    (overrides: Partial<GridColDef> = {}): GridColDef => ({
      ...commonCellParams,
      field: 'totalApyPercent',
      headerName: isSupplyType
        ? t('markets.supplyApy')
        : t('markets.borrowApr'),
      align: 'right',
      headerAlign: 'right',
      sortComparator: numberComparator,
      headerClassName: 'rateHeaderCell',
      cellClassName: 'rateColumn',
      renderHeader: (item) => {
        const headerCategoryProps = {
          label: item.colDef.headerName || '',
          sorted: sortingModel.field === item.field,
          sortOrder: sortingModel.sort,
        };
        return <HeaderCategory {...headerCategoryProps} />;
      },
      renderCell: (item) => (
        <Rate item={item} isLoading={isLoading} isSupplyType={isSupplyType} />
      ),
      ...overrides,
    }),
    [isLoading, isSupplyType, sortingModel]
  );

  const UserBalanceColumn = useCallback(
    (overrides: Partial<GridColDef> = {}): GridColDef => ({
      ...commonCellParams,
      field: 'userBalanceValue',
      headerName: isSupplyType
        ? t('markets.yourSupply')
        : t('markets.yourBorrow'),
      align: 'right',
      headerAlign: 'right',
      headerClassName: 'yourSupplyHeaderCell',
      cellClassName: 'yourSupplyCell',
      sortComparator: bigintComparator,
      renderHeader: (item) => {
        const headerCategoryProps = {
          label: item.colDef.headerName || '',
          sorted: sortingModel.field === item.field,
          sortOrder: sortingModel.sort,
        };
        return <HeaderCategory {...headerCategoryProps} />;
      },
      renderCell: (item) => (
        <YourSupplyCell item={item} isLoading={isLoading} />
      ),
      ...overrides,
    }),
    [isLoading, isSupplyType, sortingModel]
  );

  const ButtonsColumn = useCallback(
    (overrides: Partial<GridColDef> = {}): GridColDef => ({
      ...commonCellParams,
      field: 'supplyButtons',
      headerName: '',
      sortable: false,
      headerClassName: 'buttonHeaderCell',
      cellClassName: 'buttonColumn',
      align: 'right',
      renderCell: (item) => (
        <ButtonCell
          item={item}
          isLoading={isLoading}
          isSupplyType={isSupplyType}
          type={type}
        />
      ),
      ...overrides,
    }),
    [isLoading, isSupplyType]
  );

  const rowHeight = useMediaValue(96, 98, hasNftBdrBoost ? 129 : 101);
  const customStyles = useCustomStyles();
  const pb = useMediaValue(0, 8, 16);
  const pt = useMediaValue(16, 24, 32);

  const columns: GridColDef[] = [
    AssetNameColumn(),
    BalanceColumn(),
    RateColumn(),
    UserBalanceColumn(),
    ButtonsColumn(),
  ];

  const getCellClassName = ({ field }: GridCellParams<number>) => {
    if (field === 'asset') return 'assetColumn';
    if (field === 'supplyButtons') return 'buttonColumn';
    return 'customizedCell';
  };

  const tableTotalTitle = useMemo(() => {
    if (isMobile) {
      return t('common.total');
    }
    return isSupplyType ? t('markets.totalSupply') : t('markets.totalBorrow');
  }, [isMobile, t, isSupplyType]);

  const onRowClick = (params, event) => {
    if (!event.target.closest('.table-tooltip-content')) {
      history.push(`/market/${params.row.symbol}`);
    }
  };

  return (
    <Card
      sx={{
        flex: 1,
        padding: '0px !important',
        paddingBottom: `${pb}px !important`,
        paddingTop: `${pt}px !important`,
      }}
    >
      <Row className={classes.headerRow}>
        <Typography
          text={isSupplyType ? t('markets.supply') : t('markets.borrow')}
          variant='cardHeader'
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {accountAddress && (
            <Row className={classes.totalRow}>
              <Typography
                className={classes.title}
                variant='copyMBold'
                text={`${tableTotalTitle}:`}
              />
              <Typography className={classes.usd} variant='copyM' text={'$'} />
              <Typography
                className={classes.total}
                text={total}
                variant='copyLBold'
              />
            </Row>
          )}

          {!!delta && (
            <TooltipWrapper
              title={t(
                isSupplyType ? 'markets.supplyDelta' : 'markets.borrowDelta'
              )}
            >
              <Delta delta={delta} />
            </TooltipWrapper>
          )}
        </div>
      </Row>
      <EnchancedTable
        initialState={{
          sorting: {
            sortModel: [{ field: 'balanceValue', sort: 'desc' }],
          },
        }}
        columnVisibilityModel={{
          userBalanceValue: !!accountAddress,
          supplyButtons: !isMobile,
          assetName: true,
          balanceValue: true,
          rateValue: true,
        }}
        rows={isLoading ? [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }] : list}
        columns={columns}
        onStateChange={handleStateChange}
        sx={customStyles}
        getCellClassName={getCellClassName}
        headerHeight={24}
        rowHeight={rowHeight}
        onRowClick={onRowClick}
      />
    </Card>
  );
};

export default TableMarket;
