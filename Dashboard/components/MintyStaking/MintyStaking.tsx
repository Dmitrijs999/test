import React from 'react';

import { Card, useMediaValue, Typography } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import Governance from './Governance';
import LoyaltyBoost from './LoyaltyBoost';
import classes from './MintyStaking.module.scss';
import { selectUserAddress, useGetUserDataQuery } from 'features';
import { useAppSelector } from 'features/store';

const MintyStaking: React.FC = () => {
  const { t } = useTranslation();
  const marginTop = useMediaValue('24px', '32px', '40px');

  const accountAddress = useAppSelector(selectUserAddress);

  const { data: userData } = useGetUserDataQuery({ accountAddress });

  return (
    <Card sx={{ marginTop, width: '100%' }}>
      <Typography
        text={t('dashboard.staking.title')}
        variant='cardHeader'
        style={{ textTransform: 'uppercase' }}
      />
      <Typography
        text={t('dashboard.mntRewards.placeholderText')}
        variant='copyS'
        style={{ color: '#595D6C' }}
      />
      <div className={classes.wrapper}>
        <Governance data={userData} />
        <LoyaltyBoost data={userData} />
      </div>
    </Card>
  );
};

export default MintyStaking;
