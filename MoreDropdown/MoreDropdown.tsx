import React, { FC, useState, useRef } from 'react';

import {
  Typography,
  ButtonBase,
  Row,
  useMediaBrakepoint,
  useTheme,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { DeviceMenu } from './components/DeviceMenu';
import { MoreMenu } from './components/MoreMenu';
import classes from './MoreDropdown.module.scss';
import {
  ArrowDownNoFillSvg,
  TelegramIcon,
  WarningSquareIcon,
  DiscordIcon,
  HelpIcon,
  GithubIcon,
  HomeIcon,
} from 'assets/svg';
import config from 'config';
import { pickBy, useOnClickOutside } from 'utils';
import { LINKS as EXTERNAL_LINKS, LINKS, ROUTES } from 'utils/constants';

export const MoreDropdown: FC = () => {
  const containerRef = useRef(null);
  const [openMenu, setMenuOpened] = useState(false);
  const { isDesktop } = useMediaBrakepoint();
  const theme = useTheme();
  useOnClickOutside(containerRef, () => {
    setMenuOpened(false);
  });

  const { t } = useTranslation();

  const links = [
    {
      Icon: HomeIcon,
      name: t('header.navbar.website'),
      route: LINKS.minterest.main,
    },
    {
      Icon: HelpIcon,
      name: t('moreMenu.faq'),
      route: EXTERNAL_LINKS.minterest.faq,
    },
    {
      Icon: DiscordIcon,
      name: t('moreMenu.discord'),
      route: EXTERNAL_LINKS.minterest.social.discord,
    },
    {
      Icon: TelegramIcon,
      name: t('moreMenu.telegram'),
      route: EXTERNAL_LINKS.minterest.social.telegram,
    },
    {
      Icon: WarningSquareIcon,
      name: t('moreMenu.termsOfService'),
      route: ROUTES.termsOfService,
    },
    {
      Icon: WarningSquareIcon,
      name: t('moreMenu.privacyPolicy'),
      route: ROUTES.privacyPolicy,
    },
  ];

  const onCloseMenu = () => setMenuOpened(false);

  const onMoreButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setMenuOpened((prev) => !prev);
  };

  return (
    <div ref={containerRef}>
      <Row
        className={classNames({
          [classes.tabletAndMobileButtonWrapper]: !isDesktop,
          [classes.openMenuTabletAndMobile]: openMenu && !isDesktop,
        })}
      >
        {isDesktop && openMenu && (
          <MoreMenu
            onClose={onCloseMenu}
            links={
              !config.FEATURE.GITHUB_LINK
                ? links
                : [
                    ...links,
                    {
                      Icon: GithubIcon,
                      name: t('moreMenu.github'),
                      route: EXTERNAL_LINKS.minterest.github,
                    },
                  ]
            }
          />
        )}
        <ButtonBase
          className={classNames(
            classes.button,
            pickBy(theme.palette.customTheme, {
              ethereum: classes.buttonEthereum,
              taiko: classes.buttonTaiko,
            })
          )}
          onClick={onMoreButtonClick}
        >
          <Row
            className={classNames(classes.content, {
              [pickBy(theme.palette.customTheme, {
                ethereum: classes.openMenuMoreButton,
                taiko: classes.openMenuMoreButtonTaiko,
              })]: openMenu,
            })}
          >
            <Typography
              className={classes.labelText}
              variant='navlink'
              text={t('moreMenu.more')}
            />
            <ArrowDownNoFillSvg
              width={20}
              height={20}
              className={classNames(classes.icon, {
                [classes.openMenuIcon]: openMenu,
              })}
            />
          </Row>
        </ButtonBase>
      </Row>
      {!isDesktop && openMenu && <DeviceMenu links={links} />}
    </div>
  );
};
