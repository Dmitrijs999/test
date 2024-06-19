import React, { FC } from 'react';

import { Typography, Col, Row } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

type Props = {
  liquidityProviderBoost: string;
};

export const BDRBoostPercent: FC<Props> = ({ liquidityProviderBoost }) => {
  const { t } = useTranslation();

  return (
    <Row style={{ alignItems: 'center', justifyContent: 'left' }}>
      <Col>
        <Typography
          variant='copyMBold'
          text={t('dashboard.BDRBoost.yourBoost')}
          style={{ paddingBottom: '9px', color: '#595D6C' }}
        />
        <Typography
          variant='copyLBold'
          text={`${Number(liquidityProviderBoost)}%`}
          style={{ display: 'flex', justifyContent: 'left' }}
        />
      </Col>
    </Row>
  );
};
