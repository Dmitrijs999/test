import React, { useMemo, useState } from 'react';

import {
  Typography,
  ContainedButton,
  Card,
  Pagination,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import NFTDetailCard from './NftDetailCard';
import NFTImage from './NFTImage';
import classes from './NFTRewardBoost.module.scss';
import NFTTitle from './NFTTitle';
import { ExplorerIcon } from 'assets/svg';
import {
  selectUserAddress,
  useGetUserNFTQuery,
  useGetLiquidityProviderAgreementQuery,
} from 'features';
import { useAppSelector } from 'features/store';
import { LINKS } from 'utils/constants';

const LIMIT = 1;

type NftCardData = { title: string; text: string };
type NftDetailsData = {
  level: NftCardData;
  boost: NftCardData;
  validUntil: NftCardData;
};

const NFTRewardBoost = (): React.ReactElement => {
  const { t } = useTranslation();
  const { nftGallery, marketplaceUrl } = LINKS.minterest.nft;
  const accountAddress = useAppSelector(selectUserAddress);

  const [activeNft, setActiveNft] = useState(0);

  const { data: nftDataArr, isFetching } = useGetUserNFTQuery(
    accountAddress as string,
    {
      skip: !accountAddress,
    }
  );

  const { data: lpBoostData } = useGetLiquidityProviderAgreementQuery(
    accountAddress as string,
    {
      skip: !accountAddress,
    }
  );

  const lpBoostActive = useMemo(() => {
    if (!lpBoostData) return false;
    const { isActive, endTimestamp } = lpBoostData;
    const expired = endTimestamp * 1000 < Date.now();
    return isActive && !expired;
  }, [lpBoostData]);

  const overlayStyles = classNames(classes.overlay, {
    [classes.hidden]: !lpBoostActive,
  });

  const hasNFT = !!nftDataArr?.length;

  const dataStyles = classNames(classes.data, {
    [classes.hasNFT]: hasNFT,
  });

  const btnBlockStyles = classNames(classes.btnBlock, {
    [classes.hasNFT]: hasNFT,
  });

  const openSeaBtnStyles = classNames(classes.openSeaBtn, {
    [classes.hasNFT]: hasNFT,
  });

  const linkContainerStyles = classNames(classes.linkContainer, {
    [classes.hasNFT]: hasNFT,
  });

  const detailsData = useMemo((): NftDetailsData | null => {
    if (!nftDataArr?.length) return null;
    const { tier, emissionBoost, validUntil } = nftDataArr[activeNft];

    return {
      level: {
        title: t('dashboard.nftBlock.level.title'),
        text: `${tier} of 12`,
      },
      boost: {
        title: t('dashboard.nftBlock.emissionBoost.title'),
        text: `${emissionBoost}%`,
      },
      validUntil: {
        title: t('dashboard.nftBlock.validUntil.title'),
        text: validUntil,
      },
    };
  }, [hasNFT, activeNft]);

  const nftDetails = useMemo(() => {
    if (!hasNFT || !detailsData) return [];
    return [
      <NFTDetailCard
        key={detailsData.level.title}
        text={detailsData.level.text}
        title={detailsData.level.title}
      />,
      <NFTDetailCard
        key={detailsData.boost.title}
        text={detailsData.boost.text}
        title={detailsData.boost.title}
      />,
      <NFTDetailCard
        key={detailsData.validUntil.title}
        text={detailsData.validUntil.text}
        title={detailsData.validUntil.title}
        isFullScreen={true}
      />,
    ];
  }, [hasNFT, detailsData]);

  if (!nftDataArr) {
    return null;
  }

  return (
    <Card
      sx={{
        flex: 1,
        width: '100%',
        height: 'auto',
        position: 'relative',
      }}
    >
      <div className={overlayStyles}>
        <Typography
          variant='h3'
          text={t('dashboard.nftBlock.bdrBoostNFTDisabled')}
        />
      </div>
      <div className={classes.nftBlockContainer}>
        <div className={classes.content}>
          <div className={classes.leftBlock}>
            <NFTImage
              isLoading={isFetching}
              data={nftDataArr[activeNft]}
              hasNFT={hasNFT}
            />
            <div className={classes.paginationContainer}>
              <Pagination
                totalPages={
                  nftDataArr ? Math.ceil(nftDataArr.length / LIMIT) : 0
                }
                currentPage={activeNft / LIMIT + 1}
                onChangePage={(page: number) => {
                  setActiveNft((page - 1) * LIMIT);
                }}
              />
            </div>
          </div>

          <div className={classes.rightBlock}>
            <div className={dataStyles}>
              <NFTTitle hasNFT={hasNFT} data={nftDataArr[activeNft]} />
              {nftDetails}
            </div>
            <div className={btnBlockStyles}>
              {hasNFT && (
                <a
                  href={nftGallery}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={openSeaBtnStyles}
                >
                  <ContainedButton color='primary' size='medium'>
                    {t('dashboard.nftBlock.buyButton')}
                  </ContainedButton>
                </a>
              )}
              <div className={linkContainerStyles}>
                <a
                  href={marketplaceUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={openSeaBtnStyles}
                >
                  <Typography
                    text={t('dashboard.nftBlock.marketplace')}
                    variant='copyMBold'
                  />
                </a>
                <ExplorerIcon
                  width={15}
                  height={15}
                  style={{ marginLeft: '7px' }}
                  color='red'
                />
              </div>
            </div>
          </div>
        </div>
        {/* <div className={classes.bottomBlockWrapper}>
          <div className={classes.paginationContainer}>
            <Pagination
              totalPages={nftDataArr ? Math.ceil(nftDataArr.length / LIMIT) : 0}
              currentPage={activeNft / LIMIT + 1}
              onChangePage={(page: number) => {
                setActiveNft((page - 1) * LIMIT);
              }}
            />
          </div>
          <div className={btnBlockStyles}>
            {hasNFT && (
              <a
                href={nftGallery}
                target='_blank'
                rel='noopener noreferrer'
                className={openSeaBtnStyles}
              >
                <ContainedButton color='primary' size='medium'>
                  {t('dashboard.nftBlock.buyButton')}
                </ContainedButton>
              </a>
            )}
            <div className={linkContainerStyles}>
              <a
                href={opensea}
                target='_blank'
                rel='noopener noreferrer'
                className={openSeaBtnStyles}
              >
                <Typography
                  text={t('dashboard.nftBlock.marketplace')}
                  variant='copyMBold'
                />
              </a>
              <ExplorerIcon
                width={15}
                height={15}
                style={{ marginLeft: '7px' }}
                color='red'
              />
            </div>
          </div>
        </div> */}
      </div>
    </Card>
  );
};
export default NFTRewardBoost;
