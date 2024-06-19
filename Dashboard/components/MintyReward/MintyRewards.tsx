import React, { useMemo } from 'react';

import {
  Card,
  useMediaValue,
  Typography,
  unit,
  usd,
  TooltipWrapper,
  SmallButton,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { utils, constants } from 'ethers';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import classes from './MintyRewards.module.scss';
import { TaikoRewards } from './TaikoRewards/TaikoRewards';
import { MinterestSmallBlackIcon } from 'assets/svg';
import config from 'config';
import {
  selectUserAddress,
  useGetOraclePricesQuery,
  useGetMntWithdrawDataQuery,
  useGetMntStakeDataQuery,
  usePausedOperationDetector,
  createStakeMntTransaction,
  createWithdrawMntTransaction,
} from 'features';
import { useAppSelector } from 'features/store';
import { formatNumberWithMantissa } from 'utils';
import { MNT_DECIMALS } from 'utils/constants';

type Props = {
  active: boolean;
};

const MintyRewards: React.FC<Props> = ({ active }) => {
  const { t } = useTranslation();

  const accountAddress = useAppSelector(selectUserAddress);

  const marginTop = useMediaValue('24px', '32px', '40px');

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  const { data: mntWitdrawableData } =
    useGetMntWithdrawDataQuery(accountAddress);
  const { data: mntStakeBalance } = useGetMntStakeDataQuery(accountAddress);

  const { data: prices, isFetching: isOraclePriceFetching } =
    useGetOraclePricesQuery();

  // FIXME: unskip after listing
  // const minWidthForPriceSkeleton = useMediaValue('75px', '131px', '131px');
  const { isBuybackOperationPaused } = usePausedOperationDetector();

  // // // // // // // Minty data section // // // // // //

  const rawMintyPrice = prices?.mntOraclePriceUSD ?? 0;

  const rawMintyWalletBalance = Number(
    utils.formatUnits(
      mntStakeBalance?.userMntUnderlyingBalance ?? constants.Zero,
      MNT_DECIMALS
    )
  );

  const rawMintyStakedBuyback = Number(
    utils.formatUnits(
      mntWitdrawableData?.userBuyBackStaked ?? constants.Zero,
      MNT_DECIMALS
    )
  );

  const rawMintyVestingReleasable = Number(
    utils.formatUnits(
      mntWitdrawableData?.userVestingRelesable ?? constants.Zero,
      MNT_DECIMALS
    )
  );
  const rawMintyClaimableAmount = Number(
    utils.formatUnits(
      mntWitdrawableData?.mntTotalBalance ?? constants.Zero,
      MNT_DECIMALS
    )
  );

  // FIXME: unskip after listing
  // const mintyPrice = React.useMemo(() => {
  //   if (!prices) {
  //     return 'N/A';
  //   }
  //   return usd(rawMintyPrice);
  // }, [prices]);

  const mintyWalletBalance = useMemo(() => {
    return unit(formatNumberWithMantissa(rawMintyWalletBalance));
  }, [rawMintyWalletBalance]);

  const mintyClaimableBalance = useMemo(() => {
    const totalClaimableBalance =
      rawMintyStakedBuyback +
      rawMintyVestingReleasable +
      rawMintyClaimableAmount;
    return unit(formatNumberWithMantissa(totalClaimableBalance));
  }, [
    rawMintyStakedBuyback,
    rawMintyVestingReleasable,
    rawMintyClaimableAmount,
  ]);

  const mintyWalletBalanceUSD = useMemo(() => {
    if (!rawMintyWalletBalance) {
      return 'N/A';
    }
    return usd(+rawMintyPrice * rawMintyWalletBalance);
  }, [rawMintyWalletBalance]);

  const mintyClaimableBalanceUSD = useMemo(() => {
    if (!rawMintyClaimableAmount) {
      return 'N/A';
    }
    return usd(+rawMintyPrice * rawMintyClaimableAmount);
  }, [rawMintyClaimableAmount]);

  const mintyStakeDisabled = useMemo(() => {
    return !config.FEATURE.STAKE || isBuybackOperationPaused('stake');
  }, [isBuybackOperationPaused]);

  const onStake = () => {
    dispatch(createStakeMntTransaction());
  };

  const onWithdrawMinty = () => {
    dispatch(createWithdrawMntTransaction());
  };

  // TODO: move out from component
  React.useEffect(() => {
    if (Object.keys(queryParams).includes('stake')) {
      onStake();
    }
  }, [queryParams]);

  if (!accountAddress) {
    return null;
  }

  return (
    <Card sx={{ marginTop, width: '100%' }}>
      <Typography
        text={t('dashboard.mntRewards.title')}
        variant='cardHeader'
        style={{ textTransform: 'uppercase' }}
      />
      <Typography
        text={t('dashboard.mntRewards.placeholderText')}
        variant='copyS'
        style={{ color: '#595D6C' }}
      />
      <div className={classes.wrapper}>
        {/*MINTY START*/}
        <div className={classes.cardWrapper}>
          <div className={classNames(classes.card, classes.top)}>
            <div className={classes.titleWrapper}>
              <MinterestSmallBlackIcon width={34} height={34} />
              <div className={classes.titleAndDescription}>
                <Typography
                  text={t('dashboard.mntRewards.minty.title')}
                  variant='copyLBold'
                  style={{ color: '#222A34' }}
                />
                <Typography
                  text={t('dashboard.mntRewards.minty.description')}
                  variant='copyS'
                  style={{ color: '#595D6C' }}
                />
              </div>
            </div>
            <div className={classes.priceWrapper}>
              {/*FIXME: unskip after listing */}
              {/*{isOraclePriceFetching ? (*/}
              {/*  <SkeletonRect width={minWidthForPriceSkeleton} height={24} />*/}
              {/*) : (*/}
              {/*  <Typography*/}
              {/*    variant='copyLBold'*/}
              {/*    text={mintyPrice}*/}
              {/*    style={{ color: '#222A34' }}*/}
              {/*  />*/}
              {/*)}*/}
              {/*<Typography*/}
              {/*  text={t('dashboard.mntRewards.price')}*/}
              {/*  variant='copyS'*/}
              {/*  style={{ color: '#595D6C' }}*/}
              {/*/>*/}
            </div>
          </div>
          <div className={classNames(classes.card, classes.bottom)}>
            <div className={classes.bottomCardContent}>
              <Typography
                text={t('dashboard.mntRewards.minty.walletBalance')}
                variant='copyMBold'
                style={{ color: '#595D6C' }}
              />
              <div className={classes.bottomPriceWrapper}>
                <Typography
                  text={mintyWalletBalance}
                  variant='copyLBold'
                  style={{ color: '#222A34' }}
                />
                <Typography
                  text={mintyWalletBalanceUSD}
                  variant='copyS'
                  style={{ color: '#595D6C' }}
                />
              </div>
              <TooltipWrapper
                title={t('dashboard.mntRewards.featureUnavailableTooltip')}
                disableTouchListener={!mintyStakeDisabled}
                disableFocusListener={!mintyStakeDisabled}
                disableHoverListener={!mintyStakeDisabled}
                withoutIcon
              >
                <SmallButton
                  color='primary'
                  disabled={mintyStakeDisabled}
                  onClick={onStake}
                  style={{ maxWidth: '81px' }}
                >
                  {t('dashboard.mntRewards.stake.buttonTitle')}
                </SmallButton>
              </TooltipWrapper>
            </div>

            <div className={classes.divider} />

            <div className={classes.bottomCardContent}>
              <Typography
                text={t('dashboard.mntRewards.minty.claimable')}
                variant='copyMBold'
                style={{ color: '#595D6C' }}
              />
              <div
                className={classNames(classes.bottomPriceWrapper, {
                  [classes.warning]: active,
                })}
              >
                <Typography
                  text={mintyClaimableBalance}
                  variant='copyLBold'
                  style={{ color: '#222A34' }}
                />
                <Typography
                  text={mintyClaimableBalanceUSD}
                  variant='copyS'
                  style={{ color: '#595D6C' }}
                />
              </div>
              <TooltipWrapper
                title={t('dashboard.mntRewards.featureUnavailableTooltip')}
                disableTouchListener={!mintyStakeDisabled}
                disableFocusListener={!mintyStakeDisabled}
                disableHoverListener={!mintyStakeDisabled}
                withoutIcon
              >
                <SmallButton
                  color='primary'
                  disabled={mintyStakeDisabled}
                  onClick={onWithdrawMinty}
                  style={{ maxWidth: '81px' }}
                >
                  {t('dashboard.mntRewards.withdraw.buttonTitle')}
                </SmallButton>
              </TooltipWrapper>
            </div>
          </div>
        </div>
        {/*MINTY END*/}
        {/*TAIKO REWARDS*/}
        {false && (
          <TaikoRewards
            prices={prices}
            isOraclePriceFetching={isOraclePriceFetching}
          />
        )}
        {/*TAIKO END*/}
      </div>
    </Card>
  );
};

export default MintyRewards;
