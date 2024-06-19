import React, { useMemo, useCallback } from 'react';

import {
  pct,
  SmallButton,
  unit,
  useMediaValue,
} from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import { StatsWing } from 'common';
import config from 'config';
import {
  getMarketData,
  getUserMarketData,
  selectIsWalletConnected,
  useConnect,
  useGetMarketsDataQuery,
  useGetUserDataQuery,
  usePausedOperationDetector,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import { createMarketTransaction } from 'features/transactions';
import { ExtMarketMeta } from 'types';

const WithdrawButton: React.FC<{
  marketMeta: ExtMarketMeta;
  disabled: boolean;
}> = ({ marketMeta, disabled }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onClick = useCallback(() => {
    if (disabled) {
      return;
    } else {
      dispatch(
        createMarketTransaction({ type: 'redeem', symbol: marketMeta.symbol })
      );
    }
  }, [disabled, marketMeta]);

  return (
    <SmallButton
      disabled={disabled}
      color='primary'
      onClick={onClick}
      aria-hidden='true'
      key={`basic_operation_button_withdraw`}
    >
      {t('basicOperations.withdraw.buttonTitle')}
    </SmallButton>
  );
};

const RepayButton: React.FC<{
  marketMeta: ExtMarketMeta;
  disabled: boolean;
}> = ({ marketMeta, disabled }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onClick = useCallback(() => {
    if (disabled) {
      return;
    } else {
      dispatch(
        createMarketTransaction({ type: 'repay', symbol: marketMeta.symbol })
      );
    }
  }, [disabled, marketMeta]);

  return (
    <SmallButton
      disabled={disabled}
      color='secondary'
      onClick={onClick}
      aria-hidden='true'
      key={`basic_operation_button_repay`}
    >
      {t('basicOperations.repay.buttonTitle')}
    </SmallButton>
  );
};

type Props = {
  marketMeta?: ExtMarketMeta;
  accountAddress?: string;
};

export const UserStatsWing: React.FC<Props> = ({
  marketMeta,
  accountAddress,
}) => {
  const connect = useConnect();
  const isWalletConnected = useAppSelector(selectIsWalletConnected);
  const { t } = useTranslation();

  const { data: userData, isFetching: isUserDataFetching } =
    useGetUserDataQuery({ accountAddress }, { skip: !accountAddress });
  const userMarketData = getUserMarketData(userData, marketMeta?.symbol);

  const { data: marketsData, isFetching: isMarketDataFetching } =
    useGetMarketsDataQuery();
  const marketData = getMarketData(marketsData, marketMeta?.symbol);

  const marketAsset = pct(userMarketData?.netApy, { sign: '' });
  const statswingPadding = useMediaValue('4px 0', '40px 0', '');

  const isLoading = useMemo(() => {
    return isUserDataFetching || isMarketDataFetching;
  }, [isUserDataFetching, isMarketDataFetching]);
  const { isMarketOperationPaused } = usePausedOperationDetector();

  const isWithdrawDisabled = useMemo(() => {
    return (
      !userData?.isWhitelisted ||
      isMarketOperationPaused(marketMeta, 'redeem') ||
      !config.FEATURE.WIDTHDRAW_DETAILS.includes(marketMeta?.symbol) ||
      !Number(userMarketData?.userSupplyUnderlying)
    );
  }, [userData, userMarketData, marketMeta, isMarketOperationPaused]);

  const isRepayDisabled = useMemo(() => {
    return (
      !userData?.isWhitelisted ||
      isMarketOperationPaused(marketMeta, 'repay') ||
      !config.FEATURE.REPAY_DETAILS.includes(marketMeta?.symbol) ||
      !Number(userMarketData?.userBorrowUnderlying)
    );
  }, [userData, userMarketData, marketMeta, isMarketOperationPaused]);

  const withdrawButton = useCallback(() => {
    if (!marketMeta || !accountAddress) return null;
    return (
      <WithdrawButton marketMeta={marketMeta} disabled={isWithdrawDisabled} />
    );
  }, [accountAddress, marketMeta, isWithdrawDisabled]);

  const repayButton = useCallback(() => {
    if (!marketMeta || !accountAddress) return null;
    return <RepayButton marketMeta={marketMeta} disabled={isRepayDisabled} />;
  }, [accountAddress, marketMeta, isRepayDisabled]);

  return (
    <div
      style={{
        padding: statswingPadding,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <StatsWing
        isLoading={isLoading}
        withButtons
        WithdrawButton={withdrawButton}
        RepayButton={repayButton}
        connect={connect}
        supplyTitle={
          isWalletConnected
            ? t('marketDetail.userPositionBlock.yourTotalAssetLent', {
                assetName: marketMeta?.name,
              })
            : t('protocolGeneralValues.totalMarketsSupply.title')
        }
        supplyUSD={
          isWalletConnected
            ? userMarketData?.userSupplyUSD
            : marketData?.economic.marketSupplyUSD
        }
        supplyUnderlying={`${
          isWalletConnected
            ? unit(userMarketData?.userSupplyUnderlying, {
                compact: true,
                sign: '~',
              })
            : unit(marketData?.economic.marketSupplyUnderlying, {
                compact: true,
                sign: '~',
              })
        } ${marketMeta?.name}`}
        borrowTitle={
          isWalletConnected
            ? t('marketDetail.userPositionBlock.yourTotalAssetBorrowed', {
                assetName: marketMeta?.name,
              })
            : t('protocolGeneralValues.totalMarketsBorrow.title')
        }
        borrowUSD={
          isWalletConnected
            ? userMarketData?.userBorrowUSD
            : marketData?.economic.marketBorrowUSD
        }
        borrowUnderlying={`${
          isWalletConnected
            ? unit(userMarketData?.userBorrowUnderlying, {
                compact: true,
                sign: '~',
              })
            : unit(marketData?.economic.marketBorrowUnderlying, {
                compact: true,
                sign: '~',
              })
        } ${marketMeta?.name}`}
        connected={isWalletConnected}
        netApyValue={marketAsset}
      />
    </div>
  );
};
