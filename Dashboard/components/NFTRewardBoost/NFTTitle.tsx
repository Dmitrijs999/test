import React from 'react';

import { Typography, ContainedButton } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './NFTRewardBoost.module.scss';
import { LINKS } from 'utils/constants';

type Props = {
  hasNFT: boolean;
  data: {
    tier: number | string;
    name: string;
  };
};

const NFTTitle = ({ hasNFT, data }: Props): React.ReactElement => {
  const { t } = useTranslation();
  const { nftGallery } = LINKS.minterest.nft;
  const variant = hasNFT ? 'h3' : 'h2';
  const text = hasNFT
    ? `${t('dashboard.nftBlock.yourNft.title')} / NO ${data.tier}: ${data.name}`
    : t('dashboard.nftBlock.yourNft.noNFT');
  return (
    <>
      <Typography
        variant={variant}
        style={{
          flexBasis: hasNFT ? '100%' : 1,
          color: '#222A34',
        }}
        text={text}
        className={classes.mainTitle}
      />
      {!hasNFT && (
        <Typography
          variant={'copyL'}
          style={{
            flexBasis: hasNFT ? '100%' : 1,
            color: '#222A34',
          }}
          text={t('dashboard.nftBlock.yourNft.subTitle')}
        />
      )}
      {!hasNFT && (
        <a href={nftGallery} target='_blank' rel='noopener noreferrer'>
          <ContainedButton
            color='info'
            size='large'
            disabled={false}
            className={classes.noNFTBtns}
          >
            {t('dashboard.nftBlock.buyButton')}
          </ContainedButton>
        </a>
      )}
    </>
  );
};

export default NFTTitle;
