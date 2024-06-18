import React, { useEffect } from 'react';

import { ContainedButton, Typography } from '@minterest-finance/ui-kit';
import MainBackground from 'layouts/MainLayout/components/MainBackground/MainBackground';
import { useTranslation } from 'react-i18next';

import classes from './ErrorPage.module.scss';
import { LINKS } from 'utils/constants';

export const ErrorPage: React.FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation();
  const { app } = LINKS.minterest;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const prodErrorMessage = () => {
    return (
      <>
        <Typography
          text={t('errorPage.messages.topMessage')}
          className={classes.title}
          variant='h1'
        />
        <Typography
          text={t('errorPage.messages.bottomMessage')}
          className={classes.message}
          variant='copyL'
        />
        <a href={app} rel='noopener noreferrer'>
          <ContainedButton color='primary' size='large'>
            {t('errorPage.returnToAppButton')}
          </ContainedButton>
        </a>
      </>
    );
  };

  const errorMessage =
    import.meta.env.VITE_ENVIRONMENT === 'prod' ? (
      prodErrorMessage()
    ) : (
      <Typography
        text={error.message}
        className={classes.message}
        variant='copyL'
      />
    );

  return (
    <MainBackground>
      <div className={classes.container}>{errorMessage}</div>
    </MainBackground>
  );
};
