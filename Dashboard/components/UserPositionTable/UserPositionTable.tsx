import React, { useCallback, useMemo, useState } from 'react';

import {
  Card,
  HeaderCategory,
  EnchancedTable,
  CheckboxItem,
  Typography,
  Row,
  ButtonGroup,
  Col,
  useMediaValue,
  useMediaBrakepoint,
} from '@minterest-finance/ui-kit';
import {
  GridColDef,
  GridColumnHeaderParams,
  GridRowParams,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { AssetNameCell } from './cells/AssetName';
import { BalanceCell } from './cells/Balance';
import { ButtonsCell } from './cells/Buttons';
import { CollateralCell } from './cells/Collateral';
import { EmissionCell } from './cells/Emission';
import {
  Emission,
  Balance,
  commonCellParams,
  useCustomStyles,
  DUMMY_LIST,
  initialState,
} from './constants';
import classes from './UserPositionTable.module.scss';
import { SVGIcon } from 'types';
import { bigintComparator, numberComparator } from 'utils';

export type UserTableRow = {
  symbol: string;
  assetName: string;
  assetIcon: SVGIcon;
  id: string;
  userSupplyValue: bigint;
  userSupplyDisplay: string;
  userSupplyUnderlying: string;
  userBorrowValue: bigint;
  userBorrowDisplay: string;
  userBorrowUnderlying: string;
  supplyApyValue: bigint;
  supplyTotalApyPercent: number;
  supplyApyDisplay: string;
  mntSupplyAPY: string;
  taikoSupplyAPY: string;
  borrowAprValue: bigint;
  borrowTotalAprPercent: number;
  borrowAprDisplay: string;
  mntBorrowAPY: string;
  taikoBorrowAPY: string;
  netApyValue: bigint;
  netApyDisplay: string;
  borrowDisabled: boolean;
  supplyDisabled: boolean;
  underlyingBalance?: string;
  operationDisabledTooltipAvailable?: boolean;
  nftBdrBorrowBoost: string;
  nftBdrSupplyBoost: string;
  nftCtaValueBorrow: number;
  nftCtaValueSupply: number;
  mintsSupplyBoost: number;
  mintsSupplyNftBoostPercentage: number;
  mintsSupplyTotalRewards: number;
  mintsBorrowBoost: number;
  mintsBorrowNftBoostPercentage: number;
  mintsBorrowTotalRewards: number;
};

interface UserPositionTableProps {
  list: UserTableRow[];
  isLoading?: boolean;
}

const UserPositionTable: React.FC<UserPositionTableProps> = ({
  list,
  isLoading = false,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { isMobile, isTablet, isDesktop } = useMediaBrakepoint();
  const [showZeroBalance, setShowZeroBalance] = useState(true);
  const [emission, setEmission] = useState(Emission.apy);
  const customStyles = useCustomStyles();
  const [sortingModel, updateSortingModel] = useState({
    field: 'userSupplyValue',
    sort: 'desc',
  });
  const hasNftBdrBoost = list.some(
    (el) => Number(el.nftBdrBorrowBoost) > 0 || Number(el.nftBdrSupplyBoost) > 0
  );
  const emissionButtons = useMemo(
    () => [
      { id: Emission.apy, title: t('markets.lend') },
      { id: Emission.apr, title: t('markets.borrow') },
    ],
    []
  );
  const onEmissionChange = useCallback(
    (item: { id: string; title: string }) => setEmission(item.id as Emission),
    [setEmission]
  );
  const onSetZeroBalance = useCallback(
    () => setShowZeroBalance((prev) => !prev),
    []
  );
  const onRowClick = useCallback(
    (item: GridRowParams<UserTableRow>) =>
      history.push(`/market/${item.row.symbol}`),
    []
  );
  const handleStateChange = (state: any) => {
    if (state.sorting.sortModel[0]) {
      updateSortingModel(state.sorting.sortModel[0]);
    }
  };

  const renderHeader = useCallback(
    (item: GridColumnHeaderParams<any, UserTableRow>) => (
      <HeaderCategory
        label={item.colDef.headerName ?? ''}
        sorted={sortingModel.field === item.field}
        sortOrder={sortingModel.sort}
        withoutSorting={!item.colDef.sortable}
      />
    ),
    [sortingModel]
  );

  const AssetNameColumn = useCallback(
    (overrides: Partial<GridColDef> = {}): GridColDef => ({
      ...commonCellParams,
      minWidth: 100,
      field: 'assetName',
      align: 'left',
      headerName: t('markets.asset'),
      headerClassName: 'assetHeaderCell',
      cellClassName: 'assetColumn',
      renderCell: (item) => <AssetNameCell isLoading={isLoading} item={item} />,
      renderHeader,
      ...overrides,
    }),
    [renderHeader, isLoading, sortingModel]
  );

  const UserBalanceColumn = useCallback(
    (overrides: Partial<GridColDef> = {}, balance: Balance): GridColDef => ({
      ...commonCellParams,
      field: balance === Balance.supply ? 'userSupplyValue' : 'userBorrowValue',
      headerName: t(
        balance === Balance.supply ? 'markets.yourSupply' : 'markets.yourBorrow'
      ),
      align: 'center',
      headerAlign: 'center',
      minWidth: 70,
      headerClassName: 'userHeaderCell',
      cellClassName: 'userColumn',
      sortComparator: bigintComparator,
      renderHeader: renderHeader,
      renderCell: (item) => (
        <BalanceCell item={item} balance={balance} isLoading={isLoading} />
      ),
      ...overrides,
    }),
    [renderHeader, isLoading, sortingModel]
  );

  const RateColumn = useCallback(
    (overrides: Partial<GridColDef> = {}, emission: Emission): GridColDef => ({
      ...commonCellParams,
      field:
        emission === Emission.apy
          ? 'supplyTotalApyPercent'
          : 'borrowTotalAprPercent',
      headerName: t(
        emission === Emission.apy ? 'markets.supplyApy' : 'markets.borrowApr'
      ),
      align: 'right',
      headerAlign: 'right',
      minWidth: 70,
      headerClassName: 'apyHeaderCell',
      cellClassName: 'apyColumn',
      sortComparator: numberComparator,
      renderCell: (item) => (
        <EmissionCell item={item} isLoading={isLoading} emission={emission} />
      ),
      renderHeader,
      ...overrides,
    }),
    [renderHeader, isLoading, sortingModel]
  );

  const CollateralColumn = useCallback(
    (overrides: Partial<GridColDef> = {}): GridColDef => ({
      ...commonCellParams,
      field: 'collateral',
      headerName: t('markets.collateral'),
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      minWidth: 70,
      headerClassName: 'collateralHeaderCell',
      cellClassName: 'collateralColumn',
      renderCell: (item) => (
        <CollateralCell isLoading={isLoading} item={item} />
      ),
      renderHeader,
      ...overrides,
    }),
    [renderHeader, isLoading]
  );

  const ButtonsColumn = useCallback(
    (overrides: Partial<GridColDef> = {}): GridColDef => ({
      ...commonCellParams,
      field: 'supplyButtons',
      headerName: '',
      sortable: false,
      hide: !isDesktop,

      align: 'right',
      minWidth: isTablet ? 100 : 180,
      headerClassName: 'buttonHeaderCell',
      cellClassName: 'buttonColumn',
      renderCell: (item) => (
        <ButtonsCell item={item} isLoading={isLoading} emission={emission} />
      ),
      ...overrides,
    }),
    [isLoading, isMobile, isTablet, emission]
  );

  const rows = useMemo(() => {
    if (showZeroBalance) {
      return list;
    }
    if (!isDesktop) {
      if (emission === Emission.apy) {
        return list.filter((i) => i.userSupplyValue);
      }
      if (emission === Emission.apr) {
        return list.filter((i) => i.userBorrowValue);
      }
    }
    return list.filter((i) => i.userSupplyValue || i.userBorrowValue);
  }, [list, showZeroBalance, emission, isDesktop]);

  const columns = useMemo(
    () => [
      AssetNameColumn(),
      UserBalanceColumn({}, Balance.supply),
      RateColumn({}, Emission.apy),
      UserBalanceColumn({}, Balance.borrow),
      RateColumn({}, Emission.apr),
      CollateralColumn(),
      ButtonsColumn(),
    ],
    [
      AssetNameColumn,
      UserBalanceColumn,
      RateColumn,
      CollateralColumn,
      ButtonsColumn,
    ]
  );

  const columnVisibilityModel = useMemo(
    () => ({
      supplyButtons: !isMobile,
      supplyApyValue: isDesktop ? true : emission === Emission.apy,
      userSupplyValue: isDesktop ? true : emission === Emission.apy,
      borrowAprValue: isDesktop ? true : emission === Emission.apr,
      userBorrowValue: isDesktop ? true : emission === Emission.apr,
    }),
    [isMobile, isDesktop, emission]
  );

  const rowHeight = useMediaValue(96, 98, hasNftBdrBoost ? 129 : 101);
  const headerMB = useMediaValue('24px', '23px', '31px');
  const SubHeader = useMediaValue(Col, Col, Row);
  const pb = useMediaValue(0, 8, 16);
  const pt = useMediaValue(16, 24, 32);

  return (
    <Card
      sx={{
        width: '100%',
        padding: '0px !important',
        paddingBottom: `${pb}px !important`,
        paddingTop: `${pt}px !important`,
      }}
    >
      <Row
        style={{
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: headerMB,
          alignItems: 'center',
          padding: `0 ${pt}px`,
        }}
      >
        <SubHeader style={{ justifyContent: 'space-between', width: '100%' }}>
          <Typography
            text={t('dashboard.positions.title')}
            variant='cardHeader'
            style={{ textTransform: 'uppercase' }}
          />
          <CheckboxItem
            label={
              <Typography
                className={classes.label}
                variant={'copyS'}
                text={t('dashboard.positions.showZeroBalances')}
              />
            }
            value={showZeroBalance}
            onChange={onSetZeroBalance}
            checked={showZeroBalance}
          />
        </SubHeader>
        {!isDesktop && (
          <ButtonGroup
            buttons={emissionButtons}
            onToggle={onEmissionChange}
            activeButtonId={emission}
          />
        )}
      </Row>
      <EnchancedTable
        rows={isLoading ? DUMMY_LIST : rows}
        initialState={initialState as any}
        columnVisibilityModel={columnVisibilityModel}
        columns={columns}
        onStateChange={handleStateChange}
        sx={customStyles}
        headerHeight={24}
        rowHeight={rowHeight}
        onRowClick={onRowClick}
        localeText={{
          noRowsLabel: t('positionsTable.noRows'),
        }}
      />
    </Card>
  );
};

export default UserPositionTable;
