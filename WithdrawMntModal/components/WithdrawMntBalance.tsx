import React, { useCallback } from 'react';

import {
  Row,
  Col,
  Typography,
  unit,
  SmallButton,
  Alert,
  useMediaBrakepoint,
} from '@minterest-finance/ui-kit';
import { BigNumber, utils } from 'ethers';
import { useTranslation } from 'react-i18next';

import classes from './WithdrawMntBalance.module.scss';
import { SkeletonRect } from 'common';
import { LinkToExplorer, MaxButton } from 'common/PopupBuilder';
import { isLoadingStatus, useMntDetails } from 'features';
import { TransactionStatus, WithdrawSourceTransaction } from 'types';

const WithdrawMntBalance = React.memo<{
  tx: WithdrawSourceTransaction;
  balance: BigNumber;
  title: string;
  onPress: () => void;
  onMaxButtonClick: () => void;
  forceShow?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}>(function WithdrawMntBalanceComponent({
  tx,
  title,
  balance,
  onPress,
  forceShow,
  disabled,
  onMaxButtonClick,
  isLoading,
}) {
  const { t } = useTranslation();
  const mntDetails = useMntDetails();
  const Icon = mntDetails.icon;
  const isTransactionLoading = isLoadingStatus(tx?.status);
  const { isMobile } = useMediaBrakepoint();
  const onButtonClick = useCallback(() => {
    if (isTransactionLoading) return;
    onPress();
  }, [onPress, isTransactionLoading]);

  if (balance.eq(0) && !tx.details && !forceShow) {
    return null;
  }

  return (
    <Col className={classes.container}>
      <Row className={classes.row}>
        <Col className={classes.col}>
          <Typography
            variant='copyMBold'
            text={title}
            className={classes.title}
          />
          <Row className={classes.iconRow}>
            <Icon className={classes.icon} />
            {isLoading ? (
              <SkeletonRect width={116} height={24} />
            ) : (
              <Typography
                variant='copyM'
                text={`${unit(utils.formatUnits(balance, mntDetails.decimals), {
                  compact: isMobile,
                })} ${mntDetails.name}`}
                className={classes.value}
              />
            )}
            <MaxButton
              disabled={balance.eq(0) || disabled || isLoading}
              onClick={onMaxButtonClick}
            />
          </Row>
        </Col>
        <SmallButton
          onClick={onButtonClick}
          isLoading={isTransactionLoading}
          color='secondary'
          disabled={balance.eq(0) || disabled}
        >
          {t('withdrawMnt.title')}
        </SmallButton>
      </Row>
      {tx.alert && (
        <Alert
          variant={tx.alert.variant}
          text={tx.alert.text}
          RightComponent={
            tx.details && (
              <LinkToExplorer
                hash={tx.details.hash}
                success={tx.status === TransactionStatus.succeed}
                error={tx.status === TransactionStatus.failed}
              />
            )
          }
        />
      )}
    </Col>
  );
});

export default WithdrawMntBalance;
