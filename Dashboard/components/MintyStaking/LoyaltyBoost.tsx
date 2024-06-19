import React from 'react';

import { Typography, unit } from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import classes from './LoyaltyBoost.module.scss';

import { UserData } from '../../../../types';

type Props = {
  data?: UserData;
};

const LoyaltyBoost: React.FC<Props> = ({ data: userData }) => {
  const { t } = useTranslation();

  const loyaltyLevel = React.useMemo(() => {
    if (!userData?.userLoyaltyGroup && userData?.userLoyaltyGroup != 0) {
      return 'N/A';
    }
    return unit(userData.userLoyaltyGroup);
  }, [userData]);

  // TODO: implement it when we know how to calculate it
  // const nextBoostLevel = React.useMemo(() => {
  //   return unit(loyaltyLevel + 1);
  // }, [userData]);
  //
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
            text={t('dashboard.staking.loyaltyBoost.title')}
            variant='copyLBold'
            style={{ color: '#222A34' }}
          />
          <Typography
            text={t('dashboard.staking.loyaltyBoost.description')}
            variant='copyS'
            style={{ color: '#595D6C' }}
          />
        </div>
      </div>
      <div className={classNames(classes.card, classes.bottom)}>
        <div className={classes.bottomCardContent}>
          <Typography
            text={t('dashboard.staking.loyaltyBoost.boostLevel')}
            variant='copyMBold'
            style={{ color: '#595D6C' }}
          />
          <Typography
            text={`${loyaltyLevel} of 24`}
            variant='copyLBold'
            style={{ color: '#222A34' }}
          />
          {/*<div className={classes.alert}>*/}
          {/*  <Typography*/}
          {/*    text={`+${loyaltyFactor} ${t(*/}
          {/*      'dashboard.staking.loyaltyBoostText'*/}
          {/*    )}`}*/}
          {/*    variant='copySBold'*/}
          {/*    style={{ color: '#358927' }}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>

        {/*FIXME MANTLE: uncomment when design will be ready */}
        {/*<div className={classes.divider} />*/}

        {/*<div className={classes.bottomCardContent}>*/}
        {/*  <Typography*/}
        {/*    text={t('dashboard.staking.loyaltyBoost.newBoostAvailable')}*/}
        {/*    variant='copyMBold'*/}
        {/*    style={{ color: '#595D6C' }}*/}
        {/*  />*/}
        {/*  <SmallButton*/}
        {/*    color='info'*/}
        {/*    sx={{ width: 'auto !important', padding: '4px 24px!important' }}*/}
        {/*    onClick={onStake}*/}
        {/*  >*/}
        {/*    {t('dashboard.staking.loyaltyBoost.upgradeToLevel')}{' '}*/}
        {/*    {nextBoostLevel}*/}
        {/*  </SmallButton>*/}

        {/*  <div className={classes.alert}>*/}
        {/*    <Typography*/}
        {/*      text={`+${loyaltyFactor} ${t(*/}
        {/*        'dashboard.staking.loyaltyBoostText'*/}
        {/*      )}`}*/}
        {/*      variant='copySBold'*/}
        {/*      style={{ color: '#358927' }}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default LoyaltyBoost;
