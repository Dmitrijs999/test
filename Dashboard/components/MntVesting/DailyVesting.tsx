import React, { FC } from 'react';

import { Typography, Col, Row, useMediaValue } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { UnlockedLogoIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import { getTokenSymbol } from 'features';

import { Subtitle } from '../Commons';

export const DailyVesting: FC<{ isLoading: boolean; vestedToday: number }> = ({
  isLoading,
  vestedToday,
}) => {
  const { t } = useTranslation();

  const unlockedIconDisplay = useMediaValue('none', 'block', 'none');

  return (
    <Row
      sx={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Col>
        <Subtitle
          color='#595D6C'
          text={t('dashboard.withdraw.balance.vestedToday')}
        />
        {isLoading ? (
          <SkeletonRect width={133} height={26} />
        ) : (
          <Row style={{ alignItems: 'center' }}>
            <Typography
              style={{ color: 'rgba(93, 177, 79, 1)' }}
              variant='copyLBold'
              text={`+${vestedToday.toFixed(2)} ${getTokenSymbol('minty')}`}
            />
          </Row>
        )}
      </Col>

      <UnlockedLogoIcon
        style={{ display: unlockedIconDisplay }}
        width={32}
        height={32}
      />
    </Row>
  );
};
