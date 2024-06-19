/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useCallback, useRef, useState } from 'react';

import {
  Alert,
  ContainedButton,
  LabelButton,
  Typography,
  useMediaBrakepoint,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { BigNumber, constants, utils } from 'ethers';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import classes from './AssetsBridgeModal.module.scss';
import { DestinationAssetBlock } from './components/DestionationAssetBlock';
import { SourceAssetBlock } from './components/SourceAssetBlock';
import {
  ArrowUpRight,
  LayerZeroIcon,
  MinterestSmallBlackIcon,
  NFTSwitchIcon,
  Satoshi,
} from 'assets/svg';
import {
  Modal,
  PopupContainer,
  Padder,
  LinkToExplorer,
  PopupBody,
  TransactionDetails,
  PopupBodyHandler,
} from 'common/PopupBuilder';
import config from 'config';
import {
  isLoadingStatus,
  selectAssetsBridgeTransaction,
  dropAssetsBridgeTransaction,
  selectUserAddress,
  useGetUserNFTQuery,
  TransactionService,
  useAddressesQuery,
  updateAssetsBridgeTransaction,
  useTransactionAlerts,
  useGetNftBridgeMetadataQuery,
  useGetMintyBridgeMetadataMutation,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import {
  CallSchema,
  BridgeMetadataResponse,
  SingleCall,
  Transaction,
  TransactionStatus,
  UserNFTResponse,
  Networks,
} from 'types';
import { MinterestNftABI, ERC20ABI, LINKS } from 'utils/constants';

type AssetBridgeFormValues = {
  tokenAmount: string;
  selectedNFT: UserNFTResponse;
};
const AssetsBridgeModal = React.memo(function AssetsBridgeModal() {
  const transaction = useAppSelector(selectAssetsBridgeTransaction);
  const { isMobile } = useMediaBrakepoint();

  const { t } = useTranslation();
  const bodyRef = useRef<PopupBodyHandler>(null);

  const accountAddress = useAppSelector(selectUserAddress);
  const { data: addresses } = useAddressesQuery();

  const { data: nftData } = useGetUserNFTQuery(accountAddress as string, {
    skip: !accountAddress || !transaction?.opened,
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useAppDispatch();
  const [selectedNFT, setSelectedNFT] = useState<UserNFTResponse>();
  const alerts = useTransactionAlerts();

  const transferFromNetwork = config.NETWORK;
  const transferToNetwork =
    config.NETWORK === Networks.TaikoTestnet
      ? Networks.Sepolia
      : Networks.Mainnet;

  const { data: nftMetadata } = useGetNftBridgeMetadataQuery(
    {
      accountAddress: accountAddress,
      dstNetwork: transferToNetwork,
      tokenId: Number(selectedNFT?.id),
      tokenTier: Number(selectedNFT?.tier),
    },
    {
      skip: !accountAddress || !selectedNFT || !transaction?.opened || !nftData,
    }
  );
  const [getMintyBridgeMetadata] = useGetMintyBridgeMetadataMutation();

  const isTransactionLoading = isLoadingStatus(transaction?.status);

  const onStart = useCallback(
    (tx: Transaction) => {
      dispatch(updateAssetsBridgeTransaction({ ...tx, alert: alerts.signing }));
    },
    [t]
  );

  const onSent = useCallback(
    (amount: BigNumber) => (tx: Transaction) => {
      tx.details = {
        ...tx.details,
        amount,
      };
      dispatch(updateAssetsBridgeTransaction({ ...tx, alert: alerts.success }));
    },
    [transaction]
  );

  const onError = useCallback(
    (tx: Transaction) => {
      dispatch(
        updateAssetsBridgeTransaction({
          ...tx,
          alert: { variant: 'error', text: tx.error },
        })
      );
    },
    [transaction]
  );

  const onSigned = useCallback(
    (tx: Transaction) => {
      dispatch(updateAssetsBridgeTransaction({ ...tx, alert: alerts.waiting }));
    },
    [transaction]
  );

  const handleBridgeClick = useCallback(
    async (values: AssetBridgeFormValues) => {
      try {
        let schema: CallSchema;
        let amount: BigNumber;
        if (selectedNFT) {
          schema = await getNFTSchema();
          amount = constants.One;
        } else {
          amount = utils.parseUnits(values.tokenAmount);
          const uintTransferAmount = amount.toString();

          const response = await getMintyBridgeMetadata({
            accountAddress,
            dstNetwork: transferToNetwork,
            transferAmount: uintTransferAmount,
          });

          if ('data' in response) {
            const { data: mintyMetadata } = response;
            schema = await getMintySchema(mintyMetadata);
          } else {
            const { error } = response;
            throw new Error(error.toString());
          }
        }

        await TransactionService.call(schema, {
          onStart,
          onSigned,
          onError,
          onSent: onSent(amount),
        });
      } catch (e) {
        console.log(e);
      }
    },
    [transaction, addresses, nftMetadata, selectedNFT]
  );

  const getMintySchema = useCallback(
    async (mintyMetadata: BridgeMetadataResponse): Promise<CallSchema> => {
      const schema: CallSchema = [];

      const sendFromSingleCall: SingleCall = {
        method: 'sendFrom',
        address: addresses.Mnt,
        abi: ERC20ABI,
        args: [],
        value: BigNumber.from(mintyMetadata.nativeFeeAmount),
        data: mintyMetadata.sendFromPayload,
      };

      schema.push(sendFromSingleCall);

      return schema;
    },
    [addresses]
  );

  const getNFTSchema = useCallback(async (): Promise<CallSchema> => {
    const schema: CallSchema = [];

    const sendFromSingleCall: SingleCall = {
      method: 'sendFrom',
      address: addresses.MinterestNFT,
      abi: MinterestNftABI,
      args: [],
      value: BigNumber.from(nftMetadata.nativeFeeAmount),
      data: nftMetadata.sendFromPayload,
    };
    schema.push(sendFromSingleCall);

    return schema;
  }, [addresses, nftMetadata]);

  const validationSchema = Yup.object({
    selectedNFT: Yup.object().nullable(),
    tokenAmount: Yup.number().when('selectedNFT', ([selectedNFT], schema) => {
      if (!selectedNFT) {
        return schema.required(t(`assetsBridge.tokenRequired`));
      } else {
        return schema.notRequired();
      }
    }),
  });
  const initialValues: AssetBridgeFormValues = {
    tokenAmount: '',
    selectedNFT,
  };
  const onClose = () => {
    if (isTransactionLoading) return;
    dispatch(dropAssetsBridgeTransaction());
  };

  // Links for the description text
  const layerZeroScanLink = (): React.ReactElement => (
    <a
      href={LINKS.layerZeroScan}
      style={{ textDecoration: 'underline', color: '#A3A7B6' }}
      target='_blank'
      rel='noopener noreferrer'
    >
      {t(`assetsBridge.linkView`)}
    </a>
  );

  const learnNftPostLink = (): React.ReactElement => (
    <a
      href={LINKS.minterest.nft.introduction}
      style={{ textDecoration: 'underline', color: '#A3A7B6' }}
      target='_blank'
      rel='noopener noreferrer'
    >
      {t(`assetsBridge.linkView`)}
    </a>
  );
  if (!transaction) return null;

  return (
    <Modal isOpen={transaction.opened}>
      <PopupContainer
        className={classes.popup}
        titleRowClassname={classes.titleRow}
        title={t('assetsBridge.title')}
        onClose={onClose}
      >
        <Padder>
          <div className={classes.headerLinks}>
            <LabelButton
              classes={{ root: classes.labelButton }}
              color='primary'
              disabled={true}
            >
              LayerZero
            </LabelButton>

            <LabelButton
              classes={{ root: classes.labelButton }}
              endIcon={<ArrowUpRight style={{ height: '16px' }} />}
              color='secondary'
              onClick={() => window.open(LINKS.bridges.mantle, '_blank')}
            >
              Mantle
            </LabelButton>
            <LabelButton
              classes={{ root: classes.labelButton }}
              endIcon={<ArrowUpRight style={{ height: '16px' }} />}
              color='secondary'
              onClick={() => window.open(LINKS.bridges.symbiosis, '_blank')}
            >
              Symbiosis
            </LabelButton>
            <LabelButton
              classes={{ root: classes.labelButton }}
              endIcon={<ArrowUpRight style={{ height: '16px' }} />}
              color='secondary'
              onClick={() => window.open(LINKS.bridges.orbiter, '_blank')}
            >
              Orbiter
            </LabelButton>
          </div>
          {!transaction?.details ? (
            <Formik
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={handleBridgeClick}
            >
              {({ isValid }) => (
                <Form>
                  <div className={classes.wrapper}>
                    <SourceAssetBlock
                      selectedNFT={selectedNFT}
                      nftData={nftData}
                      setSelectedNFT={setSelectedNFT}
                      transferFromNetwork={transferFromNetwork}
                    />
                    <button className={classes.switchIconBlock} disabled>
                      <NFTSwitchIcon />
                    </button>
                    <DestinationAssetBlock
                      selectedNFT={selectedNFT}
                      transferToNetwork={transferToNetwork}
                    />

                    <React.Fragment>
                      <div
                        className={classes.description}
                        style={{ color: '#8B8F9E' }}
                      >
                        <div>
                          <span>
                            {t(`assetsBridge.description`)}
                            &nbsp;
                          </span>
                          <span>{layerZeroScanLink()}</span>
                          <span>
                            {t(`assetsBridge.postfix`)}
                            &nbsp;
                          </span>
                        </div>
                        <div className={classes.descriptionBlock}>
                          <span>
                            {t(`assetsBridge.descriptionLine2`)}
                            &nbsp;
                          </span>
                          <span>{learnNftPostLink()}</span>
                          <span>
                            {t(`assetsBridge.postfix`)}
                            &nbsp;
                          </span>
                        </div>
                        <div className={classes.descriptionBlock}>
                          <span>
                            {t(`assetsBridge.descriptionLine3`)}
                            &nbsp;
                          </span>
                        </div>
                      </div>
                    </React.Fragment>

                    <ContainedButton
                      color='info'
                      size='large'
                      type='submit'
                      title={t('assetsBridge.bridgeButton')}
                      className={classes.bridgeButton}
                      disabled={!isValid || isTransactionLoading}
                      onClick={() => handleBridgeClick}
                    >
                      {t('assetsBridge.bridgeButton')}
                    </ContainedButton>
                    <div
                      className={classNames(classes.poweredByBlock, {
                        [classes.poweredByBlockMobile]: isMobile,
                      })}
                    >
                      <Typography
                        variant='copyS'
                        text={t('assetsBridge.poweredBy')}
                      />
                      <LayerZeroIcon />
                      <Typography
                        variant='copyS'
                        text={t('assetsBridge.bridge')}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <PopupBody
              succeed={transaction.status === TransactionStatus.succeed}
              errored={transaction.status === TransactionStatus.failed}
              disabled={isTransactionLoading}
              ref={bodyRef}
            >
              <TransactionDetails
                details={transaction.details}
                amountSymbol={selectedNFT ? 'NFT' : 'MINTY'}
                amountDecimals={selectedNFT ? 0 : 18}
                TokenIcon={selectedNFT ? Satoshi : MinterestSmallBlackIcon}
              />
            </PopupBody>
          )}
          {transaction.alert && (
            <div
              className={
                transaction.status === TransactionStatus.succeed
                  ? classes.successAlert
                  : classes.generalAlert
              }
            >
              <Alert
                variant={transaction.alert.variant}
                text={`${transaction.alert.text} `}
                RightComponent={
                  transaction.details && (
                    <LinkToExplorer
                      hash={transaction.details.hash}
                      success={transaction.status === TransactionStatus.succeed}
                      error={transaction.status === TransactionStatus.failed}
                      isLayerZeroExplorer={true}
                    />
                  )
                }
              />
            </div>
          )}
        </Padder>
      </PopupContainer>
    </Modal>
  );
});

export default AssetsBridgeModal;
