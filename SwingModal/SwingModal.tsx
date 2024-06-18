import React, { useEffect, useState } from 'react';

import {
  ContainedButton,
  useMediaBrakepoint,
  useMediaValue,
} from '@minterest-finance/ui-kit';
import { Swap } from '@swing.xyz/ui';
import '@swing.xyz/ui/theme.css';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';

import classes from './SwingModal.module.scss';
import config from 'config';
import { allowBodyScroll, disableBodyScroll } from 'utils';

// Initialize react-modal
Modal.setAppElement('#root');

const SwingModal: React.FC = () => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const { isDesktop } = useMediaBrakepoint();

  useEffect(() => {
    if (isModalOpen && !isDesktop) {
      window.scrollTo(0, 0);
      disableBodyScroll();
    } else {
      allowBodyScroll();
    }
  }, [isModalOpen]);

  const margin = useMediaValue('24px 0 0 0', '0 4px', '0 14px');

  return (
    <>
      <ContainedButton
        color='primary'
        size='medium'
        title={t('header.swing')}
        className={classes.swingButton}
        sx={{ margin }}
        onClick={handleOpen}
      >
        {t('header.swing')}
      </ContainedButton>
      <Modal
        overlayClassName={classes.modalOverlay}
        className={classes.modalContent}
        isOpen={isModalOpen}
      >
        <div className={classes.buttonWrapper}>
          <button className={classes.closeButton} onClick={handleClose}>
            ✖
          </button>
        </div>
        <Swap projectId={config.SWING_PROJECT_ID} />
      </Modal>
    </>
  );
};

export default SwingModal;
