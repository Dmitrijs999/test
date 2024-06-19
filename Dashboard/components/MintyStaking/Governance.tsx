import React from 'react';

import {
  Typography,
  SmallButton,
  ToggleButton,
  pct,
  TooltipWrapper,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import classes from './Governance.module.scss';
import {
  createAutostakingMntTransaction,
  createStakeMntTransaction,
  usePausedOperationDetector,
} from 'features';

import { UserData } from '../../../../types';

type Props = {
  data?: UserData;
};

const Governance: React.FC<Props> = ({ data: userData }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const onStake = () => {
    dispatch(createStakeMntTransaction());
  };

  const rewardsApy = React.useMemo(() => {
    if (!userData?.mntAPY) {
      return 'N/A';
    }
    return pct(userData.mntAPY);
  }, [userData]);

  const isParticipate = React.useMemo(() => {
    if (!userData?.participating) {
      return false;
    }
    return userData.participating;
  }, [userData]);

  const { isBuybackOperationPaused } = usePausedOperationDetector();

  const isLeavePaused = React.useMemo(() => {
    if (!isBuybackOperationPaused) {
      return true;
    }
    return isBuybackOperationPaused('leave');
  }, [isBuybackOperationPaused]);

  const isStakePaused = React.useMemo(() => {
    if (!isBuybackOperationPaused) {
      return true;
    }
    return isBuybackOperationPaused('stake');
  }, [isBuybackOperationPaused]);

  const isParticipateOrLeaveToggleEnabled =
    !isParticipate || (isParticipate && !isLeavePaused);

  const onParticipate = () => {
    dispatch(
      createAutostakingMntTransaction({
        type: isParticipate ? 'turnOff' : 'turnOn',
      })
    );
  };

  // FIXME MANTLE: uncomment when we know how to calculate this factor
  // const loyaltyFactor = React.useMemo(() => {
  //   if (!userData?.userLoyaltyFactor) {
  //     return 'N/A';
  //   }
  //   return pct(userData.userLoyaltyFactor);
  // }, [userData]);

  return (
    <div className={classes.cardWrapper}>
      <div className={classNames(classes.card, classes.top)}>
        <div className={classes.titleWrapper}>
          <Typography
            text={t('dashboard.staking.governanceParticipation.title')}
            variant='copyLBold'
            style={{ color: '#222A34' }}
          />
          <Typography
            text={t('dashboard.staking.governanceParticipation.description')}
            variant='copyS'
            style={{ color: '#595D6C' }}
          />
        </div>
        <TooltipWrapper
          title={t('dashboard.mntRewards.featureUnavailableTooltip')}
          disableTouchListener={!isStakePaused}
          disableFocusListener={!isStakePaused}
          disableHoverListener={!isStakePaused}
          withoutIcon
        >
          <SmallButton
            disabled={isStakePaused}
            color='primary'
            onClick={onStake}
          >
            {t('dashboard.staking.governanceParticipation.button')}
          </SmallButton>
        </TooltipWrapper>
      </div>
      <div className={classNames(classes.card, classes.bottom)}>
        <div className={classes.bottomCardContent}>
          <Typography
            text={t('dashboard.staking.governanceParticipation.stakingAPY')}
            variant='copyMBold'
            style={{ color: '#595D6C' }}
          />
          <Typography
            text={rewardsApy}
            variant='copyLBold'
            style={{ color: '#222A34' }}
          />
          {/*FIXME MANTLE: uncomment when we know how to calculate this factor*/}
          {/*<div className={classes.alert}>*/}
          {/*  <Typography*/}
          {/*    text={`+${loyaltyFactor} ${t('dashboard.staking.loyaltyBoostText')}`}*/}
          {/*    variant='copySBold'*/}
          {/*    style={{ color: '#358927' }}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>

        <div className={classes.divider} />

        <div className={classes.bottomCardContent}>
          <Typography
            text={t('dashboard.staking.governanceParticipation.status')}
            variant='copyMBold'
            style={{ color: '#595D6C' }}
          />
          <ToggleButton
            variant='default'
            checked={isParticipate}
            onChange={onParticipate}
            disabled={!isParticipateOrLeaveToggleEnabled}
          />
        </div>
      </div>
    </div>
  );
};

export default Governance;
