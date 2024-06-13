import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'features/store';
import { selectUserAddress } from 'features/wallet';
import { Feature } from 'types';

export const selectFeatures = (state: RootState): Feature[] =>
  state.featureFlags.features;
export const selectIsLoadingFeatures = (state: RootState): boolean =>
  state.featureFlags.isLoading;
export const selectFeaturesError = (state: RootState): string | null =>
  state.featureFlags.error;

export const selectFeatureEnabled = (featureName: string) =>
  createSelector(
    [selectFeatures, selectUserAddress],
    (features, currentUserWallet) => {
      const feature = features.find((f) => f.featureName === featureName);
      if (!feature) {
        return false;
      }
      if (feature.isWhitelistEnabled) {
        if (!currentUserWallet) return false;
        const wallet = currentUserWallet.toLowerCase();
        const isWhitelisted = feature.whiteListedWallets.includes(wallet);
        return isWhitelisted;
      }
      return true;
    }
  );
