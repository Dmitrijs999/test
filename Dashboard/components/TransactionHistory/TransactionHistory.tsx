import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  EnchancedTable,
  Col,
  Typography,
  HeaderCategory,
  NumericInfo,
  IconButton,
  Card,
  useMediaValue,
  usd,
  unit,
  useMediaBrakepoint,
  Pagination,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './TransactionHistory.module.scss';
import { ExplorerIcon, WarningIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import {
  composeExplorerLink,
  getMarketNameWithOverride,
  useGetUserTransactionHistoryAllMarketsQuery,
} from 'features';
import { EventType, IEventHistoryItemExt } from 'types';
import { displayTruncated } from 'utils';

const LIMIT = 10;

enum orderByList {
  block = 'block',
  amountUsd = 'amountUsd',
  type = 'type',
  market = 'market',
}

// DO NOT MUTATE THIS
enum orderDirectionList {
  ASC = 'ASC',
  DESC = 'DESC',
}

const DUMMY_LIST = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

const sortingOrder = Object.values(orderDirectionList).map((i) =>
  i.toLowerCase()
) as any;

const mapEventType: Record<EventType, string> = {
  [EventType.INVALID]: 'transactionHistory.types.invalid',
  [EventType.LEND]: 'transactionHistory.types.lend',
  [EventType.BORROW]: 'transactionHistory.types.borrow',
  [EventType.REDEEM]: 'transactionHistory.types.redeem',
  [EventType.REPAY]: 'transactionHistory.types.repay',
  [EventType.AUTO_REPAY]: 'transactionHistory.types.autoRepay',
  [EventType.SEIZE]: 'transactionHistory.types.seize',
  [EventType.TRANSFER_IN]: 'transactionHistory.types.transferIn',
  [EventType.TRANSFER_OUT]: 'transactionHistory.types.transferOut',
};

const useMarkupValues = (): {
  rowHeight: number; // from figma
  headerHeight: number; // from figma
  footerHeight: number; // from figma
  maxListHeight: number; // from figma
  paddingLeft: number; // move content of first column without moving border
  paddingBottom: number; // to make list with 1 item more buty, maybe unnecessary
  explorerIconSize: number; // from figma
  rowWidths: {
    // from figma
    block: number;
    type: number;
    amount: number;
    hash: number;
  };
  loaders: {
    // from figma
    block: {
      width: number;
      height: number;
    };
    type: {
      width: number;
      height: number;
    };
    amount: {
      width: number;
      height: number;
    };
    hash: {
      width: number;
      height: number;
    };
  };
} => {
  const { isMobile, isTablet } = useMediaBrakepoint();
  const initalValues = {
    rowHeight: 58,
    headerHeight: 48,
    footerHeight: 64,
    maxListHeight: 823,
    paddingLeft: 0,
    paddingBottom: 10,
    explorerIconSize: 20,
    rowWidths: {
      block: 284,
      type: 284,
      amount: 301,
      hash: 304,
    },
    loaders: {
      block: { width: 64, height: 21 },
      type: { width: 64, height: 21 },
      amount: { width: 64, height: 21 },
      hash: { width: 150, height: 21 },
    },
  };
  if (isTablet) {
    initalValues.rowHeight = 56;
    initalValues.headerHeight = 40;
    initalValues.footerHeight = 64;
    initalValues.maxListHeight = 764;
    initalValues.paddingLeft = 0;
    initalValues.rowWidths = {
      block: 132,
      type: 132,
      amount: 186,
      hash: 130,
    };
    initalValues.loaders = {
      block: { width: 56, height: 16 },
      type: { width: 56, height: 16 },
      amount: { width: 56, height: 16 },
      hash: { width: 56, height: 16 },
    };
  }
  if (isMobile) {
    initalValues.rowHeight = 53;
    initalValues.headerHeight = 40;
    initalValues.footerHeight = 64;
    initalValues.maxListHeight = 710;
    initalValues.paddingLeft = 0;
    initalValues.paddingBottom = 5;
    initalValues.explorerIconSize = 20;
    initalValues.rowWidths = {
      block: 76,
      type: 76,
      amount: 76,
      hash: 90,
    };
    initalValues.loaders = {
      block: { width: 40, height: 16 },
      type: { width: 40, height: 16 },
      amount: { width: 40, height: 16 },
      hash: { width: 40, height: 16 },
    };
  }
  return initalValues;
};

const TransactionHistory: React.FC<{
  accountAddress: string;
  mb: string;
}> = ({ accountAddress, mb = '0' }) => {
  const [_list, setList] = useState<IEventHistoryItemExt[]>([]);
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState<null | number>(null);
  const [orderBy, setOrderBy] = useState(orderByList.block);
  const [orderDirection, setOrderDirection] = useState(orderDirectionList.DESC);

  const { t } = useTranslation();
  const { isMobile } = useMediaBrakepoint();

  const {
    isLoading,
    isFetching: isRequestFetching,
    data,
  } = useGetUserTransactionHistoryAllMarketsQuery(
    {
      accountAddress: accountAddress as string,
      skip,
      limit: LIMIT,
      orderBy,
      orderDirection,
    },
    { skip: !accountAddress }
  );
  const list = useMemo(
    () => (isLoading ? DUMMY_LIST : _list),
    [_list, isLoading]
  );

  const isFetching = isLoading || isRequestFetching;

  useEffect(() => {
    if (!data) return;
    setList(data.items);
    setCount(data.count);
  }, [data]);

  const onStateChange = (state: {
    sorting: { sortModel: [{ field: string; sort: string }] };
  }) => {
    const model = state.sorting.sortModel[0];
    if (model) {
      // prevent duping
      if (
        model.field === orderBy &&
        model.sort.toUpperCase() === orderDirection
      ) {
        return;
      }
      setOrderBy(model.field as orderByList);
      setOrderDirection(model.sort.toUpperCase() as orderDirectionList);
      setSkip(0);
    }
  };

  const onTransactionClick = (hash: string) => {
    const explorerLink = composeExplorerLink(hash);
    window && window?.open(explorerLink, '_blank')?.focus();
  };

  const {
    rowHeight,
    rowWidths,
    headerHeight,
    footerHeight,
    maxListHeight,
    paddingBottom,
    paddingLeft,
    loaders,
    explorerIconSize,
  } = useMarkupValues();

  const shouldHideFooter = (count ?? 0) <= LIMIT;
  const tableTitleMB = useMediaValue(16, 24, 32);
  //PaperPadding + title height + title margin
  const extraHeight = useMediaValue(70, 89, 132);
  const dateWidth = useMediaValue('40%', '20%', '20%');
  const txIdWidth = useMediaValue('10%', '20%', '20%');
  const extraHeightForNowRows = useMediaValue(94, 70, 99);
  const noRowsMt = useMediaValue(16, 24, 24);
  const tPadding = useMediaValue(16, 24, 32);

  // need to keeep grid healthy but height dynamic
  const listHeight = useMemo(() => {
    const _count = isLoading ? DUMMY_LIST.length : count;
    if (_count) {
      const c = _count < LIMIT ? _count : LIMIT;
      let allListHeight =
        rowHeight * c + headerHeight + paddingBottom + extraHeight;
      if (!shouldHideFooter) {
        allListHeight += footerHeight;
      }
      return allListHeight <= maxListHeight ? allListHeight : maxListHeight;
    }
    return (
      rowHeight +
      headerHeight +
      paddingBottom +
      extraHeightForNowRows +
      noRowsMt
    );
  }, [
    isLoading,
    extraHeight,
    count,
    maxListHeight,
    rowHeight,
    headerHeight,
    footerHeight,
    paddingBottom,
    shouldHideFooter,
  ]);

  const NoRowsOverlay = useCallback(
    () => (
      <div
        className={classes.noRowsOverlay}
        style={{
          marginTop: noRowsMt,
          marginLeft: `${tPadding}px`,
          marginRight: `${tPadding}px`,
        }}
      >
        <WarningIcon className={classes.warningIcon} width={20} height={20} />
        <Typography
          className={classes.text}
          variant='copyM'
          text={t('transactionHistory.noRows')}
        />
      </div>
    ),
    [data]
  );

  const PaginationOverride = useCallback(
    () => (
      <Col
        style={{
          width: '100%',
          height: footerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '24px',
        }}
      >
        <Pagination
          totalPages={count ? Math.ceil(count / LIMIT) : 0}
          currentPage={skip / LIMIT + 1}
          onChangePage={(page: number) => {
            setSkip((page - 1) * LIMIT);
          }}
        />
      </Col>
    ),
    [count, footerHeight, skip]
  );
  const DateTimeCell = useCallback(
    ({ date, time }: { date: string; time: string }) => {
      return (
        <Col style={{ paddingLeft, padding: 0 }}>
          {isFetching ? (
            <SkeletonRect
              width={loaders.block.width}
              height={loaders.block.height}
            />
          ) : (
            <React.Fragment>
              <Typography
                variant='copyM'
                style={{ color: '#222A34' }}
                text={date}
              />
              <Typography
                style={{ marginTop: '4px', color: '#595D6C' }}
                variant={'copyS'}
                text={time}
              />
            </React.Fragment>
          )}
        </Col>
      );
    },
    [isFetching, isMobile, loaders, paddingLeft]
  );

  const MarketNameCell = useCallback(
    ({ marketName }: { marketName: string }) => {
      return (
        <Col style={{ paddingLeft, padding: 0 }}>
          {isFetching ? (
            <SkeletonRect
              width={loaders.type.width}
              height={loaders.type.height}
            />
          ) : (
            <Typography
              variant='copyM'
              style={{ color: '#222A34' }}
              text={marketName}
            />
          )}
        </Col>
      );
    },
    [isFetching, isMobile, loaders]
  );

  const TypeCell = useCallback(
    ({ type }: { type: EventType }) => {
      return isFetching ? (
        <SkeletonRect width={loaders.type.width} height={loaders.type.height} />
      ) : (
        <Typography
          variant='copyM'
          style={{ color: '#222A34' }}
          text={t(mapEventType[type])}
        />
      );
    },
    [isFetching, t, loaders]
  );

  const AmountCell = useCallback(
    ({
      amount,
      amountUsd,
      tokenSymbol,
    }: {
      amount?: string;
      amountUsd?: string;
      tokenSymbol?: string;
    }) => {
      return isFetching ? (
        <SkeletonRect
          width={loaders.amount.width}
          height={loaders.amount.height}
        />
      ) : (
        <NumericInfo
          value={usd(amountUsd, { sign: '' })}
          containerStyle={{ height: rowHeight, alignItems: 'center' }}
          subValue={`${unit(amount)} ${tokenSymbol}`}
          isLoading={false}
          align='left'
        />
      );
    },
    [isFetching, isMobile, loaders]
  );

  const HashCell = useCallback(
    ({ hash }: { hash: string }) => {
      return isFetching ? (
        <SkeletonRect width={loaders.hash.width} height={loaders.hash.height} />
      ) : (
        <IconButton
          onClick={() => onTransactionClick(hash)}
          disableTouchRipple
          sx={{
            justifyContent: 'flex-end',
            marginRight: '3px',
            padding: '0px !important',
            '&:hover': { background: 'inherit' },
          }}
          variant='text'
          size='medium'
          endIcon={
            <ExplorerIcon
              width={explorerIconSize}
              height={explorerIconSize}
              className={classes.linkIcon}
            />
          }
        >
          {!isMobile && (
            <Typography
              className={classes.hashLabel}
              variant={'copyMBold'}
              text={displayTruncated(hash, 4, 4)}
            />
          )}
        </IconButton>
      );
    },
    [isFetching, isMobile, loaders]
  );

  return (
    <Card
      sx={{
        width: '100%',
        mb,
        overflow: 'hidden', // prevent items border overlow
        height: `${listHeight}px !important`, // need to handle dynamic height
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
        marginTop: '40px !important',
      }}
    >
      <Typography
        style={{
          marginBottom: `${tableTitleMB}px`,
          marginLeft: `${tPadding}px`,
        }}
        text={t('marketDetail.userPositionBlock.transactionHistory')}
        variant='cardHeader'
      />
      <EnchancedTable
        sortingMode='server'
        sx={{
          border: 'none',
          // remove border on last item
          '& .MuiDataGrid-row--lastVisible': {
            '& .MuiDataGrid-cell': { border: 'none' },
          },
          '.MuiDataGrid-row > .MuiDataGrid-cell:last-child': {
            padding: 0,
          },
          '& .MuiDataGrid-footerContainer': {
            minHeight: footerHeight,
            borderTop: 'none',
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            width: '100% !important',
            '>div': {
              width: '100%',
            },
            '& .MuiDataGrid-row': {
              width: '100%',
              padding: `0 ${tPadding}px`,
            },
          },
          '& .MuiDataGrid-columnHeaders': {
            margin: `0 ${tPadding}px`,
          },
          '& .MuiDataGrid-columnHeadersInner': {
            width: '100%',
            '>div': {
              width: '100%',
            },
          },
          '& .DateTimeHeader': {
            paddingLeft: 0,
            width: `${dateWidth} !important`,
            maxWidth: `${dateWidth} !important`,
            minWidth: `${dateWidth} !important`,
          },
          '& .DateTimeCell': {
            paddingLeft: 0,
            width: `${dateWidth} !important`,
            maxWidth: `${dateWidth} !important`,
            minWidth: `${dateWidth} !important`,
          },
          '& .MarketNameHeader': {
            width: '20% !important',
            maxWidth: '20% !important',
            minWidth: '20% !important',
          },
          '& .MarketNameCell': {
            width: '20% !important',
            maxWidth: '20% !important',
            minWidth: '20% !important',
          },
          '& .TypeHeader': {
            width: '20% !important',
            maxWidth: '20% !important',
            minWidth: '20% !important',
          },
          '& .TypeCell': {
            width: '20% !important',
            maxWidth: '20% !important',
            minWidth: '20% !important',
          },
          '& .AmountHeader': {
            width: '20% !important',
            maxWidth: '20% !important',
            minWidth: '20% !important',
          },
          '& .AmountCell': {
            width: '20% !important',
            maxWidth: '20% !important',
            minWidth: '20% !important',
          },
          '& .TransactionIdHeader': {
            justifyContent: 'flex-end',
            width: `${txIdWidth} !important`,
            maxWidth: `${txIdWidth} !important`,
            minWidth: `${txIdWidth} !important`,
            paddingRight: 0,
            '>div': {
              width: 'auto',
            },
          },
          '& .TransactionIdCell': {
            justifyContent: 'flex-end',
            width: `${txIdWidth} !important`,
            maxWidth: `${txIdWidth} !important`,
            minWidth: `${txIdWidth} !important`,
            paddingRight: 0,
          },
        }}
        components={{
          NoRowsOverlay,
          Pagination: PaginationOverride,
        }}
        rows={list}
        autoHeight={false}
        onStateChange={onStateChange}
        hideFooter={shouldHideFooter}
        hideFooterPagination={false}
        hideFooterSelectedRowCount={true}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        columns={[
          {
            hideSortIcons: true,
            filterable: false,
            disableColumnMenu: true,
            sortingOrder,
            field: orderByList.block,
            headerClassName: 'DateTimeHeader',
            cellClassName: 'DateTimeCell',
            headerName: isMobile
              ? t('transactionHistory.columns.dateTimeMobile')
              : t('transactionHistory.columns.dateTime'),
            width: rowWidths.block,
            renderCell: (item) => (
              <DateTimeCell
                date={item.row.date as string}
                time={item.row.time as string}
              />
            ),
            renderHeader: (item) => {
              return (
                <div style={{ paddingLeft }}>
                  <HeaderCategory
                    label={item.colDef.headerName as string}
                    sorted={orderBy === 'block'}
                    sortOrder={orderDirection.toLowerCase()}
                    withoutSorting={!item.colDef.sortable}
                  />
                </div>
              );
            },
          },
          {
            sortable: false,
            hideSortIcons: true,
            filterable: false,
            disableColumnMenu: true,
            sortingOrder,
            field: orderByList.market,
            headerClassName: 'MarketNameHeader',
            cellClassName: 'MarketNameCell',
            headerName: t('transactionHistory.columns.marketName'),
            width: rowWidths.block,
            renderCell: (item) => (
              <MarketNameCell
                marketName={getMarketNameWithOverride(
                  'm' + item.row.tokenSymbol
                )}
              />
            ),
            renderHeader: (item) => {
              return (
                <HeaderCategory
                  label={item.colDef.headerName as string}
                  sorted={orderBy === 'type'}
                  sortOrder={orderDirection.toLowerCase()}
                  withoutSorting={!item.colDef.sortable}
                />
              );
            },
          },
          {
            sortable: false,
            hideSortIcons: true,
            filterable: false,
            disableColumnMenu: true,
            sortingOrder,
            field: orderByList.type,
            headerClassName: 'TypeHeader',
            cellClassName: 'TypeCell',
            headerName: t('transactionHistory.columns.type'),
            width: rowWidths.type,
            renderCell: (item) => (
              <TypeCell type={item.row.type as EventType} />
            ),
            renderHeader: (item) => {
              return (
                <HeaderCategory
                  label={item.colDef.headerName as string}
                  sorted={orderBy === 'type'}
                  sortOrder={orderDirection.toLowerCase()}
                  withoutSorting={!item.colDef.sortable}
                />
              );
            },
          },
          {
            sortable: false,
            hideSortIcons: true,
            filterable: false,
            disableColumnMenu: true,
            sortingOrder,
            field: orderByList.amountUsd,
            headerClassName: 'AmountHeader',
            cellClassName: 'AmountCell',
            headerName: t('transactionHistory.columns.amount'),
            width: rowWidths.amount,
            renderCell: (item) => (
              <AmountCell
                amount={item.row.amount}
                amountUsd={item.row.amountUsd}
                tokenSymbol={item.row.tokenSymbol}
              />
            ),
            renderHeader: (item) => {
              return (
                <HeaderCategory
                  label={item.colDef.headerName as string}
                  sorted={orderBy === 'amountUsd'}
                  sortOrder={orderDirection.toLowerCase()}
                  withoutSorting={!item.colDef.sortable}
                />
              );
            },
          },
          {
            sortable: false,
            hideSortIcons: true,
            filterable: false,
            disableColumnMenu: true,
            sortingOrder,
            field: 'hash',
            headerClassName: 'TransactionIdHeader',
            cellClassName: 'TransactionIdCell',
            headerName: isMobile
              ? t('transactionHistory.columns.transactionIDMobile')
              : t('transactionHistory.columns.transactionID'),
            width: rowWidths.hash,
            renderCell: (item) => <HashCell hash={item.row.txHash} />,
            renderHeader: (item) => {
              return (
                <HeaderCategory
                  label={item.colDef.headerName as string}
                  sorted={false}
                  sortOrder={'desc'}
                  withoutSorting={!item.colDef.sortable}
                />
              );
            },
          },
        ]}
      />
    </Card>
  );
};

export default TransactionHistory;
