import { useTranslation } from 'react-i18next';

import { AlertPayload } from 'types';
type AlertsType = 'maxed' | 'signing' | 'waiting' | 'success';
type Alerts = Record<AlertsType, AlertPayload>;
export const useTransactionAlerts = (): Alerts => {
  const { t } = useTranslation();
  return {
    maxed: {
      variant: 'info',
      text: t('errors.inputValidation.maxAmount'),
    },
    signing: {
      variant: 'info',
      text: t('common.transaction.sign'),
    },
    waiting: {
      variant: 'info',
      text: t('common.transaction.wait'),
    },
    success: {
      variant: 'success',
      text: t('common.transaction.success'),
    },
  };
};
