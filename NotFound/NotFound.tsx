import React, { useCallback } from 'react';

import { ContainedButton, Typography } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import classes from './NotFound.module.scss';
import { HelmetMeta } from 'common';
import { ROUTES } from 'utils/constants';

const NotFound: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const handleClick = useCallback(() => history.push(ROUTES.main), []);

  return (
    <>
      <HelmetMeta
        title='404 Page | Minterest'
        description='Minterest protocol 404 page'
        canonical='https://minterest.com/'
      />
      <div className={classes.container}>
        <Typography
          text={t('notFound.title')}
          variant='h1'
          className={classes.title}
        />
        <Typography
          text={t('notFound.description')}
          className={classes.description}
          variant='copyL'
        />
        <ContainedButton color='primary' size='large' onClick={handleClick}>
          {t('notFound.button')}
        </ContainedButton>
      </div>
    </>
  );
};

export default NotFound;
