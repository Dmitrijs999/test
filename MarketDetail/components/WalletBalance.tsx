import React from 'react';

import {
  Row,
  Typography,
  TooltipWrapper,
  unit,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { InfoIcon } from 'assets/svg';
import { SkeletonRect } from 'common';
import {
  selectCurrentWallet,
  useGetUserDataQuery,
  getUserMarketData,
} from 'features';
import { useAppSelector } from 'features/store';
import { ExtMarketMeta } from 'types';

const WalletBalance: React.FC<{
  accountAddress: string;
  marketMeta?: ExtMarketMeta;
}> = ({ accountAddress, marketMeta }) => {
  const { t } = useTranslation();
  const currentWallet = useAppSelector(selectCurrentWallet);
  const WalletIcon = currentWallet?.smallLogo;

  const { data: userData, isFetching } = useGetUserDataQuery(
    { accountAddress },
    { skip: !accountAddress }
  );

  const userMarketData = getUserMarketData(userData, marketMeta?.symbol);

  return (
    <Row
      sx={{
        alignItems: 'center',
      }}
    >
      <Row sx={{ mr: '4px' }}>
        {WalletIcon && <WalletIcon width={24} height={24} />}
      </Row>
      {isFetching ? (
        <Row>
          <SkeletonRect
            foregroundColor='#21272D'
            backgroundColor='#42484E'
            width={180}
            height={20}
          />
        </Row>
      ) : (
        <>
          <Typography
            style={{ color: '#A3A7B6', marginRight: '5px' }}
            variant={'copyM'}
            text={`${unit(userMarketData?.underlyingBalance, {
              compact: true,
            })} ${marketMeta?.name} ${t('marketDetail.inYourWallet')}`}
          />
          <TooltipWrapper
            title={t('marketDetail.inYourWalletTooltip', {
              assetName: marketMeta?.name,
            })}
            withoutIcon
          >
            <InfoIcon width={16} height={16} />
          </TooltipWrapper>
        </>
      )}
    </Row>
  );
};

export default WalletBalance;
