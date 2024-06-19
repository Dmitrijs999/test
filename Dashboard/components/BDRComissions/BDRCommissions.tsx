import React, { useCallback, useMemo } from 'react';

import {
  Card,
  EnchancedTable,
  Typography,
  HeaderCategory,
  PercentageInfo,
  TooltipWrapper,
  useMediaBrakepoint,
  useMediaValue,
} from '@minterest-finance/ui-kit';
import { GridColDef } from '@mui/x-data-grid';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

import classes from './BDRCommissions.module.scss';
import { UserIcon, MinterestSmallIcon } from 'assets/svg';
import { selectUserAddress, useGetUserBDRAgreementsQuery } from 'features';
import { useAppSelector } from 'features/store';
import { displayTruncated } from 'utils';
import { MNT_DECIMALS } from 'utils/constants';
import { getRemainingPeriodLabel } from 'utils/datetime';

const commonCellParams = {
  hideSortIcons: true,
  filterable: false,
  disableColumnMenu: true,
};

const BDRComissions: React.FC = () => {
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const { isDesktop } = useMediaBrakepoint();

  const { data } = useGetUserBDRAgreementsQuery(accountAddress as string, {
    skip: !accountAddress,
  });

  const filteredData = useMemo(() => {
    if (!data || !data.length) return [];
    return data.filter((agreement) => agreement.isActive);
  }, [data]);

  const smallWidth = useMediaValue(
    '20% !important',
    '20% !important',
    '15% !important'
  );

  const mediumWidth = useMediaValue(
    '20% !important',
    '20% !important',
    '20% !important'
  );

  const largeWidth = useMediaValue(
    '20% !important',
    '20% !important',
    '30% !important'
  );

  const headerHeight = useMediaValue(90, 60, 24);

  const LiquidityProviderColumn = useCallback(
    (): GridColDef => ({
      ...commonCellParams,
      field: 'address',
      headerName: t('dashboard.BDRCommissions.addressTitle'),
      align: 'left',
      headerAlign: 'left',
      headerClassName: 'liquidityProviderHeader largeWidth',
      cellClassName: 'liquidityProviderCell largeWidth',
      renderHeader: () => {
        return (
          <HeaderCategory
            sorted={false}
            sortOrder={'initial'}
            withoutSorting
            label={t('dashboard.BDRCommissions.addressTitle')}
          />
        );
      },
      renderCell: (item) => {
        const { liquidityProvider } = item.row;
        const providerAddress = isDesktop
          ? liquidityProvider
          : displayTruncated(liquidityProvider, 4, 4);
        return (
          <div className={classes.addressCell}>
            <UserIcon width={18} height={18} className='icon' />
            <Typography text={providerAddress} variant='copyM' />
          </div>
        );
      },
    }),
    [largeWidth, isDesktop]
  );

  const BDRBoostColumn = useCallback(
    (): GridColDef => ({
      ...commonCellParams,
      field: 'boost',
      headerName: t('dashboard.BDRCommissions.BDRTitle'),
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'BDRBoostHeader smallWidth',
      cellClassName: 'BDRBoostCell smallWidth',
      renderHeader: () => {
        return (
          <HeaderCategory
            sorted={false}
            sortOrder={'initial'}
            withoutSorting
            label={t('dashboard.BDRCommissions.BDRTitle')}
          />
        );
      },
      renderCell: (item) => {
        const { representativeBonus } = item.row;
        const percentageInfoProps = {
          percentageValue: representativeBonus,
          netApyOnly: false,
          loading: false,
          rewardsArray: [{ rewardValue: 0 }],
        };
        return <PercentageInfo {...percentageInfoProps} />;
      },
    }),
    [smallWidth]
  );

  const LPBoostColumn = useCallback(
    (): GridColDef => ({
      ...commonCellParams,
      field: 'lpBoost',
      headerName: t('dashboard.BDRCommissions.BDRTitle'),
      headerClassName: 'LPRBoostHeader smallWidth',
      cellClassName: 'LPRBoostCell smallWidth',
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => {
        return (
          <HeaderCategory
            sorted={false}
            sortOrder={'initial'}
            withoutSorting
            label={t('dashboard.BDRCommissions.LPBoostTitle')}
          />
        );
      },
      renderCell: (item) => {
        const { liquidityProviderBoost } = item.row;
        const percentageInfoProps = {
          percentageValue: liquidityProviderBoost,
          netApyOnly: false,
          loading: false,
          rewardsArray: [{ rewardValue: 0 }],
        };
        return <PercentageInfo {...percentageInfoProps} />;
      },
    }),
    [smallWidth]
  );

  const TimeRemainingColumn = useCallback(
    (): GridColDef => ({
      ...commonCellParams,
      field: 'timeRemaining',
      headerName: t('dashboard.BDRCommissions.BDRTitle'),
      headerClassName: 'timeRemainingHeader mediumWidth',
      cellClassName: 'timeRemainingCell mediumWidth',
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => {
        return (
          <HeaderCategory
            sorted={false}
            sortOrder={'initial'}
            withoutSorting
            label={t('dashboard.BDRCommissions.timeRemainingTitle')}
          />
        );
      },
      renderCell: (item) => {
        const { endTimestamp } = item.row;
        return (
          <Typography
            text={getRemainingPeriodLabel(Number(endTimestamp), t)}
            variant='copyM'
          />
        );
      },
    }),
    [smallWidth]
  );

  const EarnedRewardColumn = useCallback(
    (): GridColDef => ({
      ...commonCellParams,
      field: 'earnedReward',
      headerName: t('dashboard.BDRCommissions.BDRTitle'),
      align: 'right',
      headerAlign: 'right',
      headerClassName: 'earnedRewardHeader mediumWidth',
      cellClassName: 'earnedRewardCell mediumWidth',
      renderHeader: () => {
        return (
          <HeaderCategory
            sorted={false}
            sortOrder={'initial'}
            withoutSorting
            label={t('dashboard.BDRCommissions.earnedRewardTitle')}
          />
        );
      },
      renderCell: (item) => {
        const { distributedMnt } = item.row;
        return (
          <Typography
            text={`${distributedMnt ?? '0.0'} MNT`}
            variant='copyMBold'
          />
        );
      },
    }),
    [largeWidth]
  );

  const columns = [
    LiquidityProviderColumn(),
    BDRBoostColumn(),
    LPBoostColumn(),
    TimeRemainingColumn(),
    EarnedRewardColumn(),
  ];

  const customStyles = {
    border: 'none',
    '& .MuiDataGrid-virtualScrollerRenderZone': {
      maxHeight: '520px',
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
    },
    '& .MuiDataGrid-columnHeadersInner': {
      width: '100%',
      '> div': {
        width: '100%',
      },
    },
    '& .MuiDataGrid-virtualScrollerContent': {
      maxHeight: '520px',
      width: '100% !important',
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      'white-space': 'break-spaces',
      'word-break': 'break-word',
    },
    '& .liquidityProviderHeader': {},
    '& .liquidityProviderCell': {},
    '& .BDRBoostHeader': {
      textAlign: 'center',
    },
    '& .timeRemainingHeader': {
      textAlign: 'center',
    },
    '& .LPRBoostHeader': {
      textAlign: 'center',
    },
    '& .earnedRewardHeader': {
      textAlign: 'right',
    },
    '& .earnedRewardCell': {},
    '& .MuiDataGrid-row--lastVisible .MuiDataGrid-cell': {
      borderColor: '#222A34 !important',
    },
    '& .MuiDataGrid-row': {
      width: '100%',
    },
    '& .MuiDataGrid-cell.largeWidth': {
      width: largeWidth,
      maxWidth: largeWidth,
      minWidth: largeWidth,
    },
    '& .MuiDataGrid-columnHeader.largeWidth': {
      width: largeWidth,
      maxWidth: largeWidth,
      minWidth: largeWidth,
    },
    '& .MuiDataGrid-cell.smallWidth': {
      width: smallWidth,
      maxWidth: smallWidth,
      minWidth: smallWidth,
    },
    '& .MuiDataGrid-columnHeader.smallWidth': {
      width: smallWidth,
      maxWidth: smallWidth,
      minWidth: smallWidth,
    },
    '& .MuiDataGrid-cell.mediumWidth': {
      width: mediumWidth,
      maxWidth: mediumWidth,
      minWidth: mediumWidth,
    },
    '& .MuiDataGrid-columnHeader.mediumWidth': {
      width: mediumWidth,
      maxWidth: mediumWidth,
      minWidth: mediumWidth,
    },
  };

  const tableSpacing = useMediaValue('24px', '32px', '40px');

  const totalReward = filteredData.reduce(
    (accumulator, item) =>
      accumulator +
      ethers.utils
        .parseUnits(item.distributedMnt?.toString() || '0')
        .toBigInt(),
    BigInt(0)
  );

  const Footer = useCallback(
    () => (
      <div className={classes.tableFooterContainer}>
        <div>
          <TooltipWrapper
            title={t('dashboard.BDRCommissions.totalRewardTooltip')}
          >
            <Typography
              variant='copyLBold'
              text={t('dashboard.BDRCommissions.totalReward')}
            />
          </TooltipWrapper>
        </div>
        <div className={classes.totalReward}>
          <MinterestSmallIcon width={24} height={24} className='icon' />

          <Typography
            variant='copyLBold'
            text={`${ethers.utils.formatUnits(totalReward, MNT_DECIMALS)} MNT`}
          />
        </div>
      </div>
    ),
    [totalReward, filteredData]
  );

  if (!filteredData.length) return null;

  return (
    <Card
      sx={{
        marginTop: tableSpacing,
        width: '100%',
        position: 'relative',
        label: {
          marginRight: 0,
        },
      }}
    >
      <Typography
        style={{
          paddingBottom: '24px',
          textTransform: 'uppercase',
        }}
        text={t('dashboard.BDRCommissions.header')}
        variant='cardHeader'
      />
      <EnchancedTable
        rows={filteredData}
        columns={columns}
        sx={customStyles}
        headerHeight={headerHeight}
        getRowId={(row) => row.liquidityProvider}
        components={{ Footer }}
        scrollbarSize={200}
        hideFooter={false}
      />
    </Card>
  );
};

export default BDRComissions;
