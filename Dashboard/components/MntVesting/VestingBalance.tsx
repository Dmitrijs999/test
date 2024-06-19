import React, { useMemo, FC } from 'react';

import {
  Typography,
  Col,
  Row,
  useMediaValue,
  unit,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { MinterestSmallBlackIcon, UnlockedLogoIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import { getTokenSymbol } from 'features';
import { UserData } from 'types';

import { Subtitle } from '../Commons';

export const VestingBalance: FC<{ data: UserData; isFetching: boolean }> = ({
  data,
  isFetching,
}) => {
  const { t } = useTranslation();

  const unlockedIconDisplay = useMediaValue('block', 'none', 'block');
  const rowFlex = useMediaValue('1', 'initial', '1');

  const userVestedAmount = useMemo(() => {
    if (!data || !data.vesting) {
      return 'N/A';
    }
    return unit(data.vesting.vested, { compact: true });
  }, [data]);

  return (
    <Row
      sx={{
        flex: data?.vesting?.dailyVesting ? rowFlex : 1,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Col>
        <Subtitle
          color='#595D6C'
          text={t('dashboard.mntVesting.vestingBalanceTitle')}
        />
        {isFetching ? (
          <SkeletonRect width={133} height={26} />
        ) : (
          <Row style={{ alignItems: 'center' }}>
            <MinterestSmallBlackIcon width={24} height={24} />
            <Typography
              style={{ paddingLeft: '8px', color: '#222A34' }}
              variant='copyLBold'
              text={`${userVestedAmount} ${getTokenSymbol('minty')}`}
            />
          </Row>
        )}
      </Col>

      <UnlockedLogoIcon
        style={{
          display: data?.vesting?.dailyVesting ? unlockedIconDisplay : 'block',
        }}
        width={32}
        height={32}
      />
    </Row>
  );
};
