import React from 'react';

import {
  Typography,
  ContainedButton,
  TooltipWrapper,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import classes from './MarketConfirmationModal.module.scss';
import { HelpIconCircle, LinkIcon, LockError, LockSuccess } from 'assets/svg';
import config from 'config';
import { composeExplorerLink, createAutostakingMntTransaction } from 'features';

type MarketConfirmationState = 'success' | 'error';

const MarketConfirmationModal = React.memo<{
  state: MarketConfirmationState;
  hash?: string;
  onClose?: () => void;
  description?: string;
  isActivate: boolean;
}>(function MarketConfirmationModalComponent({
  state = 'success',
  onClose,
  description,
  hash = '',
  isActivate,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onAutostaking = () => {
    onClose();
    dispatch(
      createAutostakingMntTransaction({
        type: 'turnOn',
      })
    );
  };

  return (
    <div className={classes.marketConfirmationWrapper}>
      {state === 'error' && <LockError className={classes.icon} />}
      {state === 'success' && <LockSuccess className={classes.icon} />}

      <Typography
        variant='copyLBold'
        className={classes.responseDescription}
        text={description}
      />

      {hash && (
        <a
          className={classNames(classes.link)}
          href={composeExplorerLink(hash)}
          target='_blank'
          rel='noreferrer'
        >
          <Typography
            variant='copyMBold'
            className={classes.linkText}
            text={t('marketTransactionModal.viewOnEtherscan')}
          />
          <LinkIcon className={classes.linkIcon} />
        </a>
      )}

      {!isActivate && config.FEATURE.GOVERNANCE_PARTICIPATION && (
        <div className={classes.actionWrapper}>
          <div className={classes.actionText}>
            <Typography
              text={t('marketTransactionModal.turnOnGovernance')}
              style={{ color: 'white' }}
              variant='copyM'
            />
            <div className={classes.iconWrapper}>
              <TooltipWrapper
                title={t('tooltips.turnOnGovernanceRewards')}
                withoutIcon
              >
                <HelpIconCircle />
              </TooltipWrapper>
            </div>
          </div>

          <Link to='/dashboard?governance=true'>
            <ContainedButton
              color='info'
              size='medium'
              title={t('active')}
              sx={{ width: 160, height: 36 }}
              onClick={onAutostaking}
            >
              {t('marketTransactionModal.activate')}
            </ContainedButton>
          </Link>
        </div>
      )}

      <ContainedButton
        fullWidth
        onClick={onClose}
        size='large'
        color='secondary'
        sx={{ width: '100% !important', zIndex: 11, marginTop: '24px' }}
      >
        {t('common.modal.close')}
      </ContainedButton>
    </div>
  );
});

export default MarketConfirmationModal;
