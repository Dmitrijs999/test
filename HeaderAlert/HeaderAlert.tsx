import React from 'react';

import { HeaderAlertComponent, Typography } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { LINKS } from 'utils/constants';

const HeaderAlert: React.FC = () => {
  const { t } = useTranslation();
  const moreInfoHere = (): React.ReactElement => (
    <a
      href={LINKS.alert.tectonicUpgrade}
      style={{ textDecoration: 'underline', color: '#FCFDFF' }}
      target='_blank'
      rel='noopener noreferrer'
    >
      {t(`header.alert.linkText`)}
    </a>
  );

  return (
    <HeaderAlertComponent
      DescriptionHTML={
        <Typography>
          {t(`header.alert.text`)}
          {moreInfoHere()}
        </Typography>
      }
    />
  );
};

export default HeaderAlert;
