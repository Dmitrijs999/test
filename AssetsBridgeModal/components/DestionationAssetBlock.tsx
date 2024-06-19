import React from 'react';

import { LabelButton, Typography } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './DestionationAssetBlock.module.scss';
import { MinterestSmallBlackIcon, WalletIcon } from 'assets/svg';
import { getNetworkIcons, selectUserAddress } from 'features';
import { useAppSelector } from 'features/store';
import { ChainNames, Networks, UserNFTResponse } from 'types';
import { displayTruncated } from 'utils';

interface DestinationAssetBlockProps {
  transferToNetwork: Networks;
  selectedNFT?: UserNFTResponse;
}

export const DestinationAssetBlock: React.FC<DestinationAssetBlockProps> = ({
  transferToNetwork,
  selectedNFT,
}) => {
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const NetworkIcon = getNetworkIcons(transferToNetwork);

  return (
    <div className={classes.choseBlock}>
      <div className={classes.fromToWrapper}>
        <Typography
          variant='copyM'
          text={t('assetsBridge.to')}
          className={classes.text}
        />
        <LabelButton
          classes={{ root: classes.labelButton }}
          startIcon={
            <NetworkIcon height={16} className={classes.networkIcon} />
          }
          color='primary'
          disabled={true}
          className={classes.addressLabel}
        >
          {ChainNames[transferToNetwork]}
        </LabelButton>
        <LabelButton
          classes={{ root: classes.labelButton }}
          color='primary'
          disabled={true}
          startIcon={<WalletIcon height={16} />}
        >
          {displayTruncated(accountAddress, 5, 3)}
        </LabelButton>
      </div>
      <div className={classes.destinationAssetBlock}>
        {selectedNFT && (
          <div className={classes.destinationAsset}>
            <img
              className={classes.img}
              src={selectedNFT.image}
              alt={selectedNFT.name}
            />
            <Typography variant='copyM' text={selectedNFT.name} />
          </div>
        )}
        {!selectedNFT && (
          <div className={classes.destinationAsset}>
            <MinterestSmallBlackIcon className={classes.img} />
            <Typography variant='copyM' text={'MINTY'} />
          </div>
        )}
      </div>
    </div>
  );
};
