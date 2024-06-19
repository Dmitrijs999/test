import React, { useMemo } from 'react';

import {
  Card,
  InnerCard,
  Row,
  Col,
  useMediaBrakepoint,
  useMediaValue,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { DailyVesting } from './DailyVesting';
import { LockedBalance } from './LockedBalance';
import { VestingBalance } from './VestingBalance';
import { VestingPeriod } from './VestingPeriod';
import { selectUserAddress, useGetUserDataQuery } from 'features';
import { useAppSelector } from 'features/store';

type Props = { active: boolean };
const MntVesting: React.FC<Props> = ({ active }) => {
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const { isDesktop, isMobile } = useMediaBrakepoint();

  const { data, isFetching } = useGetUserDataQuery(
    { accountAddress },
    { skip: !accountAddress }
  );

  const Content = isDesktop ? Row : Col;

  const marginTop = useMediaValue('24px', '32px', '40px');
  const minHeight = useMediaValue('77px', '98px', 'auto');

  const marginRight = useMediaValue('0', '0', '16px');
  const marginBottom = useMediaValue('16px', '16px', '0');

  const dailyVesting = Number(data?.vesting?.dailyVesting);
  const isVestingStarted = useMemo(() => {
    if (data && data?.vesting) {
      const start = new Date(data.vesting.start * 60 * 1000);
      return start.getTime() <= new Date().getTime();
    }
    return false;
  }, [data]);
  const showDailyVesting = dailyVesting > 0 && isVestingStarted;
  if (!accountAddress || (data && !data.vesting) || !active) {
    return null;
  }

  return (
    <Card
      sx={{ marginTop, width: '100%' }}
      title={t('dashboard.mntVesting.title')}
      subtitle={t('dashboard.mntVesting.description')}
      subtitleProps={{ variant: 'copyS' }}
    >
      <Content>
        <InnerCard
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flex: showDailyVesting ? 2 : 1,
            marginRight,
            marginBottom,
            minHeight,
          }}
        >
          <VestingBalance data={data} isFetching={isFetching} />
          {showDailyVesting && (
            <>
              <div
                style={{
                  background: 'rgba(83, 110, 135, 0.08)',
                  width: isMobile ? 'auto' : '2px',
                  height: isMobile ? '2px' : 'auto',
                  margin: isMobile ? '24px 0' : '0 24px',
                }}
              />
              <DailyVesting isLoading={isFetching} vestedToday={dailyVesting} />
            </>
          )}
        </InnerCard>
        <InnerCard
          sx={{
            flex: 1,
            marginRight,
            marginBottom,
            minHeight,
          }}
        >
          <LockedBalance data={data} isFetching={isFetching} />
        </InnerCard>
        <InnerCard
          sx={{
            flex: 1,
            minHeight,
          }}
        >
          <VestingPeriod data={data} isFetching={isFetching} />
        </InnerCard>
      </Content>
    </Card>
  );
};

export default MntVesting;
