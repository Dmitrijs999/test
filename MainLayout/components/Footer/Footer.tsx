import React from 'react';

import { Typography, useMediaBrakepoint } from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import classes from './Footer.module.scss';
import {
  DiscordIcon,
  HackenIcon,
  PeckShield,
  TOBIcon,
  TelegramIcon,
  XIcon,
  ZokyoIcon,
} from 'assets/svg';
import { IconLink } from 'common';
import { LINKS } from 'utils/constants';
import { trackerControls } from 'utils/trackers';

import Logo from '../Logo/Logo';

export const Footer = () => {
  const { isTablet, isMobile } = useMediaBrakepoint();

  const [t] = useTranslation();
  return (
    <>
      <div
        className={classNames({
          [classes.footerHeightMobile]: isMobile,
          [classes.footerHeightTablet]: isTablet,
          [classes.footerHeightDesctop]: !isMobile && !isTablet,
        })}
      ></div>
      <div
        className={classNames(classes.footer, classes.footerHeight, {
          [classes.footerMobile]: isMobile,
          [classes.footerTablet]: isTablet,
          [classes.footerDesktop]: !isMobile && !isTablet,
        })}
      >
        <div
          className={classNames(classes.logoBlock, {
            [classes.logoBlockMobile]: isMobile,
          })}
        >
          <Logo className={classes.logo} />
          {!isMobile && (
            <div className={classes.socialBlock}>
              <IconLink
                to={LINKS.minterest.social.telegram}
                IconComponent={TelegramIcon}
              />
              <IconLink
                to={LINKS.minterest.social.discord}
                IconComponent={DiscordIcon}
              />
              <IconLink
                to={LINKS.minterest.social.twitter}
                IconComponent={XIcon}
              />
            </div>
          )}
        </div>

        {isMobile && <div className={classes.separator}></div>}

        <div
          className={classNames(classes.auditionBlock, {
            [classes.auditionBlockMobile]: isMobile,
          })}
        >
          <Typography variant='copyL' className={classes.auditionText}>
            {t('auditBlock.footer')}
            {': '}
          </Typography>
          <div className={classes.auditIconBlock}>
            <IconLink
              to={LINKS.minterest.audits.zokyo}
              onLinkClick={() => trackerControls.trackAuditReportClick()}
              IconComponent={ZokyoIcon}
            />
            <IconLink
              to={LINKS.minterest.audits.hacken}
              IconComponent={HackenIcon}
              onLinkClick={() => trackerControls.trackAuditReportClick()}
            />
            <IconLink
              to={LINKS.minterest.audits.peckShield}
              IconComponent={PeckShield}
              onLinkClick={() => trackerControls.trackAuditReportClick()}
            />
            <IconLink
              to={LINKS.minterest.audits.trailOfBits}
              IconComponent={TOBIcon}
              onLinkClick={() => trackerControls.trackAuditReportClick()}
            />
          </div>
        </div>
      </div>
    </>
  );
};
