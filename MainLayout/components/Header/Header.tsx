import React, { useCallback, useMemo } from 'react';

import { Menu, IconButton, useMediaValue } from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import classes from './Header.module.scss';
import {
  EthereumNetworkSwitcherIcon,
  MantleNetworkSwitcherIcon,
  TaikoNetworkSwitcherIcon,
} from 'assets/svg';
import { HeaderAlert, HeaderMessage } from 'common';
import { MantleBridge } from 'common/MantleBridge/MantleBridge';
import config from 'config';
import ConnectWallet from 'containers/ConnectWallet/ConnectWallet';
import { MoreDropdown } from 'containers/MoreDropdown/MoreDropdown';
import SwingModal from 'containers/SwingModal/SwingModal';
import {
  FeatureFlags,
  createAssetsBridgeTransaction,
  selectCurrentWallet,
  selectFeatureEnabled,
  selectUserAddress,
  useConnect,
  useIsDashboardAvailable,
} from 'features';
import { useAppSelector } from 'features/store';
import { allowBodyScroll, disableBodyScroll } from 'utils';
import { LINKS, ROUTES } from 'utils/constants';

import Logo from '../Logo/Logo';

const ExtendedPrefixComponent = () => {
  if (config.FEATURE.SWING) return <SwingModal />;
  else return <MantleBridge />;
};

const getPrefixComponent = () => {
  return config.FEATURE.SWING || config.FEATURE.MANTLE_BRIDGE_BUTTON
    ? ExtendedPrefixComponent
    : undefined;
};

export default function Header(): JSX.Element {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  const connect = useConnect();
  const { governance, main, nft, bridge } = LINKS.minterest;
  const selectedWallet = useAppSelector(selectCurrentWallet);
  const accountAddress = useAppSelector(selectUserAddress);
  const dispatch = useDispatch();
  const { isAvailable: isDashboardAvailable } = useIsDashboardAvailable();

  const getIsRouteDisabled = useCallback(
    (disableRoute: boolean) =>
      !accountAddress || !selectedWallet || disableRoute,
    [accountAddress, selectedWallet]
  );
  const assetsBridgeEnabled = useAppSelector(
    selectFeatureEnabled(FeatureFlags.assetsBridge)
  );
  const generalAlertEnabled = useAppSelector(
    selectFeatureEnabled(FeatureFlags.generalAlert)
  );
  const switcherSize = useMediaValue('40px', '40px', '37px');

  const links = useMemo(() => {
    const list = [
      {
        name: t('header.navbar.markets'),
        route: ROUTES.main,
      },
      {
        name: t('header.navbar.dashboard'),
        route: ROUTES.dashboard,
        disabled: getIsRouteDisabled(
          !config.FEATURE.DASHBOARD || !isDashboardAvailable
        ),
      },
    ];
    if (assetsBridgeEnabled)
      list.push({
        name: t('header.assetsBridge'),
        route: bridge,
      });
    else {
      list.push({
        name: t('header.nftBridge'),
        route: bridge,
      });
    }
    if (config.FEATURE.GOVERNANCE) {
      list.push({
        name: t('header.navbar.governance'),
        route: ROUTES.governance,
      });
    }
    if (config.FEATURE.REFERRALS) {
      list.push({
        name: t('header.navbar.referrals'),
        route: ROUTES.referrals,
      });
    }
    // list.push({ name: t('header.navbar.website'), route: main });
    return list;
  }, [t, getIsRouteDisabled, isDashboardAvailable, assetsBridgeEnabled]);

  const onLinkClick = async (route: string) => {
    if (route === bridge) {
      // If wallet is not connected
      if (!accountAddress) {
        const walletState = await connect();
        // If user cancels the wallet connection
        if (walletState.length == 0) return;
      }
      dispatch(createAssetsBridgeTransaction());
      return;
    }
    if (route === governance || route === main || route === nft.marketplaceUrl)
      return (window.location.href = route);
    return history.push(route);
  };

  const activeNetworkRoute = useMemo(() => {
    return config.NETWORK_SWITCHER_MANTLE_URL;
  }, []);
  return (
    <>
      <HeaderMessage />
      {generalAlertEnabled && <HeaderAlert />}
      <Menu
        onDrawerClose={allowBodyScroll}
        onDrawerOpen={disableBodyScroll}
        activeRoute={pathname}
        links={links}
        onLinkClick={onLinkClick}
        PrefixComponent={getPrefixComponent()}
        MoreComponent={MoreDropdown}
        ExtraComponent={ConnectWallet}
        LogoComponent={Logo}
        title={t('header.navbar.menu')}
        networkSwitcherProps={{
          activeRoute: activeNetworkRoute,
          title: 'Network Switcher',
          links: [
            {
              name: 'Taiko',
              route: config.NETWORK_SWITCHER_TAIKO_URL,
              disabled: false,
              Icon: (props) => (
                <TaikoNetworkSwitcherIcon
                  width={'15px'}
                  height={'15px'}
                  className={classNames(classes.icon, {
                    [classes.activeIcon]: props?.active,
                  })}
                />
              ),
            },
            {
              name: 'Mantle',
              route: config.NETWORK_SWITCHER_MANTLE_URL,
              disabled: false,
              Icon: (props) => (
                <MantleNetworkSwitcherIcon
                  width={'20px'}
                  height={'20px'}
                  className={classNames(classes.icon, {
                    [classes.activeIcon]: props?.active,
                  })}
                />
              ),
            },
            {
              name: 'Ethereum',
              route: config.NETWORK_SWITCHER_ETHEREUM_URL,
              disabled: false,
              Icon: (props) => (
                <EthereumNetworkSwitcherIcon
                  width={'20px'}
                  height={'20px'}
                  className={classNames(classes.icon, {
                    [classes.activeIcon]: props?.active,
                  })}
                />
              ),
            },
          ],
          onLinkClick: (route: string) => {
            if (route !== activeNetworkRoute) window.location.href = route;
          },
          isOpen: false,
        }}
        networkComponents={{
          [config.NETWORK_SWITCHER_TAIKO_URL]: {
            IconButton: (props) => (
              <IconButton
                sx={{
                  width: switcherSize,
                  background: '#E91898',
                  height: switcherSize,
                  padding: '8px',
                  minWidth: 'unset !important',
                  borderRadius: '2px',
                  ':hover': {
                    background: '#e91798',
                  },
                }}
                {...props}
              >
                {<TaikoNetworkSwitcherIcon />}
              </IconButton>
            ),
          },
          [config.NETWORK_SWITCHER_MANTLE_URL]: {
            IconButton: (props) => (
              <IconButton
                sx={{
                  width: switcherSize,
                  background: '#21272D',
                  height: switcherSize,
                  padding: '8px',
                  minWidth: 'unset !important',
                  borderRadius: '2px',

                  ':hover': {
                    background: '#2E343A',
                  },
                }}
                {...props}
              >
                {<MantleNetworkSwitcherIcon />}
              </IconButton>
            ),
          },
          [config.NETWORK_SWITCHER_ETHEREUM_URL]: {
            IconButton: (props) => (
              <IconButton
                sx={{
                  width: switcherSize,
                  background: '#21272D',
                  height: switcherSize,
                  padding: '8px',
                  minWidth: 'unset !important',
                  borderRadius: '2px',

                  ':hover': {
                    background: '#2E343A',
                  },
                }}
                {...props}
              >
                {<EthereumNetworkSwitcherIcon />}
              </IconButton>
            ),
          },
        }}
      />
    </>
  );
}
