import { useEffect } from 'react';

import config from 'config';

enum TxState {
  pv,
  pending,
  success,
  error,
}

export type TrackTxType =
  | 'supply'
  | 'redeem'
  | 'borrow'
  | 'repay'
  | 'withdraw_mnt'
  | 'stake'
  | 'participate'
  | 'leave'
  | 'enableCollateral'
  | 'disableCollateral'
  | 'distributeAllMnt';

const TX_EVENTS: Record<TxState, Record<TrackTxType, string>> = {
  [TxState.pv]: {
    supply: 'supply_pv',
    redeem: 'withdraw_pv',
    borrow: 'borrow_pv',
    repay: 'repay_pv',
    withdraw_mnt: 'withdraw_mnt_pv',
    stake: 'stake_mnt_pv',
    participate: 'enable_autostaking_pv',
    leave: 'disable_autostaking_pv',
    enableCollateral: 'enable_collateral_pv',
    disableCollateral: 'disable_collateral_pv',
    distributeAllMnt: 'distribute_all_mnt_pv',
  },
  [TxState.pending]: {
    supply: 'supply',
    redeem: 'withdraw',
    borrow: 'borrow',
    repay: 'repay',
    withdraw_mnt: 'withdraw_mnt',
    stake: 'stake_mnt',
    participate: 'enable_autostaking',
    leave: 'disable_autostaking',
    enableCollateral: 'enable_collateral',
    disableCollateral: 'disable_collateral',
    distributeAllMnt: 'distribute_all_mnt',
  },
  [TxState.success]: {
    supply: 'supply_success',
    redeem: 'withdraw_success',
    borrow: 'borrow_success',
    repay: 'repay_success',
    withdraw_mnt: 'withdraw_mnt_success',
    stake: 'stake_mnt_success',
    participate: 'enable_autostaking_success',
    leave: 'disable_autostaking_success',
    enableCollateral: 'enable_collateral_success',
    disableCollateral: 'disable_collateral_success',
    distributeAllMnt: 'distribute_all_mnt_success',
  },
  [TxState.error]: {
    supply: 'supply_error',
    redeem: 'withdraw_error',
    borrow: 'borrow_error',
    repay: 'repay_error',
    withdraw_mnt: 'withdraw_mnt_error',
    stake: 'stake_mnt_error',
    participate: 'enable_autostaking_error',
    leave: 'disable_autostaking_error',
    enableCollateral: 'enable_collateral_error',
    disableCollateral: 'disable_collateral_error',
    distributeAllMnt: 'distribute_all_mnt_error',
  },
};

const eventTransaction =
  (txState: TxState) =>
  (type: TrackTxType, args: Record<string, string> = {}) => {
    if (!window.dataLayer) return;
    const event = TX_EVENTS[txState][type];
    window.dataLayer.push({
      event,
      ...args,
    });
  };

const eventWithURI = (event: string, extraParams?: Iterable<unknown>): void => {
  if (!window.dataLayer) return;
  const url = window?.location?.href;
  window.dataLayer.push({
    event,
    url,
    ...extraParams,
  });
};

// @ts-ignore
const loadScript = (place, src, id, callback) => {
  const existingScript = document.getElementById(id);

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    // @ts-ignore
    document[place].appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};

function Trackers(): null {
  useEffect(() => {
    if (config.ENVIRONMENT === 'prod') {
      loadScript(
        'head',
        'https://www.googletagmanager.com/ns.html?id=GTM-N35MG7J',
        'tagmanager',
        () => {
          (function (w, d, s, l, i) {
            // @ts-ignore
            w[l] = w[l] || [];
            // @ts-ignore
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            const f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != 'dataLayer' ? '&l=' + l : '';
            // @ts-ignore
            j.async = true;
            // @ts-ignore
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            // @ts-ignore
            f.parentNode.insertBefore(j, f);
          })(window, document, 'script', 'dataLayer', 'GTM-N35MG7J');
        }
      );
    }
  }, []);
  return null;
}

export default Trackers;

enum LoginState {
  requested = 'requested',
  fulfilled = 'fulfilled',
}

export const trackerControls = {
  setLoginAttempt: (): void => {
    if (sessionStorage.getItem('login_attempt') === LoginState.fulfilled) {
      return;
    }
    sessionStorage.setItem('login_attempt', LoginState.requested);
    if (!window.dataLayer) return;
    window.dataLayer.push({
      event: 'login_initial',
    });
  },
  trackLogin: (account: string, wallet: string): void => {
    const loginRequestedThisSession =
      sessionStorage.getItem('login_attempt') === LoginState.requested;
    if (!loginRequestedThisSession) return;
    if (!window.dataLayer) return;
    window.dataLayer.push({
      event: 'login_successful',
      account,
      wallet_type: wallet,
    });
    sessionStorage.setItem('login_attempt', LoginState.fulfilled);
  },
  trackLoginError: (error: string): void => {
    if (!window.dataLayer) return;
    window.dataLayer.push({
      event: 'login_successful',
      error_description: error,
    });
  },
  trackLoginNetworkError: (): void => {
    if (!window.dataLayer) return;
    window.dataLayer.push({
      event: 'login_network_not_supported',
    });
  },
  trackLLSuccess: (account: string): void => {
    if (!window.dataLayer) return;
    window.dataLayer.push({
      event: 'lnl_step3_success',
      account,
    });
  },
  trackBannerClose: (): void => eventWithURI('close_banner'),
  trackMinterestLogoClick: (): void => eventWithURI('minterest_logo_click'),
  trackAuditReportClick: (): void => eventWithURI('audit_report_click'),
  trackTransactionInit: eventTransaction(TxState.pv),
  trackTransactionPending: eventTransaction(TxState.pending),
  trackTransactionSuccess: eventTransaction(TxState.success),
  trackTransactionError: eventTransaction(TxState.error),
};
