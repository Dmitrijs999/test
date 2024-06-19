import React, { useCallback, useRef } from 'react';

import {
  TransactionButton,
  Typography,
  Alert,
  useMediaBrakepoint,
} from '@minterest-finance/ui-kit';
import { utils, BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';

import MntWalletBalance from './components/MntWalletBalance';
import classes from './StakeMntModal.module.scss';
import {
  HeaderRow,
  MaxButtonRow,
  BalanceRow,
  MaxButton,
  Modal,
  PopupBody,
  PopupContainer,
  InputContainer,
  Input,
  TransactionDetails,
  InputHandler,
  Footer,
  Padder,
  LinkToExplorer,
  PopupBodyHandler,
  GasFee,
} from 'common/PopupBuilder';
import {
  dropStakeMntTransaction,
  useAddressesQuery,
  selectStakeMntTransaction,
  selectUserAddress,
  updateStakeMntTransaction,
  useGetMntStakeDataQuery,
  useMntDetails,
  TransactionService,
  useStakeMntMutation,
  useTransactionAlerts,
  isLoadingStatus,
  useGetUserDataQuery,
  isEndedStatus,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import {
  TransactionStatus,
  StakeMntTransaction,
  Transaction,
  CallSchema,
} from 'types';
import { BuybackABI, ERC20ABI } from 'utils/constants';

const StakeMntModal = React.memo(function StakeMntModalComponent() {
  const transaction = useAppSelector(selectStakeMntTransaction);
  const { t } = useTranslation();
  const inputRef = useRef<InputHandler>(null);
  const bodyRef = useRef<PopupBodyHandler>(null);
  const [invalidate] = useStakeMntMutation();
  const userAddress = useAppSelector(selectUserAddress);
  const alerts = useTransactionAlerts();
  const { data, isFetching } = useGetMntStakeDataQuery(userAddress as string, {
    skip: !userAddress,
  });
  const { data: userData, isFetching: userDashboardFetching } =
    useGetUserDataQuery(
      { accountAddress: userAddress },
      { skip: !userAddress }
    );
  const maxInput = data?.userMntUnderlyingBalance ?? BigNumber.from(0);
  const mntDetails = useMntDetails();
  const dispatch = useAppDispatch();
  const { data: addresses } = useAddressesQuery();
  const setInput = useCallback(
    (v: string) => {
      if (!inputRef.current) return;
      inputRef.current.setInputValue(v);
      inputRef.current.inputRef.current.blur();
    },
    [inputRef]
  );
  const onMaxButtonClick = useCallback(async () => {
    if (!data?.userMntUnderlyingBalance) return;
    const input = utils.formatUnits(data.userMntUnderlyingBalance);
    setInput(input);
    dispatch(
      updateStakeMntTransaction({
        input,
        tokens: data.userMntUnderlyingBalance,
        schema: await getSchema(data.userMntUnderlyingBalance),
      })
    );
  }, [data]);
  const onChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value || '0';
      const payload: Partial<StakeMntTransaction> = {
        input,
        tokens: utils.parseUnits(input, mntDetails.decimals),
        alert: undefined,
      };
      if (payload.tokens.gt(maxInput)) {
        onMaxButtonClick();
        bodyRef?.current?.shake();
        dispatch(updateStakeMntTransaction({ alert: alerts.maxed }));
        return;
      }
      dispatch(
        updateStakeMntTransaction({
          ...payload,
          schema: await getSchema(payload.tokens),
        })
      );
    },
    [mntDetails, maxInput]
  );
  const isTransactionLoading = isLoadingStatus(transaction?.status);
  const isTransactionEnded = isEndedStatus(transaction?.status);
  const onStart = useCallback((tx: Transaction) => {
    dispatch(updateStakeMntTransaction({ ...tx, alert: alerts.signing }));
  }, []);
  const onSigned = useCallback((tx: Transaction) => {
    dispatch(updateStakeMntTransaction({ ...tx, alert: alerts.waiting }));
  }, []);
  const onError = useCallback(
    (tx: Transaction) => {
      if (tx.details) {
        tx.details = {
          ...tx.details,
          amount: transaction.tokens,
          amountUsd: transaction.usd,
        };
      }
      dispatch(
        updateStakeMntTransaction({
          ...tx,
          alert: { variant: 'error', text: tx.error },
        })
      );
    },
    [transaction]
  );
  const onSent = useCallback(
    (tx: Transaction) => {
      tx.details = {
        ...tx.details,
        amount: transaction.tokens,
        amountUsd: transaction.usd,
      };
      dispatch(updateStakeMntTransaction({ ...tx, alert: alerts.success }));
    },
    [transaction]
  );
  const getSchema = async (tokens): Promise<CallSchema> => {
    if (isTransactionLoading || !userData || tokens.eq(0)) {
      return [];
    }
    const schema: CallSchema = [];
    const available = (await TransactionService.get(
      'allowance',
      addresses.Mnt,
      ERC20ABI,
      [userAddress, addresses.Buyback_Proxy]
    )) as BigNumber;
    if (available.lt(tokens)) {
      schema.push({
        method: 'approve',
        address: addresses.Mnt,
        abi: ERC20ABI,
        args: [addresses.Buyback_Proxy, tokens],
        benchmark: 'MToken.approve',
      });
    }
    if (userData?.participating) {
      schema.push({
        method: 'stake',
        address: addresses.Buyback_Proxy,
        abi: BuybackABI,
        args: [tokens],
        benchmark: 'Buyback.stake',
      });
    } else {
      schema.push({
        address: addresses.Buyback_Proxy,
        abi: BuybackABI,
        calls: [
          {
            method: 'participate',
            args: [],
            benchmark: 'Buyback.participate',
          },
          {
            method: 'stake',
            args: [tokens],
            benchmark: 'Buyback.stake',
          },
        ],
      });
    }
    return schema;
  };
  const onButtonPress = useCallback(async () => {
    if (isTransactionLoading) return;
    if (!transaction?.schema?.length) return;
    try {
      await TransactionService.call(transaction.schema, {
        onStart,
        onSigned,
        onError,
        onSent,
      });
    } catch (e) {
      console.log(e);
    } finally {
      invalidate(null);
    }
  }, [transaction, isTransactionLoading, addresses, userData, invalidate]);
  const { isMobile } = useMediaBrakepoint();
  if (!transaction) return null;
  const onClose = () => {
    if (isTransactionLoading) return;
    dispatch(dropStakeMntTransaction());
  };

  const Icon = mntDetails.icon;
  return (
    <Modal isOpen={transaction.opened}>
      <PopupContainer
        className={classes.popup}
        titleRowClassname={classes.titleRow}
        title={t('stake.title')}
        onClose={onClose}
      >
        <Padder>
          {!isTransactionEnded && (
            <HeaderRow>
              <MaxButtonRow>
                <BalanceRow>
                  <MntWalletBalance stakeData={data} loading={isFetching} />
                </BalanceRow>
                <MaxButton onClick={onMaxButtonClick} />
              </MaxButtonRow>
              <GasFee
                schema={transaction.schema}
                blank={transaction.tokens.eq(0)}
              />
            </HeaderRow>
          )}
          <PopupBody
            succeed={transaction.status === TransactionStatus.succeed}
            errored={transaction.status === TransactionStatus.failed}
            disabled={isTransactionLoading}
            ref={bodyRef}
          >
            {!transaction.details ? (
              <>
                <Icon className={classes.icon} />
                <InputContainer lang='en-US'>
                  <Input
                    ref={inputRef}
                    value={transaction.input}
                    disabled={
                      userDashboardFetching ||
                      isFetching ||
                      isTransactionLoading
                    }
                    onChange={onChange}
                    fractionalLimit={mntDetails.decimals}
                  />
                </InputContainer>
                <TransactionButton
                  isLoading={isTransactionLoading}
                  onClick={onButtonPress}
                  vr={'primary'}
                  size='medium'
                  className={classes.button}
                  sx={isMobile && { minWidth: '100%!important' }}
                >
                  {t('stake.title')}
                </TransactionButton>
              </>
            ) : (
              <TransactionDetails
                details={transaction.details}
                amountDecimals={mntDetails.decimals}
                amountSymbol={mntDetails.name}
                TokenIcon={mntDetails.icon}
              />
            )}
          </PopupBody>
          <div className={classes.alert}>
            {transaction.alert && (
              <Alert
                variant={transaction.alert.variant}
                text={transaction.alert.text}
                RightComponent={
                  transaction.details && (
                    <LinkToExplorer
                      hash={transaction.details.hash}
                      success={transaction.status === TransactionStatus.succeed}
                      error={transaction.status === TransactionStatus.failed}
                    />
                  )
                }
              />
            )}
          </div>
        </Padder>
        {!isTransactionEnded && (
          <Footer>
            {!userData?.participating && (
              <Typography
                variant='copyM'
                className={classes.footerText}
                text={t('stake.warning')}
              />
            )}
            <Typography
              variant='copyM'
              className={classes.footerText}
              text={t('stake.description')}
            />
          </Footer>
        )}
      </PopupContainer>
    </Modal>
  );
});

export default StakeMntModal;
