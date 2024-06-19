import React, { useMemo } from 'react';

import {
  Typography,
  SmallButton,
  unit,
  usd,
  useMediaValue,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { utils } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { WETHIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import {
  createWithdrawTaikoTransaction,
  createMarketTransaction,
  useGetTaikoStakeDataQuery,
  useGetTaikoWithdrawDataQuery,
  selectUserAddress,
} from 'features';
import { useAppSelector } from 'features/store';
import { OraclePricesResponse } from 'types';
import { formatNumberWithMantissa } from 'utils';
import { MANTLE_DECIMALS } from 'utils/constants';

import classes from '../MintyRewards.module.scss';

interface Props {
  prices: OraclePricesResponse;
  isOraclePriceFetching: boolean;
}

export const TaikoRewards: React.FC<Props> = ({
  prices,
  isOraclePriceFetching,
}) => {
  const history = useHistory();
  const accountAddress = useAppSelector(selectUserAddress);
  const minWidthForPriceSkeleton = useMediaValue('75px', '131px', '131px');

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onWithdrawTaiko = () => {
    dispatch(createWithdrawTaikoTransaction());
  };
  const { data: taikoWitdrawableData } =
    useGetTaikoWithdrawDataQuery(accountAddress);
  const { data: taikoStakeBalance } = useGetTaikoStakeDataQuery(accountAddress);

  const onSupplyTaiko = () => {
    history.push('market/mwmnt');
    dispatch(createMarketTransaction({ type: 'supply', symbol: 'mwmnt' }));
  };

  const rawTaikoWalletBalance = Number(
    utils.formatUnits(
      taikoStakeBalance?.userTaikoUnderlyingBalance ?? '0',
      MANTLE_DECIMALS
    )
  );
  const rawTaikoRewardsClaimableAmount = Number(
    utils.formatUnits(
      taikoWitdrawableData?.userWithdrawableBalance ?? '0',
      MANTLE_DECIMALS
    )
  );
  const taikoTokenPriceSTR = prices?.markets.find(
    (m) => m.symbol == 'mwmnt'
  )?.oraclePriceUSD;

  const taikoPrice = React.useMemo(() => {
    if (!taikoTokenPriceSTR) {
      return 'N/A';
    }
    return usd(taikoTokenPriceSTR);
  }, [taikoTokenPriceSTR]);

  const taikoWalletBalance = useMemo(() => {
    return unit(formatNumberWithMantissa(rawTaikoWalletBalance));
  }, [rawTaikoWalletBalance]);

  const taikoRewardsClaimableAmount = useMemo(() => {
    return unit(formatNumberWithMantissa(rawTaikoRewardsClaimableAmount));
  }, [rawTaikoRewardsClaimableAmount]);

  const taikoWalletBalanceUSD = useMemo(() => {
    if (!taikoTokenPriceSTR) {
      return 'N/A';
    }
    return usd(+taikoTokenPriceSTR * rawTaikoWalletBalance, {
      compact: true,
    });
  }, [rawTaikoWalletBalance]);

  const taikoRewardsClaimableAmountUSD = useMemo(() => {
    if (!rawTaikoRewardsClaimableAmount || !taikoTokenPriceSTR) {
      return 'N/A';
    }
    return usd(+taikoTokenPriceSTR * rawTaikoRewardsClaimableAmount, {
      compact: true,
    });
  }, [rawTaikoRewardsClaimableAmount]);

  // // // // // // // // // // // // // // // // // // // // //

  return (
    <div className={classes.cardWrapper}>
      <div className={classNames(classes.card, classes.top)}>
        <div className={classes.titleWrapper}>
          <WETHIcon width={34} height={34} />
          <div className={classes.titleAndDescription}>
            <Typography
              text={t('dashboard.mntRewards.taiko.title')}
              variant='copyLBold'
              style={{ color: '#222A34' }}
            />
            <Typography
              text={t('dashboard.mntRewards.taiko.description')}
              variant='copyS'
              style={{ color: '#595D6C' }}
            />
          </div>
        </div>
        <div className={classes.priceWrapper}>
          {isOraclePriceFetching ? (
            <SkeletonRect width={minWidthForPriceSkeleton} height={24} />
          ) : (
            <Typography
              variant='copyLBold'
              text={taikoPrice}
              style={{ color: '#222A34' }}
            />
          )}
          <Typography
            text={t('dashboard.mntRewards.price')}
            variant='copyS'
            style={{ color: '#595D6C' }}
          />
        </div>
      </div>
      <div className={classNames(classes.card, classes.bottom)}>
        <div className={classes.bottomCardContent}>
          <Typography
            text={t('dashboard.mntRewards.taiko.walletBalance')}
            variant='copyMBold'
            style={{ color: '#595D6C' }}
          />
          <div className={classes.bottomPriceWrapper}>
            <Typography
              text={taikoWalletBalance}
              variant='copyLBold'
              style={{ color: '#222A34' }}
            />
            <Typography
              text={taikoWalletBalanceUSD}
              variant='copyS'
              style={{ color: '#595D6C' }}
            />
          </div>
          <SmallButton
            color='primary'
            disabled={false}
            onClick={onSupplyTaiko}
            style={{ maxWidth: '81px' }}
          >
            {t('dashboard.mntRewards.taiko.stake.buttonTitle')}
          </SmallButton>
        </div>

        <div className={classes.divider} />

        <div className={classes.bottomCardContent}>
          <Typography
            text={t('dashboard.mntRewards.taiko.claimable')}
            variant='copyMBold'
            style={{ color: '#595D6C' }}
          />
          <div
            className={classNames(classes.bottomPriceWrapper, {
              [classes.warning]: false,
            })}
          >
            <Typography
              text={taikoRewardsClaimableAmount}
              variant='copyLBold'
              style={{ color: '#222A34' }}
            />
            <Typography
              text={taikoRewardsClaimableAmountUSD}
              variant='copyS'
              style={{ color: '#595D6C' }}
            />
          </div>
          <SmallButton
            color='primary'
            onClick={onWithdrawTaiko}
            style={{ maxWidth: '81px' }}
          >
            {t('dashboard.mntRewards.withdraw.buttonTitle')}
          </SmallButton>
        </div>
      </div>
    </div>
  );
};
