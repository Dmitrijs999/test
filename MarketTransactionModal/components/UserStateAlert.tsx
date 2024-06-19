import React from 'react';

import { Alert } from '@minterest-finance/ui-kit';
import { utils } from 'ethers';
import { useTranslation } from 'react-i18next';

import {
  selectUserAddress,
  useGetUserDataQuery,
  getUserMarketData,
} from 'features';
import { useAppSelector } from 'features/store';
import { ExtMarketMeta } from 'types';

export const UserStateAlert = React.memo<{
  marketMeta: ExtMarketMeta;
}>(function UserStateAlertComponent({ marketMeta }) {
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: userData, isLoading } = useGetUserDataQuery({ accountAddress });
  const hasUserTotalSupplyUSD = utils
    .parseUnits(userData?.userTotalSupplyUSD || '0')
    .gt(0);
  const userMarketData = getUserMarketData(userData, marketMeta.symbol);
  const hasUserSupplyUSD = utils
    .parseUnits(userMarketData?.userSupplyUSD || '0')
    .gt(0);
  const isCollateralEnabled = userData?.userMarkets?.some(
    (m) => m.collateralStatus
  );
  const isCollateralEnabledForUserMarket = userMarketData?.collateralStatus;

  if (isLoading) return;

  if (hasUserTotalSupplyUSD) {
    if (isCollateralEnabled && !isCollateralEnabledForUserMarket)
      return (
        <Alert
          variant={'info'}
          mode={'dark'}
          text={t(
            'borrowUserStateAlert.totalSupply.collateral.collateralNotEnabledOnTaregetMarket',
            {
              assetName: marketMeta.name,
            }
          )}
        />
      );
    if (!isCollateralEnabled && hasUserSupplyUSD)
      return (
        <Alert
          variant={'info'}
          mode={'dark'}
          text={t('borrowUserStateAlert.totalSupply.noCollateral.supply', {
            assetName: marketMeta.name,
          })}
        />
      );
    if (!isCollateralEnabled && !hasUserSupplyUSD)
      return (
        <Alert
          mode={'dark'}
          variant={'info'}
          text={t('borrowUserStateAlert.totalSupply.noCollateral.noSupply')}
        />
      );
  } else {
    return (
      <Alert
        mode={'dark'}
        variant={'info'}
        text={t('borrowUserStateAlert.noTotalSupply')}
      />
    );
  }

  return null;
});
