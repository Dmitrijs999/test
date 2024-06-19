import React, { useMemo } from 'react';

import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import {
  MinterestSmallIcon,
  MINTSBoostIcon,
  Satoshi,
  TaikoSmallIcon,
} from 'assets/svg';
import { PointsRewardProps } from 'common/CustomPercentageInfo/components/PointsTable';
import CustomPercentageInfo from 'common/CustomPercentageInfo/CustomPercentageInfo';
import config from 'config';
import {
  useGetLiquidityProviderAgreementQuery,
  useGetUserNFTQuery,
  selectUserAddress,
  getTokenSymbol,
} from 'features';
import { useAppSelector } from 'features/store';

import { Emission } from '../constants';
import { UserTableRow } from '../UserPositionTable';

export const EmissionCell: React.FC<{
  emission: Emission;
  item: GridRenderCellParams<any, UserTableRow>;
  isLoading: boolean;
}> = ({ emission, item, isLoading }) => {
  const isApy = emission === Emission.apy;
  const { t } = useTranslation();

  const accountAddress = useAppSelector(selectUserAddress);
  const { data: nftData, isLoading: isNftDataLoading } = useGetUserNFTQuery(
    accountAddress as string,
    {
      skip: !accountAddress,
    }
  );
  const { data: lpData, isLoading: isLpDataLoading } =
    useGetLiquidityProviderAgreementQuery(accountAddress as string, {
      skip: !accountAddress,
    });

  const {
    supplyApyDisplay,
    mntSupplyAPY,
    taikoSupplyAPY,
    borrowAprDisplay,
    mntBorrowAPY,
    taikoBorrowAPY,
    nftBdrSupplyBoost,
    nftBdrBorrowBoost,
    nftCtaValueBorrow,
    nftCtaValueSupply,
    mintsSupplyBoost,
    mintsSupplyNftBoostPercentage,
    mintsSupplyTotalRewards,
    mintsBorrowBoost,
    mintsBorrowNftBoostPercentage,
    mintsBorrowTotalRewards,
  } = item.row;

  const tooltipText = useMemo(() => {
    if (lpData?.isActive)
      return isApy
        ? t('boostTooltips.supply.lp')
        : t('boostTooltips.borrow.lp');
    if (nftData)
      return isApy
        ? t('boostTooltips.supply.nft')
        : t('boostTooltips.borrow.nft');
  }, [nftData, isNftDataLoading, lpData, isLpDataLoading, t]);

  const rewardsArray = [
    {
      tooltipText: t(isApy ? 'markets.mntSupplyAPY' : 'markets.mntBorrowAPY'),
      rewardValue: isApy ? mntSupplyAPY : mntBorrowAPY,
      Icon: MinterestSmallIcon,
      symbol: getTokenSymbol('minty'),
    },
    {
      tooltipText: t(
        isApy ? 'markets.taikoSupplyAPY' : 'markets.taikoBorrowAPY'
      ),
      rewardValue: isApy ? taikoSupplyAPY : taikoBorrowAPY,
      Icon: TaikoSmallIcon,
      symbol: getTokenSymbol('mnt'),
    },
  ];

  const pointRewardsArray: PointsRewardProps[] = [];

  const mintsBoost = isApy ? mintsSupplyBoost : mintsBorrowBoost;
  if (mintsBoost) {
    pointRewardsArray.push({
      rewardValue: mintsBoost.toString(),
      Icon: MINTSBoostIcon,
      symbol: 'MINTS boost',
      tooltipText: '',
    });
  }

  const mintsNftBoostPercentage = isApy
    ? mintsSupplyNftBoostPercentage
    : mintsBorrowNftBoostPercentage;

  if (mintsNftBoostPercentage) {
    pointRewardsArray.push({
      rewardValue: mintsNftBoostPercentage.toString(),
      Icon: Satoshi,
      symbol: 'NFT boost',
      tooltipText: '',
    });
  }

  // Show NFT boost only when TABLE_NFT_BOOST is enabled and `nftData` or `lpData` exist ( when user has any NFTs )
  if (config.FEATURE.TABLE_NFT_BOOST && (nftData || lpData)) {
    const boostSource = lpData ? 'BDR' : 'NFT';
    rewardsArray.push({
      tooltipText: tooltipText,
      rewardValue: isApy ? nftBdrSupplyBoost : nftBdrBorrowBoost,
      Icon: Satoshi,
      symbol: boostSource,
    });
  }

  return (
    <CustomPercentageInfo
      nftCtaValue={isApy ? nftCtaValueSupply : nftCtaValueBorrow}
      emissionTableTitle={isApy ? t('markets.apy') : t('markets.apr')}
      percentageBaseValue={isApy ? supplyApyDisplay : '-' + borrowAprDisplay}
      pointRewardsArray={pointRewardsArray}
      netApyOnly={false}
      loading={isLoading}
      rewardsArray={rewardsArray}
      totalPointRewards={
        isApy ? mintsSupplyTotalRewards : mintsBorrowTotalRewards
      }
    />
  );
};
