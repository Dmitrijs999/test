import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';

import {
  TransactionButton,
  Alert,
  usd,
  unit,
  useMediaBrakepoint,
  ToggleButton,
  TooltipWrapper,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { BigNumber, ethers, utils } from 'ethers';
import { useTranslation } from 'react-i18next';

import MarketConfirmationModal from './components/MarketConfirmationModal';
import { MarketTransactionLimits } from './components/MarketTransactionLimits';
import { UserStateAlert } from './components/UserStateAlert';
import {
  TitleComponent,
  IconComponent,
} from './components/WrappedTokenSpecific';
import {
  ModalTitles,
  ButtonTitles,
  ApiType,
  ButtonVariant,
  SucceedTransactionAliases,
  FailedTransactionAliases,
} from './constants';
import { convertToUsd, convertToTokens, getTransactionMethod } from './helpers';
import classes from './MarketTransactionModal.module.scss';
import { HelpIconCircle } from 'assets/svg';
import {
  PopupContainer,
  HeaderRow,
  MaxButtonRow,
  GasFee,
  PopupBody,
  InputContainer,
  Input,
  InputHandler,
  InputSubvalue,
  BalanceRow,
  MaxButton,
  Padder,
  PopupBodyHandler,
  SwitchButton,
} from 'common/PopupBuilder';
import config from 'config';
import {
  selectUserAddress,
  useGetTransactionMaxValueQuery,
  TransactionService,
  selectMarketTransaction,
  updateMarketTransaction,
  dropMarketTransaction,
  useBasicOperationMutation,
  useTransactionAlerts,
  isLoadingStatus,
  useGetOraclePricesQuery,
  getMarketOraclePrice,
  useGetMarketsDataQuery,
  getMarketData,
  useExtendedMarketMeta,
  useAddressesQuery,
  useGetUserDataQuery,
  getUserMarketData,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import { useWalletProvider } from 'features/wallet';
import {
  MarketTransaction,
  Transaction,
  TransactionStatus,
  InputType,
  CallSchema,
} from 'types';
import { ERC20ABI, expScale, MarketABI, SupervisorABI } from 'utils/constants';

const MarketTransactionModal = React.memo(
  function MarketTransactionModalComponent() {
    const { t } = useTranslation();

    const [selectedToken, setSelectedToken] = useState<string>(null);
    const [isEnableAsCollateral, setIsEnableAsCollateral] =
      useState<boolean>(false);
    const [isInfiniteAmount, setIsInfiniteAmount] = useState<boolean>(false);
    const [allowanceValue, setAllowanceValue] = useState<BigNumber>();
    const [nativeBalance, setNativeBalance] = useState<string>(null);
    const [allowedValue, setAllowedValue] = useState<BigNumber>();
    const [tokenOraclePrice, setTokenPrice] = useState<string>(null);

    const inputRef = useRef<InputHandler>(null);
    const bodyRef = useRef<PopupBodyHandler>(null);
    const transaction = useAppSelector(selectMarketTransaction);
    const accountAddress = useAppSelector(selectUserAddress);

    const { data: addresses } = useAddressesQuery();
    const provider = useWalletProvider();

    // For isCollateral and isParticipating statuses
    const { data: userData, isFetching: isUserFetching } = useGetUserDataQuery(
      { accountAddress },
      { skip: !accountAddress }
    );
    const userMarketData = getUserMarketData(userData, transaction?.symbol);

    const checkCollateralStatus = useMemo(() => {
      return userData?.userMarkets.filter(
        (market) => market.symbol === transaction?.symbol
      )[0]?.collateralStatus;
    }, [transaction]);

    const [invalidate] = useBasicOperationMutation();

    // TODO: Optimize this. Use GET basic market info from indexer by symbol
    const { data: marketsData, isFetching: isMarketDataFetching } =
      useGetMarketsDataQuery();
    const marketData = getMarketData(marketsData, transaction?.symbol);
    const marketMeta = useExtendedMarketMeta(marketData?.meta);
    // -- end

    const supportedTokens = useMemo(() => {
      const ret = [marketMeta?.underlyingTokenInfo];
      if (marketMeta?.alternativeUnderlyingTokenInfo) {
        ret.push(marketMeta.alternativeUnderlyingTokenInfo);
      }
      return ret;
    }, [marketMeta]);

    const getTokenMeta = (tokenSymbol: string) => {
      if (!tokenSymbol) return marketMeta?.underlyingTokenInfo;

      if (marketMeta?.underlyingTokenInfo.symbol === tokenSymbol) {
        return marketMeta.underlyingTokenInfo;
      } else if (
        marketMeta?.alternativeUnderlyingTokenInfo?.symbol === tokenSymbol
      ) {
        return marketMeta.alternativeUnderlyingTokenInfo;
      }
      return null;
    };

    const selectedTokenMeta = useMemo(() => {
      return getTokenMeta(selectedToken);
    }, [selectedToken, marketMeta]);

    // Set default underlying token after market meta is loaded
    useEffect(() => {
      if (!marketMeta) {
        setSelectedToken(null);
        return;
      }
      if (!selectedToken) {
        if (marketMeta?.alternativeUnderlyingTokenInfo?.isNative) {
          setSelectedToken(marketMeta?.alternativeUnderlyingTokenInfo.symbol);
          return;
        }
        setSelectedToken(marketMeta?.underlyingTokenInfo.symbol);
      }
    }, [marketMeta]);

    // If selected token is native, get native balance
    useEffect(() => {
      if (!selectedTokenMeta?.isNative || !accountAddress) return;
      provider
        .getBalance(accountAddress)
        .then((res) =>
          setNativeBalance(utils.formatUnits(res, selectedTokenMeta.decimals))
        );
    }, [selectedToken, accountAddress]);

    useEffect(() => {
      const getAllowance = async () => {
        return (await TransactionService.get(
          'allowance',
          selectedTokenMeta?.address,
          ERC20ABI,
          [accountAddress, marketMeta?.address]
        )) as unknown as BigNumber;
      };

      if (marketMeta?.underlying && !selectedTokenMeta?.isNative) {
        getAllowance().then((res) => setAllowanceValue(res));
      }
    }, [
      marketMeta?.underlying,
      transaction?.status,
      selectedTokenMeta?.address,
    ]);

    const alerts = useTransactionAlerts();

    const { data: prices, isFetching: isPricesFetching } =
      useGetOraclePricesQuery();

    useEffect(() => {
      if (!prices || !marketMeta) return;
      // TODO: Rework oracle to work with tokens not markets
      let tokenOraclePrice = getMarketOraclePrice(prices, marketMeta?.symbol);
      if (selectedTokenMeta?.symbol === 'mUSD') {
        tokenOraclePrice = '1';
      }

      if (tokenOraclePrice) {
        setTokenPrice(tokenOraclePrice);
      }
    }, [prices, marketMeta, selectedTokenMeta]);

    const {
      data: transactionMeta,
      isFetching: maxValueFetching,
      refetch,
    } = useGetTransactionMaxValueQuery(
      {
        accountAddress: accountAddress,
        symbol: marketMeta?.symbol,
        tokenSymbol: selectedTokenMeta?.symbol,
        operationType: ApiType[transaction?.type],
      },
      {
        skip:
          !transaction || !accountAddress || !marketMeta || !selectedTokenMeta,
      }
    );

    const shouldRefetchMaxValues = useMemo(
      () => transaction?.opened,
      [transaction]
    );

    useEffect(() => {
      if (shouldRefetchMaxValues) {
        refetch();
        setInput('0');
      }
    }, [shouldRefetchMaxValues, selectedToken]);

    const maxInput = useMemo(
      () => BigNumber.from(transactionMeta?.userValue ?? 0),
      [transactionMeta]
    );
    const maxTokens = useMemo(
      () => BigNumber.from(transactionMeta?.transactionValue ?? 0),
      [transactionMeta]
    );

    const dispatch = useAppDispatch();
    const setInput = useCallback(
      (v: string) => {
        if (!inputRef.current) return;
        inputRef.current.setInputValue(v);
        inputRef.current.inputRef.current.blur();
      },
      [inputRef]
    );

    const isTransactionLoading = isLoadingStatus(transaction?.status);

    const convertInputString = useCallback(
      (v: string): Partial<MarketTransaction> => {
        if (tokenOraclePrice && marketMeta) {
          const decimals = selectedTokenMeta.decimals;
          const price = tokenOraclePrice;
          if (transaction.inputType === InputType.token) {
            const tokens = utils.parseUnits(v, decimals);
            const usd = convertToUsd(tokens, price, decimals);
            return { tokens, usd };
          } else {
            const usd = utils.parseUnits(v);
            const tokens = convertToTokens(usd, price, decimals);
            return { tokens, usd };
          }
        }
        return {};
      },
      [tokenOraclePrice, marketMeta, transaction]
    );

    const onMaxClick = useCallback(async () => {
      if (!marketMeta || !tokenOraclePrice) return;
      if (transaction.inputType === InputType.usd) {
        const usd = convertToUsd(
          maxInput,
          tokenOraclePrice,
          selectedTokenMeta.decimals
        );
        const input = utils.formatUnits(usd);
        dispatch(
          updateMarketTransaction({
            input,
            tokens: maxInput,
            usd,
            schema: await getTransactionScheme(maxInput),
          })
        );
        setInput(input);
      } else {
        const input = utils.formatUnits(maxInput, selectedTokenMeta.decimals);
        const payload = convertInputString(input);
        dispatch(
          updateMarketTransaction({
            input,
            ...payload,
            schema: await getTransactionScheme(payload.tokens),
          })
        );
        setInput(input);
      }
    }, [maxInput, marketMeta, tokenOraclePrice, setInput, transaction]);

    const onChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value || '0';
        const payload: Partial<MarketTransaction> = {
          alert: undefined,
          input,
          ...convertInputString(input),
        };
        if (payload.tokens.gt(maxInput)) {
          onMaxClick();
          bodyRef?.current?.shake();
          dispatch(updateMarketTransaction({ alert: alerts.maxed }));
          return;
        }
        dispatch(
          updateMarketTransaction({
            ...payload,
            schema: await getTransactionScheme(payload.tokens),
          })
        );
      },
      [
        maxInput,
        marketMeta,
        tokenOraclePrice,
        setInput,
        transaction,
        isEnableAsCollateral,
      ]
    );

    useEffect(() => {
      const updateSchema = async () => {
        const input = transaction?.input || '0';
        const payload: Partial<MarketTransaction> = {
          alert: undefined,
          input,
          ...convertInputString(input),
        };
        if (+input) {
          dispatch(
            updateMarketTransaction({
              ...payload,
              schema: await getTransactionScheme(payload.tokens),
            })
          );
        }
      };
      updateSchema();
    }, [isEnableAsCollateral, isInfiniteAmount]);

    const onStart = useCallback(
      (tx: Transaction) => {
        dispatch(updateMarketTransaction({ ...tx, alert: alerts.signing }));
      },
      [t]
    );

    const onSigned = useCallback((tx: Transaction) => {
      dispatch(updateMarketTransaction({ ...tx, alert: alerts.waiting }));
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
          updateMarketTransaction({
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
        dispatch(updateMarketTransaction({ ...tx, alert: alerts.success }));
      },
      [transaction]
    );

    const getTransactionScheme = async (
      tokens: BigNumber
    ): Promise<CallSchema> => {
      const schema: CallSchema = [];
      if (tokens.eq(0)) return schema;

      const { type } = transaction;
      const isMaxed = maxInput.eq(tokens);

      if (
        (type === 'supply' || type === 'repay') &&
        !selectedTokenMeta.isNative
      ) {
        if (type === 'supply' && isEnableAsCollateral) {
          const args = {
            turnOn: {
              method: 'enableAsCollateral',
              address: [marketMeta.address],
            },
          };
          schema.push({
            method: args.turnOn.method,
            address: addresses.Supervisor_Proxy,
            abi: SupervisorABI,
            args: [args.turnOn.address],
          });
        }

        const available = (await TransactionService.get(
          'allowance',
          selectedTokenMeta.address,
          ERC20ABI,
          [accountAddress, marketMeta.address]
        )) as BigNumber;

        if (available.lt(tokens)) {
          // MIN-2749
          if (selectedTokenMeta.symbol === 'USDT' && available.gt(0)) {
            schema.push({
              method: 'approve',
              address: selectedTokenMeta.address,
              abi: ERC20ABI,
              args: [marketMeta.address, BigNumber.from(0)],
              benchmark: `MToken.approve`,
            });
          }

          let approval =
            isMaxed && selectedTokenMeta.symbol !== 'mUSD' ? maxTokens : tokens;

          if (type === 'repay') {
            approval = isMaxed ? maxInput.mul(105).div(100) : tokens;
          }

          // If native token is selected, we need to check allowance
          // for the corresponding wrapped token instead
          const tokenAddress = selectedTokenMeta.isNative
            ? marketMeta.underlyingTokenInfo.address
            : selectedTokenMeta.address;

          schema.push({
            method: 'approve',
            address: tokenAddress,
            abi: ERC20ABI,
            args: [
              marketMeta.address,
              isInfiniteAmount ? ethers.constants.MaxUint256 : approval,
            ],
            benchmark: `MToken.approve`,
          });
        }
      }

      const method = getTransactionMethod({
        type: type,
        isMaxed,
        tokenInfo: selectedTokenMeta,
      });

      const getArgs = () => {
        // ⊂(◉‿◉)つ :
        // - Hi there!
        // - My name im Mr. Comment, and I will be your guide today!
        // - Welcome to the citadel of madness, my dear friend!
        // - I hope you will enjoy your stay here. Please, follow me!

        if (
          (type === 'supply' || type === 'repay') &&
          selectedTokenMeta.isNative
        ) {
          // ⊂(◉‿◉)つ :
          // - If our selected token is a native token, it means that for `supply`
          // and `repay` operations we need to transfer tokens via arguments.
          // - Instead ve need to transfer tokens via value, so see `getValue` function below.
          return [];
        }

        let tokenAmount: BigNumber;
        if (selectedTokenMeta.symbol === 'mUSD') {
          // ⊂(◉‿◉)つ :
          // - mUSD is a very specific token, so be careful here and watch your step!

          const usdyPrice = getMarketOraclePrice(prices, marketMeta.symbol);
          const usdyMeta = marketMeta.underlyingTokenInfo;
          if (type === 'redeem') {
            // ⊂(◉‿◉)つ :
            // The `redeem` operation could be performed with 2 different methods
            // in the contract. Each of them use its own type of tokens:
            // 'redeemRUSDY' - uses MTokens
            // 'redeemUnderlyingRUSDY' - uses USDY tokens

            // ⊂(◉‿◉)つ :
            // - Values of maxTokens variable (received from indexer) could be different as well!

            if (isMaxed) {
              // ⊂(◉‿◉)つ :
              // - If we are redeeming max amount of tokens
              // we use `redeemRUSDY` method and MTokens value as argument.
              // Luckily, we already have this value in the maxTokens variable.
              tokenAmount = maxTokens;
            } else {
              // ⊂(◉‿◉)つ :
              // - If we are redeeming specific amount of tokens
              // we use `redeemUnderlyingRUSDY` method and USDY value as argument.
              // - So, we need to convert mUSD to USDY.
              // - We can do it by dividing mUSD value by USDY price, because we assume that 1 mUSD = 1 USD
              tokenAmount = tokens
                .mul(expScale)
                .div(utils.parseUnits(usdyPrice, 36 - usdyMeta.decimals));
            }
          } else if (type === 'borrow') {
            // ⊂(◉‿◉)つ :
            // - For `borrow` operation we have only one method in the contract:
            // `borrowRUSDY` uses USDY tokens as argument.
            // - So, we need to convert mUSD to USDY.
            // - We can do it by dividing mUSD value by USDY price, because we assume that 1 mUSD = 1 USD
            tokenAmount = tokens
              .mul(expScale)
              .div(utils.parseUnits(usdyPrice, 36 - usdyMeta.decimals));
          } else if (type === 'repay') {
            // ⊂(◉‿◉)つ :
            // - For `repay` operation we have only one method in the contract:
            // `repayBorrowRUSDY` uses mUSD tokens as argument.
            // - Usually, we had an option to repay full amount of user's borrow,
            // using MaxUint256 as an argument. But for a pity we can't do it with mUSD.
            tokenAmount = tokens;
          } else {
            // supply
            // ⊂(◉‿◉)つ :
            // - For `supply` operation we have only one method in the contract:
            // `lendRUSDY` uses mUSD tokens as argument.
            // - The value of maxTokens here is equal to balance of user's mUSD tokens.
            tokenAmount = isMaxed ? maxTokens : tokens;
          }
        } else {
          // ⊂(◉‿◉)つ :
          // - For all other tokens we can rely on the maxTokens variable received from indexer for MAX case
          // or use input value for specific amount of tokens.
          tokenAmount = isMaxed ? maxTokens : tokens;
        }

        // ⊂(◉‿◉)つ :
        // - I hope, you enjoyed our small adventure!
        // - Have a nice day! And see you soon!
        return [tokenAmount];
      };

      const getValue = () => {
        if (
          (type === 'supply' || type === 'repay') &&
          selectedTokenMeta.isNative
        ) {
          return isMaxed ? maxTokens : tokens;
        }
        return undefined;
      };

      schema.push({
        method,
        address: marketMeta.address,
        abi: MarketABI,
        args: getArgs(),
        benchmark: `MToken.${
          method === 'redeemUnderlying' ? 'redeem' : method
        }`,
        value: getValue(),
      });
      return schema;
    };

    const onButtonPress = async () => {
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
        // If native token is selected, we need to check allowance
        // for the corresponding wrapped token instead
        const tokenAddress = selectedTokenMeta.isNative
          ? marketMeta.underlyingTokenInfo.address
          : selectedTokenMeta.address;

        const allowed = (await TransactionService.get(
          'allowance',
          tokenAddress,
          ERC20ABI,
          [accountAddress, marketMeta.address]
        )) as BigNumber;
        setAllowedValue(allowed);
        invalidate({ accountAddress, symbol: transaction.symbol });
      }
    };

    const changeInputType = useCallback(() => {
      if (!transaction || !marketMeta) return;
      const newInputType =
        transaction.inputType === InputType.token
          ? InputType.usd
          : InputType.token;
      const payload: Partial<MarketTransaction> = { inputType: newInputType };
      if (transaction.input) {
        if (newInputType === InputType.usd) {
          payload.input = utils.formatUnits(transaction.usd);
        } else {
          payload.input = utils.formatUnits(
            transaction.tokens,
            selectedTokenMeta.decimals
          );
        }
        if (payload.input) {
          setInput(payload.input);
        }
      }

      dispatch(updateMarketTransaction(payload));
    }, [transaction, marketMeta]);

    const onClose = () => {
      if (isTransactionLoading) return;
      dispatch(dropMarketTransaction());
    };

    const { isMobile } = useMediaBrakepoint();

    const displayApproveInfinite = useMemo(() => {
      if (!transaction) return false;

      const noTransactionDetails = !transaction.details;
      const noTransactionAlert = !transaction.alert;
      const isSupplyType = transaction.type === 'supply';
      const hasFeatureMetamaskAmount = config.FEATURE.METAMASK_AMOUNT;
      const hasMarketMeta = Boolean(marketMeta);
      const hasTokenOraclePrice = Boolean(tokenOraclePrice);
      const hasAllowanceValue = Boolean(allowanceValue);

      if (
        selectedTokenMeta?.isNative ||
        !hasAllowanceValue ||
        !hasTokenOraclePrice
      )
        return false;

      const allowanceInUsd = Number(
        convertToUsd(
          allowanceValue,
          tokenOraclePrice,
          selectedTokenMeta.decimals
        )
      );

      const isAllowanceLessThanTransaction =
        Number(transaction.usd) > allowanceInUsd;

      return (
        noTransactionDetails &&
        noTransactionAlert &&
        isSupplyType &&
        hasFeatureMetamaskAmount &&
        hasMarketMeta &&
        hasTokenOraclePrice &&
        hasAllowanceValue &&
        isAllowanceLessThanTransaction
      );
    }, [
      transaction?.type,
      transaction?.details,
      transaction?.alert,
      transaction?.usd,
      allowanceValue,
      tokenOraclePrice,
      selectedTokenMeta?.decimals,
      selectedTokenMeta?.isNative,
      marketMeta,
    ]);

    if (!transaction || !marketMeta) {
      return null;
    }

    const onChangeCollateral = () => {
      setIsEnableAsCollateral(!isEnableAsCollateral);
    };
    const Icon = marketMeta.icon;

    return (
      <PopupContainer
        title={
          supportedTokens.length > 1
            ? null
            : `${t(ModalTitles[transaction.type])} ${
                marketMeta.underlyingTokenInfo.symbol
              }`
        }
        titleComponent={
          supportedTokens.length > 1 ? (
            <TitleComponent
              transactionType={transaction.type}
              selectedToken={selectedTokenMeta}
              tokenOptions={supportedTokens}
              setWrappedTokenSelect={setSelectedToken}
            />
          ) : null
        }
        onClose={onClose}
        className={classes.popup}
        titleRowClassname={classes.titleRow}
        closeIconClassName={classes.baseTransactionCloseIcon}
      >
        <Padder>
          {!transaction.details && (
            <HeaderRow className={classes.headerRowPadder}>
              <MaxButtonRow className={classes.maxButtonRow}>
                <BalanceRow>
                  <MarketTransactionLimits
                    max={maxInput}
                    maxLoading={maxValueFetching}
                    type={transaction.type}
                    accountAddress={accountAddress}
                    marketMeta={marketMeta}
                    nativeBalance={nativeBalance}
                    selectedToken={selectedTokenMeta}
                  />
                </BalanceRow>
                <MaxButton
                  disabled={isTransactionLoading}
                  className={classes.maxButton}
                  onClick={onMaxClick}
                />
              </MaxButtonRow>
              {config.FEATURE.GAS_ESTIMATION && (
                <GasFee
                  schema={transaction.schema}
                  blank={transaction.tokens.eq(0)}
                  iconFill={'#a3a7b6'}
                  spinnerStroke={'#a3a7b6'}
                />
              )}
            </HeaderRow>
          )}
          <PopupBody
            succeed={transaction.status === TransactionStatus.succeed}
            errored={transaction.status === TransactionStatus.failed}
            disabled={isTransactionLoading}
            ref={bodyRef}
            overlayClassname={classes.overlay}
            className={classNames(classes.popupBody, {
              [classes.confirmationModal]: !!transaction?.details,
            })}
          >
            {!transaction.details ? (
              <>
                {supportedTokens.length > 1 ? (
                  <IconComponent
                    selectedToken={selectedTokenMeta}
                    tokenOptions={supportedTokens}
                    setWrappedTokenSelect={setSelectedToken}
                  />
                ) : (
                  <Icon />
                )}
                <InputContainer className={classes.inputContainer} lang='en-US'>
                  <Input
                    ref={inputRef}
                    value={transaction.input}
                    className={classes.inputWrapper}
                    prefix={transaction.inputType === InputType.usd ? '$' : ''}
                    disabled={
                      isPricesFetching ||
                      isMarketDataFetching ||
                      maxValueFetching ||
                      isUserFetching ||
                      isTransactionLoading
                    }
                    onChange={onChange}
                    fractionalLimit={
                      transaction.inputType === InputType.token
                        ? selectedTokenMeta.decimals
                        : 18
                    }
                  />
                  <InputSubvalue
                    className={classes.inputSubValue}
                    text={
                      transaction.inputType === InputType.token
                        ? usd(utils.formatUnits(transaction.usd), {
                            roundDust: false,
                          })
                        : unit(
                            utils.formatUnits(
                              transaction.tokens,
                              selectedTokenMeta.decimals
                            ),
                            { roundDust: false }
                          )
                    }
                  />
                </InputContainer>
                <SwitchButton
                  className={classes.switchButton}
                  onClick={changeInputType}
                />
                <TransactionButton
                  disabled={!Number(transaction.input)}
                  isLoading={isTransactionLoading}
                  onClick={onButtonPress}
                  vr={ButtonVariant[transaction.type] as any}
                  size='medium'
                  className={classes.button}
                  sx={
                    isMobile && { minWidth: '100%!important', marginTop: '8px' }
                  }
                >
                  {t(ButtonTitles[transaction.type])}
                </TransactionButton>
              </>
            ) : (
              <>
                <MarketConfirmationModal
                  state={
                    transaction?.status === TransactionStatus.succeed
                      ? 'success'
                      : 'error'
                  }
                  onClose={onClose}
                  isActivate={userData?.participating}
                  hash={transaction?.details?.hash}
                  description={
                    transaction?.status === TransactionStatus.succeed
                      ? t('marketTransactionModal.status.succeed', {
                          transactionType: t(
                            SucceedTransactionAliases[transaction.type]
                          ),
                        })
                      : t('marketTransactionModal.status.failed', {
                          transactionType: t(
                            FailedTransactionAliases[transaction.type]
                          ),
                        })
                  }
                />
              </>
            )}
          </PopupBody>

          {/* ==== ALERTS SECTION ==== */}
          {!transaction.details && (
            <div className={classes.alert}>
              {transaction.type === 'borrow' && (
                <UserStateAlert marketMeta={marketMeta} />
              )}
            </div>
          )}
          {!transaction.details && (
            <div className={classes.alert}>
              {transaction.alert &&
                (transaction.statusCode == -32603 &&
                config.FEATURE.METAMASK_ALLOWANCE ? (
                  transaction.alert.variant === 'error' &&
                  allowedValue && (
                    <Alert
                      mode='dark'
                      variant={transaction.alert.variant}
                      text={t('errors.metamask.-32603', {
                        available: convertToUsd(allowedValue, '1', 36),
                        symbol: transaction.symbol.slice(1).toLocaleUpperCase(),
                        input: Number(transaction.input).toFixed(2),
                      })}
                    />
                  )
                ) : (
                  <Alert
                    mode='dark'
                    variant={transaction.alert.variant}
                    text={transaction.alert.text}
                  />
                ))}
            </div>
          )}
          {/* TODO: Remove the "false" when borrowing is allowed.  */}
          {false &&
            !transaction.details &&
            transaction.type === 'supply' &&
            userMarketData &&
            !userMarketData.collateralStatus && (
              <div className={classes.enableAlert}>
                <Alert
                  mode='dark'
                  variant={'info'}
                  text={t('marketTransactionModal.enableSupplied')}
                />
              </div>
            )}
          {/* TODO: Remove the "false" when borrowing is allowed.  */}
          {false &&
            !transaction.details &&
            config.FEATURE.COLLATERAL_TOGGLE &&
            transaction.type === 'supply' &&
            !checkCollateralStatus && (
              <div className={classes.collateralToggleWrapper}>
                <div className={classes.collateralToggleText}>
                  <p>{t('marketTransactionModal.enableCollateral')}</p>
                  <div className={classes.iconWrapper}>
                    <TooltipWrapper
                      title={t('tooltips.enableAsCollateral')}
                      withoutIcon
                    >
                      <HelpIconCircle />
                    </TooltipWrapper>
                  </div>
                </div>
                <div>
                  <ToggleButton
                    variant='default'
                    checked={isEnableAsCollateral}
                    onChange={onChangeCollateral}
                  />
                </div>
              </div>
            )}
          {displayApproveInfinite && (
            <div className={classes.collateralToggleWrapper}>
              <div className={classes.collateralToggleText}>
                <p>{t('marketTransactionModal.approveAmount')}</p>
                <div className={classes.iconWrapper}>
                  <TooltipWrapper
                    title={t('tooltips.infiniteApproval')}
                    withoutIcon
                  >
                    <HelpIconCircle />
                  </TooltipWrapper>
                </div>
              </div>
              <div>
                <ToggleButton
                  variant='default'
                  checked={isInfiniteAmount}
                  onChange={() => setIsInfiniteAmount(!isInfiniteAmount)}
                />
              </div>
            </div>
          )}
        </Padder>
      </PopupContainer>
    );
  }
);

export default MarketTransactionModal;
