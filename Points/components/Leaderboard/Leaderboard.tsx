import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { PointsLeaderboard } from '@fuul/sdk/dist/types/api';
import {
  EnchancedTable,
  Col,
  Typography,
  HeaderCategory,
  Card,
  useMediaValue,
  unit,
  useMediaBrakepoint,
  Pagination,
  useTheme,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { useMarkupValues } from './LeadebordStyles';
import classes from './Leaderboard.module.scss';
import { MINTSIcon, WarningIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import { useGetPointsLeaderboardQuery } from 'features/thirdPartyApi/apis/fuulApi';
import { displayTruncated, getColorFromHash, pickBy } from 'utils';

const LIMIT = 5;

enum orderByList {
  rank = 'rank',
  user = 'user',
  amount = 'amount',
}

// DO NOT MUTATE THIS
enum orderDirectionList {
  ASC = 'ASC',
  DESC = 'DESC',
}

const DUMMY_LIST: LeaderboardItem[] = [
  { address: '0x027f0cdfbe17669038720eed72db804173e436be' },
  { address: '0xecf544d7cda31818be0d4f84904ffd2b1cd1c421' },
  { address: '0x45a7eb0a28a7527eedd0adf546698a7ddf9ae71a' },
  { address: '0x6659eaf465a87d01f70c96865ebdff8124df7919' },
];

const sortingOrder = Object.values(orderDirectionList).map((i) =>
  i.toLowerCase()
) as any;

type LeaderboardItem = {
  address: string;
  total_amount?: string;
  rank?: number;
  total_attributions?: number;
  backgroundStartColor?: string;
  backgroundEndColor?: string;
};

export const LeaderBoard: React.FC = () => {
  const theme = useTheme();
  const [_list, setList] = useState<PointsLeaderboard[]>([]);

  const [count, setCount] = useState<null | number>(null);
  const [orderBy, setOrderBy] = useState(orderByList.rank);
  const [orderDirection, setOrderDirection] = useState(orderDirectionList.DESC);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { t } = useTranslation();
  const { isMobile } = useMediaBrakepoint();

  const {
    data,
    isLoading,
    isFetching: isRequestFetching,
  } = useGetPointsLeaderboardQuery({
    page,
  });

  const list = useMemo<LeaderboardItem[]>(
    () => (isLoading ? DUMMY_LIST : _list),
    [_list, isLoading]
  );

  const isFetching = isLoading || isRequestFetching;

  useEffect(() => {
    if (!data) return;
    setList(
      data.results.map((item) => ({
        ...item,
        backgroundStartColor: getColorFromHash(
          item.address + '1',
          'rgb(255, 110, 127)',
          'rgb(230, 100, 101)'
        ),
        backgroundEndColor: getColorFromHash(
          item.address + '2',
          'rgb(145, 152, 229)',
          'rgb(247, 187, 151)'
        ),
      }))
    );
    setCount(data.total_results);
    setTotalPages(Math.ceil(data.total_results / data.page_size));
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
    }
  };

  const {
    rowHeight,
    headerHeight,
    footerHeight,
    maxListHeight,
    paddingBottom,
    loaders,
  } = useMarkupValues();

  const shouldHideFooter = (count ?? 0) <= LIMIT;
  const extraHeight = useMediaValue(70, 89, 132);
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
          text={t('points.leaderboard.noRows')}
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
          totalPages={totalPages}
          currentPage={page}
          onChangePage={(page: number) => {
            setPage(page);
          }}
        />
      </Col>
    ),
    [count, footerHeight, page, totalPages]
  );

  const RankCell = useCallback(
    ({ rank }: { rank: string }) => {
      const rankEmoji =
        rank == '1' ? '🥇 ' : rank == '2' ? '🥈 ' : rank == '3' ? '🥉 ' : '';
      return isFetching ? (
        <SkeletonRect width={loaders.rank.width} height={loaders.rank.height} />
      ) : (
        <Typography
          variant='copyMBold'
          style={{ color: '#222A34' }}
          text={`${rankEmoji}#${rank}`}
        />
      );
    },
    [isFetching, t, loaders]
  );

  const AmountCell = useCallback(
    ({
      amount,
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
        <>
          <MINTSIcon className={classes.amountIcon} />
          <Typography variant={'copyMBold'}>{unit(amount)}</Typography>
        </>
      );
    },
    [isFetching, isMobile, loaders]
  );

  const UserCell = useCallback(
    ({
      hash,
      backgroundStartColor,
      backgroundEndColor,
    }: {
      hash: string;
      backgroundStartColor: string;
      backgroundEndColor: string;
    }) => {
      return isFetching ? (
        <SkeletonRect width={loaders.user.width} height={loaders.user.height} />
      ) : (
        <>
          <div
            className={classes.userIcon}
            style={{
              background: `linear-gradient(90deg, ${backgroundStartColor}, ${backgroundEndColor})`,
            }}
          ></div>
          <Typography
            className={classes.hashLabel}
            variant={'copyMBold'}
            text={displayTruncated(hash, 6, 4)}
          />
        </>
      );
    },
    [isFetching, isMobile, loaders]
  );

  return (
    <Card
      sx={{
        width: '100%',
        mb: '0px',
        overflow: 'hidden',
        height: `${listHeight}px !important`,
        paddingRight: '0px !important',
        paddingLeft: '0px !important',
        marginTop: '40px !important',
      }}
    >
      <div
        style={{
          marginBottom: `${tPadding}px`,
          marginLeft: `${tPadding}px`,

          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Typography
          text={t('points.leaderboard.header')}
          variant='cardHeader'
        />
        <MINTSIcon className={classes.headerIcon} />
        <Typography
          text={t('points.leaderboard.mints')}
          variant='cardHeader'
          style={{
            color: pickBy(theme.palette.customTheme, {
              taiko: '#E91898',
              ethereum: '#04797F',
            }),
          }}
        />
      </div>
      <EnchancedTable
        sortingMode='client'
        getRowId={(row) => row.address}
        sx={{
          border: 'none',
          // remove border on last item
          '& .MuiDataGrid-row--lastVisible': {
            '& .MuiDataGrid-cell': { border: 'none' },
          },
          '.MuiDataGrid-row > .MuiDataGrid-cell:last-child': {
            padding: 0,
            width: '0 !important',
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

          '& .RankHeader': {
            width: `33% !important`,
            maxWidth: `33% !important`,
            minWidth: `33% !important`,
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              justifyContent: 'flex-start',
            },
          },
          '& .RankCell': {
            width: `33% !important`,
            maxWidth: `33% !important`,
            minWidth: `33% !important`,
          },
          '& .AmountHeader': {
            width: `33% !important`,
            maxWidth: `33% !important`,
            minWidth: `33% !important`,
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              justifyContent: 'flex-end',
            },
          },
          '& .AmountCell': {
            justifyContent: 'flex-end',
            width: `33% !important`,
            maxWidth: `33% !important`,
            minWidth: `33% !important`,
          },
          '& .UserHeader': {
            width: `34% !important`,
            maxWidth: `34% !important`,
            minWidth: `34% !important`,
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              justifyContent: 'center',
            },
          },
          '& .UserIdCell': {
            justifyContent: 'center',
            width: `34% !important`,
            maxWidth: `34% !important`,
            minWidth: `34% !important`,
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
            sortable: false,
            hideSortIcons: true,
            filterable: false,
            disableColumnMenu: true,
            sortingOrder,
            field: 'rank',
            headerClassName: 'RankHeader',
            cellClassName: 'RankCell',
            headerName: t('points.leaderboard.columns.rank'),

            renderCell: (item) => <RankCell rank={item.row.rank} />,
            renderHeader: (item) => {
              return (
                <HeaderCategory
                  label={item.colDef.headerName as string}
                  sorted={orderBy === 'rank'}
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
            field: 'address',
            headerClassName: 'UserHeader',
            cellClassName: 'UserIdCell',
            headerName: t('points.leaderboard.columns.user'),

            renderCell: (item) => (
              <UserCell
                hash={item.row.address}
                backgroundStartColor={item.row.backgroundStartColor}
                backgroundEndColor={item.row.backgroundEndColor}
              />
            ),
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
          {
            sortable: false,
            hideSortIcons: true,
            filterable: false,
            disableColumnMenu: true,
            sortingOrder,
            field: 'total_amount',
            headerClassName: 'AmountHeader',
            cellClassName: 'AmountCell',
            headerName: t('points.leaderboard.columns.amount'),

            renderCell: (item) => <AmountCell amount={item.row.total_amount} />,
            renderHeader: (item) => {
              return (
                <HeaderCategory
                  label={item.colDef.headerName as string}
                  sorted={orderBy === 'amount'}
                  sortOrder={orderDirection.toLowerCase()}
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
