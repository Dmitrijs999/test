import React, { useMemo, FC } from 'react';

import { Typography, Col, Row } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { ClockIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import { UserData } from 'types';

import { Subtitle } from '../Commons';

export const VestingPeriod: FC<{
  data: UserData;
  isFetching: boolean;
}> = ({ data, isFetching }) => {
  const { t } = useTranslation();

  const vestingPeriod = useMemo(() => {
    if (!data || !data.vesting) {
      return 'N/A';
    }

    return new Date(data.vesting.end * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [data]);

  return (
    <Row
      sx={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Col>
        <Subtitle
          color='#595D6C'
          text={t('dashboard.mntVesting.vestingPeriodTitle')}
        />
        {isFetching ? (
          <SkeletonRect width={133} height={26} />
        ) : (
          <Row style={{ alignItems: 'center' }}>
            <Typography
              style={{ color: '#222A34' }}
              variant='copyLBold'
              text={vestingPeriod}
            />
          </Row>
        )}
      </Col>
      <ClockIcon width={32} height={32} />
    </Row>
  );
};
