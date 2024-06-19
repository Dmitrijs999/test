import React, { FC } from 'react';

import {
  Typography,
  useMediaBrakepoint,
  useMediaValue,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

export const BDRDescription: FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useMediaBrakepoint();
  const paperMarginBottom = isMobile ? '6px' : 0;

  const textMarginBottom = useMediaValue('4px', '0', '0');

  return (
    <div
      style={{
        marginBottom: textMarginBottom,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <Typography
        variant='copyLBold'
        text={t('dashboard.BDRBoost.subTitle')}
        style={{
          marginBottom: paperMarginBottom,
          color: '#222A34',
        }}
      />
      <Typography
        style={{
          color: '#595D6C',
          paddingRight: '8px',
        }}
        variant='copyM'
        text={t('dashboard.BDRBoost.description')}
      />
    </div>
  );
};
