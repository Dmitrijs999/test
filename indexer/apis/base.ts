import { createApi } from '@reduxjs/toolkit/query/react';

import { indexerQuery } from 'features/queries';

export enum TAGS {
  transactionHistory = 'transactionHistory',
  userData = 'userData',
  userNft = 'userNft',
  marketsData = 'marketsData',
  maxValue = 'maxValue',
  mntWithdraw = 'mntWithdraw',
  mantleWithdraw = 'mantleWithdraw',
  mntStake = 'mntStake',
  mantleStake = 'mantleStake',
  mntAPY = 'mntAPY',
  mintyBridge = 'mintyBridge',
  interestRateChart = 'interestRateChart',
  utilizationChart = 'utilizationChart',
  historyChart = 'historyChart',
  totalReturnsChart = 'totalReturnsChart',
  yieldPercent = 'yieldPercent',
  userBDRAgreements = 'userBDRAgreements',
  liquidityProviderAgreement = 'liquidityProviderAgreement',
  pausedOperations = 'pausedOperations',
  oraclePrices = 'oraclePrices',
  gasHistory = 'gasHistory',
  liquidationNotification = 'liquidationNotification',
  features = 'features',
}

export const indexerApi = createApi({
  reducerPath: 'indexerApi',
  baseQuery: indexerQuery,
  tagTypes: Object.values(TAGS),
  endpoints: () => ({}),
});
