import React from 'react';

import { OverlayLoader } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

const CommonLoader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <OverlayLoader text={t('common.loading')} subtext={t('common.wait')} />
  );
};

export default CommonLoader;
