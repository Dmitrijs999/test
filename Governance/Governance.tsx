import React, { useCallback, useMemo, useState, useLayoutEffect } from 'react';

import {
  Card,
  ContainedButton,
  Spinner,
  TooltipWrapper,
  Typography,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import classes from './Governance.module.scss';
import { ExplorerIcon } from 'assets/svg';
import { Container, Content, HelmetMeta } from 'common';
import config from 'config';
import {
  isEndedStatus,
  isLoadingStatus,
  selectGovernanceTransaction,
  selectUserAddress,
  TransactionService,
  updateGovernanceTransaction,
  useAddressesQuery,
  useWalletProvider,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';
import { CallSchema, Transaction } from 'types';
import { MntABI, MntGovernorABI } from 'utils/constants';

enum VoteType {
  Against = 0,
  For = 1,
  Abstain = 2,
}

const GovernanceScreen: React.FC = () => {
  const provider = useWalletProvider();
  const { t } = useTranslation();
  const accountAddress = useAppSelector(selectUserAddress);
  const { data: addresses } = useAddressesQuery();
  const transaction = useAppSelector(selectGovernanceTransaction);
  const dispatch = useAppDispatch();
  const [hasVoted, setHasVoted] = useState(false);

  const isTransactionLoading = isLoadingStatus(transaction?.status);
  const isTransactionEnded = isEndedStatus(transaction?.status);

  const [isCheckVotesLoading, setIsCheckVotesLoading] = useState(false);

  const checkVotes = async () => {
    setIsCheckVotesLoading(true);
    TransactionService.setProvider(provider);
    const vote = (await TransactionService.get(
      'hasVoted',
      addresses.MntGovernor,
      MntGovernorABI,
      [config.PROPOSAL_ID, accountAddress]
    )) as boolean;
    setHasVoted(vote);
  };

  useLayoutEffect(() => {
    if (addresses && accountAddress && provider) {
      checkVotes()
        .catch(console.error)
        .finally(() => setIsCheckVotesLoading(false));
    }
  }, [
    addresses,
    accountAddress,
    provider,
    isTransactionEnded,
    isTransactionLoading,
  ]);

  const onStart = useCallback((tx: Transaction) => {
    dispatch(updateGovernanceTransaction({ ...tx }));
  }, []);
  const onSigned = useCallback((tx: Transaction) => {
    dispatch(updateGovernanceTransaction({ ...tx }));
  }, []);
  const onError = useCallback(
    (tx: Transaction) => {
      dispatch(
        updateGovernanceTransaction({
          ...tx,
        })
      );
    },
    [transaction]
  );
  const onSent = useCallback(
    (tx: Transaction) => {
      dispatch(updateGovernanceTransaction({ ...tx }));
    },
    [transaction]
  );

  const onButtonPress = async (voteType: VoteType) => {
    const transactionSchema: CallSchema = [
      {
        method: 'delegate',
        abi: MntABI,
        args: [accountAddress],
        address: addresses.Mnt,
      },
      {
        method: 'castVote',
        abi: MntGovernorABI,
        args: [config.PROPOSAL_ID, voteType],
        address: addresses.MntGovernor,
      },
    ];

    try {
      await TransactionService.call(transactionSchema, {
        onStart,
        onSigned,
        onError,
        onSent,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const buttonDisabled = useMemo(() => {
    return !accountAddress;
  }, [accountAddress, isTransactionLoading, isTransactionEnded]);

  return (
    <Container>
      <HelmetMeta
        title='Governance | Minterest'
        description='Easy-to-use lending &#38; borrowing dashboard that allows for Minterest protocol function usage.'
        canonical='https://minterest.com/governance'
      />
      <Content
        style={{ alignItems: 'center', overflowX: 'visible' }}
        className={classes.container}
      >
        <div className={classes.voteWrapper}>
          <div className={classes.voteLine}>
            <Typography
              variant='h1'
              text={t('governance.voteline.title')}
              className={classes.title}
            />
            <div className={classes.buttonWrapper}>
              {isCheckVotesLoading || isTransactionLoading ? (
                <>
                  <button
                    className={classNames(
                      classes.button,
                      classes.green,
                      classes.disabled
                    )}
                    disabled={buttonDisabled}
                  >
                    <Spinner size={18} stroke={'#222A34'} />
                  </button>

                  <button
                    disabled={buttonDisabled}
                    className={classNames(
                      classes.button,
                      classes.gray,
                      classes.disabled
                    )}
                  >
                    <Spinner size={18} stroke={'#222A34'} />
                  </button>
                  <button
                    disabled={buttonDisabled}
                    className={classNames(
                      classes.button,
                      classes.red,
                      classes.disabled
                    )}
                  >
                    <Spinner size={18} stroke={'#222A34'} />
                  </button>
                </>
              ) : hasVoted && accountAddress ? (
                <div className={classes.buttonWrapper}>
                  <TooltipWrapper
                    title={t('governance.button.votedTooltip')}
                    withoutIcon
                  >
                    <button
                      className={classNames(
                        classes.button,
                        classes.green,
                        classes.disabled
                      )}
                    >
                      <Typography
                        text={t('governance.button.for')}
                        variant={'copyMBold'}
                      />
                    </button>
                  </TooltipWrapper>

                  <TooltipWrapper
                    title={t('governance.button.votedTooltip')}
                    withoutIcon
                  >
                    <button
                      className={classNames(
                        classes.button,
                        classes.gray,
                        classes.disabled
                      )}
                    >
                      <Typography
                        text={t('governance.button.abstain')}
                        variant={'copyMBold'}
                      />
                    </button>
                  </TooltipWrapper>

                  <TooltipWrapper
                    title={t('governance.button.votedTooltip')}
                    withoutIcon
                  >
                    <button
                      className={classNames(
                        classes.button,
                        classes.red,
                        classes.disabled
                      )}
                    >
                      <Typography
                        text={t('governance.button.against')}
                        variant={'copyMBold'}
                      />
                    </button>
                  </TooltipWrapper>
                </div>
              ) : (
                <div className={classes.buttonWrapper}>
                  <button
                    className={classNames(classes.button, classes.green)}
                    disabled={buttonDisabled}
                    onClick={() => onButtonPress(VoteType.For)}
                  >
                    <Typography
                      text={t('governance.button.for')}
                      variant={'copyMBold'}
                    />
                  </button>

                  <button
                    disabled={buttonDisabled}
                    className={classNames(classes.button, classes.gray)}
                    onClick={() => onButtonPress(VoteType.Abstain)}
                  >
                    <Typography text={'Abstain'} variant={'copyMBold'} />
                  </button>
                  <button
                    disabled={buttonDisabled}
                    className={classNames(classes.button, classes.red)}
                    onClick={() => onButtonPress(VoteType.Against)}
                  >
                    <Typography
                      text={t('governance.button.against')}
                      variant={'copyMBold'}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={classes.proposedByLine}>
            <Typography
              text={t('governance.proposedBy')}
              variant={'copyMBold'}
              className={classes.proposedByText}
            />
            <Typography
              text={t('governance.username')}
              variant={'copyMBold'}
              className={classes.userNameText}
            />
          </div>
        </div>
        <Card
          title={t('governance.details.title')}
          className={classes.detailsCard}
        >
          <div className={classes.detailsContent}>
            <Typography
              className={classNames(classes.text, classes.withoutMargin)}
              variant='copyM'
              text={t('governance.details.firstRow')}
            />

            <Typography
              className={classes.text}
              text={t('governance.details.secondRow')}
              variant='copyM'
            />

            <Typography
              className={classes.text}
              text={t('governance.details.thirdRow')}
              variant='copyM'
            />

            <ContainedButton
              color='primary'
              size='medium'
              className={classes.btn}
              endIcon={<ExplorerIcon />}
            >
              <Typography
                variant='copyMBold'
                text={t('governance.viewOnEtherscan')}
              />
            </ContainedButton>
          </div>
        </Card>
      </Content>
    </Container>
  );
};

export default GovernanceScreen;
