/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useMemo, useState } from 'react';

import {
  LabelButton,
  Typography,
  unit,
  usd,
  useMediaBrakepoint,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { ethers } from 'ethers';
import { parseUnits, formatUnits } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';

import classes from './SourceAssetBlock.module.scss';
import { TokenInput } from './TokenInput';
import {
  AssetsBridgeArrow,
  MinterestSmallBlackIcon,
  WalletIcon,
} from 'assets/svg';
import {
  getNetworkIcons,
  selectUserAddress,
  useGetMntStakeDataQuery,
  useGetOraclePricesQuery,
} from 'features';
import { useAppSelector } from 'features/store';
import { ChainNames, Networks, UserNFTResponse } from 'types';
import { displayTruncated } from 'utils';
import { expScale } from 'utils/constants';

interface SourceAssetBlockProps {
  transferFromNetwork: Networks;
  selectedNFT?: UserNFTResponse;
  nftData?: UserNFTResponse[];
  setSelectedNFT: (nft: UserNFTResponse) => void;
}

export const SourceAssetBlock: React.FC<SourceAssetBlockProps> = ({
  transferFromNetwork,
  selectedNFT,
  setSelectedNFT,
  nftData,
}) => {
  const { isMobile } = useMediaBrakepoint();

  const accountAddress = useAppSelector(selectUserAddress);
  const { data: mntStakeData } = useGetMntStakeDataQuery(accountAddress);

  const mntBalance = useMemo(() => {
    if (!mntStakeData) {
      return 'N/A';
    }
    return unit(
      ethers.utils.formatUnits(mntStakeData.userMntUnderlyingBalance)
    );
  }, [mntStakeData]);

  const { data: prices } = useGetOraclePricesQuery();

  const usdBalance = React.useMemo(() => {
    if (!prices || !mntStakeData) {
      return 'N/A';
    }
    const rawMintyPrice = prices?.mntOraclePriceUSD ?? '0';

    const usdPerToken = parseUnits(rawMintyPrice);
    const usedBalance = usdPerToken
      .mul(mntStakeData.userMntUnderlyingBalance)
      .div(expScale);

    return usd(formatUnits(usedBalance));
  }, [prices, mntStakeData]);

  const handleOptionClick = (nft: UserNFTResponse) => {
    setSelectedNFT(nft);
    setIsDropdownOpen(false);
  };
  const handleTokenOptionClick = () => {
    setSelectedNFT(null);
    setIsDropdownOpen(false);
  };

  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const NetworkIcon = getNetworkIcons(transferFromNetwork);

  return (
    <div className={classes.choseBlock}>
      <div className={classes.fromToWrapper}>
        <Typography
          variant='copyM'
          text={t('assetsBridge.from')}
          className={classes.text}
        />
        <LabelButton
          classes={{ root: classes.labelButton }}
          startIcon={
            <NetworkIcon height={16} className={classes.networkIcon} />
          }
          color='primary'
          disabled={true}
        >
          {ChainNames[transferFromNetwork]}
        </LabelButton>

        <LabelButton
          classes={{ root: classes.labelButton }}
          startIcon={<WalletIcon height={16} />}
          color='primary'
          disabled={true}
        >
          {displayTruncated(accountAddress, 5, 3)}
        </LabelButton>
      </div>
      <div
        className={classNames(classes.assetBridgeInputs, {
          [classes.assetBridgeInputsMobile]: isMobile,
        })}
      >
        <div className={classes.select}>
          <>
            <div
              className={classes.selectWrapper}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedNFT && (
                <>
                  <div className={classes.option}>
                    <img
                      className={classes.img}
                      src={selectedNFT.image}
                      alt={selectedNFT.name}
                    />
                    <Typography
                      variant='copyM'
                      text={selectedNFT.name}
                      className={classes.optionText}
                    />
                  </div>
                  <AssetsBridgeArrow
                    className={classNames(classes.arrow, {
                      [classes.open]: isDropdownOpen,
                    })}
                  />
                </>
              )}
              {!selectedNFT && (
                <>
                  <div className={classes.option}>
                    <MinterestSmallBlackIcon className={classes.img} />
                    <Typography variant='copyM' text={'MINTY'} />
                  </div>
                  <AssetsBridgeArrow
                    className={classNames(classes.arrow, {
                      [classes.open]: isDropdownOpen,
                    })}
                  />
                </>
              )}
            </div>
            {isDropdownOpen && (
              <div className={classes.selectOptionsWrapper}>
                <Typography
                  className={classes.optionsTitle}
                  variant='copyMBold'
                  text={t('assetsBridge.tokens')}
                />
                <div
                  className={classes.optionWrapper}
                  onClick={() => handleTokenOptionClick()}
                >
                  <div className={classes.option}>
                    <MinterestSmallBlackIcon className={classes.img} />
                    <Typography variant='copyM' text={'MINTY'} />
                  </div>
                </div>

                {nftData && nftData.length > 0 && (
                  <Typography
                    variant='copyMBold'
                    className={classes.optionsTitle}
                    text={t('assetsBridge.nfts')}
                  />
                )}
                {nftData?.map((nft) => (
                  <React.Fragment key={nft.name}>
                    <div
                      className={classes.optionWrapper}
                      onClick={() => handleOptionClick(nft)}
                    >
                      <div className={classes.option}>
                        <img
                          className={classes.img}
                          src={nft.image}
                          alt={nft.name}
                        />
                        <Typography variant='copyM' text={nft.name} />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        </div>
        {!selectedNFT && (
          <TokenInput
            name='tokenAmount'
            className={classes.assetBridgeTokenInput}
            maxValue={mntStakeData?.userMntUnderlyingBalance}
          />
        )}
      </div>
      {!selectedNFT && (
        <div className={classes.balanceBlock}>
          <div>
            <Typography
              variant='copyS'
              className={classes.balanceText}
              text={t('assetsBridge.balance')}
            />
            <Typography
              className={classes.balanceText}
              variant='copyS'
              text={': ' + mntBalance + ' MINTY'}
            />
          </div>
          <div>
            <Typography
              className={classes.balanceText}
              variant='copyS'
              text={'~' + usdBalance}
            />
          </div>
        </div>
      )}
    </div>
  );
};
