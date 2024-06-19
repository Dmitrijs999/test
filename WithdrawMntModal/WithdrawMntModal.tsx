import React, { useRef, useMemo, useCallback } from 'react';

import { Alert } from '@minterest-finance/ui-kit';
import { BigNumber, utils, constants } from 'ethers';
import { useTranslation } from 'react-i18next';

import WithdrawMntBalance from './components/WithdrawMntBalance';
import { SourceTitles } from './constants';
import classes from './WithdrawMntModal.module.scss';
import {
  Modal,
  PopupContainer,
  Padder,
  PopupBody,
  InputContainer,
  Input,
  InputHandler,
  Footer,
  PopupBodyHandler,
} from 'common/PopupBuilder';
import {
  dropWithdrawMntTransaction,
  isLoadingStatus,
  useAddressesQuery,
  selectUserAddress,
  selectWithdrawMntTransaction,
  TransactionService,
  updateWithdrawMntTransaction,
  useGetMntWithdrawDataQuery,
  useMntDetails,
  useTransactionAlerts,
  useWithdrawMntMutation,
  usePausedOperationDetector,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import { MNTSources, Transaction, WithdrawMntTransaction } from 'types';
import { maxBigInt } from 'utils';
import { BuybackABI, RewardsHubABI, VestingABI } from 'utils/constants';

const WithdrawMntModal = React.memo(function WithdrawMntModalComponent() {
  const transaction = useAppSelector(selectWithdrawMntTransaction);
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: addresses } = useAddressesQuery();
  const inputRef = useRef<InputHandler>(null);
  const bodyRef = useRef<PopupBodyHandler>(null);
  const alerts = useTransactionAlerts();
  const mntDetails = useMntDetails();
  const [invalidate] = useWithdrawMntMutation();
  const {
    isBuybackOperationPaused,
    isRewardsHubOperationPaused,
    isVestingOperationPaused,
  } = usePausedOperationDetector();
  const setInput = useCallback(
    (v: string) => {
      if (!inputRef.current) return;
      inputRef.current.setInputValue(v);
      inputRef.current.inputRef.current.blur();
    },
    [inputRef]
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: mntWithdrawData, isFetching } = useGetMntWithdrawDataQuery(
    accountAddress as string,
    {
      skip: !accountAddress,
    }
  );

  const amountBySource = useMemo(
    () => ({
      [MNTSources.staked]: mntWithdrawData?.userBuyBackStaked,
      [MNTSources.unstaked]: mntWithdrawData?.userMntAccruedDistribution,
      [MNTSources.vested]: mntWithdrawData?.userVestingRelesable,
    }),
    [mntWithdrawData]
  );

  const isSourcePaused = useCallback(
    (source: MNTSources): boolean => {
      switch (source) {
        case MNTSources.staked: {
          return isBuybackOperationPaused('unstake');
        }
        case MNTSources.unstaked: {
          return (
            isRewardsHubOperationPaused('withdraw') ||
            isRewardsHubOperationPaused('distributeAllMnt')
          );
        }
        case MNTSources.vested: {
          return isVestingOperationPaused('withdraw');
        }
        default: {
          return true;
        }
      }
    },
    [
      isBuybackOperationPaused,
      isRewardsHubOperationPaused,
      isVestingOperationPaused,
    ]
  );

  const maxInput = useMemo(() => {
    if (mntWithdrawData) {
      return BigNumber.from(
        maxBigInt(
          mntWithdrawData.userBuyBackStaked.toBigInt(),
          mntWithdrawData.userMntAccruedDistribution.toBigInt(),
          mntWithdrawData.userVestingRelesable.toBigInt()
        )
      );
    }
    return BigNumber.from(0);
  }, [mntWithdrawData]);

  const onMaxButtonClick = useCallback(
    (altMaxInput?: BigNumber) => {
      const max = altMaxInput ?? maxInput;
      if (max.lte(0)) return;
      const input = utils.formatUnits(max);
      dispatch(
        updateWithdrawMntTransaction({
          alert: undefined,
          input,
          tokens: max,
        })
      );
      setInput(input);
    },
    [maxInput]
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value || '0';
      const payload: Partial<WithdrawMntTransaction> = {
        input,
        tokens: utils.parseUnits(input, mntDetails.decimals),
        alert: undefined,
      };
      if (payload.tokens.gt(maxInput)) {
        onMaxButtonClick();
        bodyRef?.current?.shake();
        dispatch(updateWithdrawMntTransaction({ alert: alerts.maxed }));
        return;
      }
      dispatch(updateWithdrawMntTransaction(payload));
    },
    [mntDetails, maxInput]
  );

  const onWithdraw = useCallback(
    (source: MNTSources) => async () => {
      const maxPayload = amountBySource[source];
      if (maxPayload.lte(0) || transaction.tokens.eq(0)) return;
      try {
        const isMaxed = transaction.tokens.gte(maxPayload);
        const txValue = transaction.tokens.lte(maxPayload)
          ? transaction.tokens
          : maxPayload;
        if (transaction.tokens.gt(maxPayload)) {
          onMaxButtonClick(maxPayload);
          bodyRef?.current?.shake();
          dispatch(updateWithdrawMntTransaction({ alert: alerts.maxed }));
        }
        const calls = {
          onStart: (tx: Transaction) => {
            dispatch(
              updateWithdrawMntTransaction({
                [source]: { ...tx, alert: alerts.signing },
              })
            );
          },
          onSigned: (tx: Transaction) => {
            dispatch(
              updateWithdrawMntTransaction({
                [source]: { ...tx, alert: alerts.waiting },
              })
            );
          },
          onError: (tx: Transaction) => {
            if (tx.details) {
              tx.details.amount = txValue;
            }
            dispatch(
              updateWithdrawMntTransaction({
                [source]: {
                  ...tx,
                  alert: { variant: 'error', text: tx.error },
                },
              })
            );
          },
          onSent: (tx: Transaction) => {
            if (tx.details) {
              tx.details.amount = txValue;
            }
            dispatch(
              updateWithdrawMntTransaction({
                [source]: { ...tx, alert: alerts.success },
              })
            );
          },
        };
        switch (source) {
          case MNTSources.staked: {
            await TransactionService.callSingle(
              {
                method: 'unstake',
                address: addresses.Buyback_Proxy,
                abi: BuybackABI,
                args: [isMaxed ? maxPayload : transaction.tokens],
              },
              calls
            );
            break;
          }
          case MNTSources.vested: {
            await TransactionService.callSingle(
              {
                method: 'withdraw',
                address: addresses.Vesting,
                abi: VestingABI,
                args: [isMaxed ? maxPayload : transaction.tokens],
              },
              calls
            );
            break;
          }
          case MNTSources.unstaked: {
            await TransactionService.callMultiple(
              {
                address: addresses.RewardsHub_Proxy,
                abi: RewardsHubABI,
                calls: [
                  { method: 'distributeAllMnt', args: [accountAddress] },
                  {
                    method: 'withdraw',
                    args: [isMaxed ? constants.MaxUint256 : transaction.tokens],
                  },
                ],
              },
              calls
            );
            break;
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        invalidate(null);
      }
    },
    [transaction, amountBySource, alerts, accountAddress, addresses, invalidate]
  );

  const isTransactionFetching = useMemo(() => {
    if (!transaction) return false;
    return (
      isLoadingStatus(transaction.staked.status) ||
      isLoadingStatus(transaction.unstaked.status) ||
      isLoadingStatus(transaction.vested.status)
    );
  }, [transaction]);

  if (!transaction) return null;
  const onClose = () => {
    if (isTransactionFetching) return;
    dispatch(dropWithdrawMntTransaction());
  };

  const Icon = mntDetails.icon;

  return (
    <Modal isOpen={transaction.opened}>
      <PopupContainer
        className={classes.popup}
        titleRowClassname={classes.titleRow}
        title={t('withdrawMnt.title')}
        onClose={onClose}
      >
        <Padder className={classes.padder}>
          <PopupBody ref={bodyRef}>
            <Icon className={classes.icon} />
            <InputContainer lang='en-US'>
              <Input
                ref={inputRef}
                value={transaction.input}
                disabled={isFetching || isTransactionFetching}
                onChange={onChange}
                fractionalLimit={mntDetails.decimals}
              />
            </InputContainer>
          </PopupBody>
          {transaction.alert && (
            <Alert
              variant={transaction.alert.variant}
              text={transaction.alert.text}
            />
          )}
        </Padder>
        <Footer
          contentClassName={classes.footerContent}
          title={t('withdrawMnt.footer.title')}
          titleProps={{ variant: 'copyLBold' }}
        >
          {Object.values(MNTSources).map((source: MNTSources) => {
            return (
              <WithdrawMntBalance
                key={'withdraw_mnt_source_' + source}
                isLoading={isFetching}
                tx={transaction[source]}
                balance={amountBySource[source]}
                title={t(SourceTitles[source])}
                onPress={onWithdraw(source)}
                onMaxButtonClick={() =>
                  onMaxButtonClick(amountBySource[source])
                }
                disabled={isSourcePaused(source)}
                forceShow={source === MNTSources.staked && maxInput.eq(0)}
              />
            );
          })}
        </Footer>
      </PopupContainer>
    </Modal>
  );
});

export default WithdrawMntModal;
