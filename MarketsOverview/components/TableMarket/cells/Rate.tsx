import React, { useMemo } from 'react';

import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import {
  MINTSBoostIcon,
  MinterestSmallIcon,
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

export const Rate: React.FC<{
  item: GridRenderCellParams;
  isLoading: boolean;
  isSupplyType: boolean;
}> = ({ item, isLoading, isSupplyType }) => {
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

  const tooltipText = useMemo(() => {
    if (lpData?.isActive)
      return isSupplyType
        ? t('boostTooltips.supply.lp')
        : t('boostTooltips.borrow.lp');
    if (nftData)
      return isSupplyType
        ? t('boostTooltips.supply.nft')
        : t('boostTooltips.borrow.nft');
  }, [nftData, isNftDataLoading, lpData, isLpDataLoading, isSupplyType, t]);

  const {
    rateDisplay,
    marketMNTDisplay,
    nftBdrDisplay,
    marketTaikoDisplay,
    nftCtaValue,
    mintsBoost,
    mintsNftBoostPercentage,
    mintsTotalRewards,
  } = item.row;

  const rewardsArray = [
    {
      tooltipText: isSupplyType
        ? t('markets.mntSupplyAPY')
        : t('markets.mntBorrowAPY'),
      rewardValue: marketMNTDisplay,
      Icon: MinterestSmallIcon,
      symbol: getTokenSymbol('minty'),
    },
    {
      tooltipText: isSupplyType
        ? t('markets.taikoSupplyAPY')
        : t('markets.taikoBorrowAPY'),
      rewardValue: marketTaikoDisplay,
      Icon: TaikoSmallIcon,
      symbol: getTokenSymbol('mnt'),
    },
  ];

  const pointRewardsArray: PointsRewardProps[] = [];
  if (mintsBoost) {
    pointRewardsArray.push({
      rewardValue: mintsBoost.toString(),
      Icon: MINTSBoostIcon,
      symbol: 'MINTS boost',
      tooltipText: '',
    });
  }
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
      rewardValue: nftBdrDisplay,
      Icon: Satoshi,
      symbol: boostSource,
    });
  }

  const percentageInfoProps = {
    emissionTableTitle: isSupplyType ? t('markets.apy') : t('markets.apr'),
    percentageBaseValue: isSupplyType ? rateDisplay : '-' + rateDisplay,
    netApyOnly: false,
    loading: isLoading,
    rewardsArray,
    nftCtaValue,
    pointRewardsArray,
    totalPointRewards: mintsTotalRewards,
  };
  return <CustomPercentageInfo {...percentageInfoProps} />;
};
