import React, { useMemo, FC } from 'react';

import { Typography, Col, Row } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { ClockIcon } from 'assets/svg';
import { getRemainingPeriodLabel } from 'utils/datetime';

type Props = {
  endTimestamp: number;
};

export const BDRTimeRemaining: FC<Props> = ({ endTimestamp }) => {
  const { t } = useTranslation();
  const remainingTime = useMemo(() => {
    return getRemainingPeriodLabel(endTimestamp, t);
  }, [endTimestamp]);

  return (
    <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Col>
        <Typography
          variant='copyMBold'
          text={t('dashboard.BDRBoost.boostTimeRemaining')}
          style={{ paddingBottom: '9px', color: '#595D6C' }}
        />
        <Typography variant='copyLBold' text={remainingTime} />
      </Col>
      <ClockIcon width={32} height={32} />
    </Row>
  );
};
