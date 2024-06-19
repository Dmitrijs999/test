import React, { useMemo, FC } from 'react';

import { Typography, Col, Row, unit } from '@minterest-finance/ui-kit';
import { utils } from 'ethers';
import { useTranslation } from 'react-i18next';

import { MinterestSmallBlackIcon, LockedLogoIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import { getTokenSymbol } from 'features';
import { UserData } from 'types';
import { MNT_DECIMALS } from 'utils/constants';

import { Subtitle } from '../Commons';

export const LockedBalance: FC<{
  data: UserData;
  isFetching: boolean;
}> = ({ data, isFetching }) => {
  const { t } = useTranslation();

  const userLockedAmount = useMemo(() => {
    if (!data || !data.vesting) {
      return 'N/A';
    }
    return unit(
      utils.formatUnits(
        utils
          .parseUnits(data.vesting.totalAmount)
          .sub(utils.parseUnits(data.vesting.vested)),
        MNT_DECIMALS
      ),
      { compact: true }
    );
  }, [data]);

  return (
    <Row
      sx={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Col>
        <Subtitle
          color='#595D6C'
          text={
            Number(data?.vesting?.vested) &&
            Number(data?.vesting.vested) !== Number(data?.vesting.totalAmount)
              ? t('dashboard.mntVesting.unvestedBalanceTitle')
              : t('dashboard.mntVesting.lockedBalanceTitle')
          }
        />
        {isFetching ? (
          <SkeletonRect width={133} height={26} />
        ) : (
          <Row style={{ alignItems: 'center' }}>
            <MinterestSmallBlackIcon width={24} height={24} />
            <Typography
              style={{ paddingLeft: '8px', color: '#222A34' }}
              variant='copyLBold'
              text={`${userLockedAmount} ${getTokenSymbol('minty')}`}
            />
          </Row>
        )}
      </Col>
      <LockedLogoIcon width={32} height={32} />
    </Row>
  );
};
