import React from 'react';

import { Typography, useMediaValue } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './NFTRewardBoost.module.scss';
import images from 'assets/images';
import { SkeletonRect } from 'common';

type Props = {
  hasNFT: boolean;
  data: {
    image: string;
    isActive: boolean;
  };
  isLoading: boolean;
};

const NFTImage = ({ hasNFT, data, isLoading }: Props): React.ReactElement => {
  const { t } = useTranslation();
  const imageSize = useMediaValue(311, 330, 375);
  const imgSrc = hasNFT ? data.image : images.nftStack;
  const imgSize = hasNFT ? imageSize : imageSize - 86;
  const background = hasNFT
    ? 'transparent'
    : 'linear-gradient(113.87deg, #3C4653 0.34%, #1A212A 99.13%)';
  const grayscale = `grayscale(${hasNFT ? 0 : 1})`;
  return isLoading ? (
    <SkeletonRect
      width={imageSize}
      height={imageSize}
      style={{ minWidth: imageSize }}
      rectProps={{ rx: 24, ry: 24 }}
    />
  ) : (
    <div
      className={classes.imgContainer}
      style={{
        background,
        width: imageSize,
        minWidth: imageSize,
        height: imageSize,
        position: 'relative',
      }}
    >
      {!data.isActive && (
        <div className={classes.notActiveNFT}>
          <Typography variant='h3' text={t('dashboard.nftBlock.notActive')} />
        </div>
      )}
      <img
        style={{ width: imgSize, height: imgSize, filter: grayscale }}
        src={imgSrc}
        alt={t('dashboard.nftBlock.nft')}
        className={classes.ntfImage}
      />
    </div>
  );
};

export default NFTImage;
