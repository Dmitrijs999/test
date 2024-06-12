export const ROUTES = {
  main: '/',
  marketDetail: '/market/:symbol',
  markets: '/markets',
  dashboard: '/dashboard',
  governance: '/governance',
  referrals: '/referrals',
  termsOfService: '/terms-of-use',
  privacyPolicy: '/privacy-policy',
};

export const LINKS = {
  bridges: {
    symbiosis: 'https://app.symbiosis.finance/bridge',
    orbiter: 'https://www.orbiter.finance/',
    mantle: 'https://bridge.mantle.xyz/',
  },
  layerZeroScan: 'https://layerzeroscan.com/',
  alert: {
    tectonicUpgrade:
      'https://www.mantle.xyz/blog/announcements/mantle-completes-mainnet-v2-tectonic-upgrade',
  },
  minterest: {
    uncsList:
      'https://www.un.org/securitycouncil/content/un-sc-consolidated-list',
    increasedMonitoring:
      'https://www.fatf-gafi.org/publications/high-risk-and-other-monitored-jurisdictions/documents/increased-monitoring-october-2022.html',
    callForAction:
      'https://www.fatf-gafi.org/publications/high-risk-and-other-monitored-jurisdictions/documents/call-for-action-october-2022.html',
    rewards:
      'https://minterest.gitbook.io/minterest-whitepaper-v1.31/minterest-emission-rewards/emission-rewards',
    main: 'https://www.minterest.com/',
    app: 'https://app.minterest.com/',
    governance: 'https://www.minterest.com/governance',
    github: 'https://github.com/minterest-finance',
    audits: {
      trailOfBits: 'https://www.minterest.com/audit-report-trail-of-bits/',
      hacken: 'https://www.minterest.com/audit-report-hacken/',
      zokyo: 'https://minterest.com/zokyo-audit-report-2/',
      peckShield: 'https://minterest.com/audit-report-peckshield/',
    },
    faq: 'https://minterest.gitbook.io/faq/',
    social: {
      telegram: 'https://t.me/MinterestFinanceChat',
      twitter: 'https://twitter.com/Minterest',
      discord: 'https://discord.gg/minterest',
    },
    nft: {
      marketplaceUrl:
        'https://mintle.app/explore/MANTLE:0x7214f5fc6af9249e424f65ceb371b463e3657c0e',
      nftGallery: 'https://minterest.com/nft-gallery/',
      introduction:
        'https://minterest.com/blog/everything-you-need-to-know-about-minterest-nfts/',
    },
    bridge: 'assetsBridge',
  },
};

// todo get this value from indexer
export const MNT_DECIMALS = 18;
export const MANTLE_DECIMALS = 18;

export const expScale = BigInt(1e18);

export * from './regexes';
export * from './datetime';
export * from './abi';

export const CHART_NAME = {
  totalReturns: 'totalReturns',
  lentBorrow: 'lentBorrow',
  interestRate: 'interestRate',
  yieldPercent: 'yieldPercent',
  totalNetApy: 'totalNetApy',
  historicalYield: 'historicalYield',
};

export const NATIVE_TOKEN_SYMBOL = 'mnt';
export const NATIVE_TOKEN_MARKET_SYMBOL = 'mwmnt';
