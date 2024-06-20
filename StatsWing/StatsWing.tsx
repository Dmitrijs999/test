import React, { FC } from 'react';

import {
  Typography,
  useMediaBrakepoint,
  useMediaValue,
  usd,
} from '@minterest-finance/ui-kit';
import classNames from 'classnames';

import { NetApyButton } from './NetApyButton/NetApyButton';
import classes from './StatsWing.module.scss';
import { StatsWingDashboard } from './StatsWingDashboard';

import SkeletonRect from '../Loaders/SkeletonRect';

type Props = {
  connect: () => void;
  connected: boolean;
  supplyTitle: string;
  supplyUSD: string;
  supplyUnderlying: string;
  borrowTitle: string;
  borrowUSD: string;
  borrowUnderlying: string;
  netApyValue: string;
  withButtons?: boolean;
  WithdrawButton?: React.FC;
  RepayButton?: React.FC;
  isLoading?: boolean;
};

const StatsWing: FC<Props> = ({
  supplyTitle,
  supplyUSD,
  supplyUnderlying,
  borrowUSD,
  borrowUnderlying,
  borrowTitle,
  netApyValue,
  connected,
  connect,
  withButtons,
  WithdrawButton,
  RepayButton,
  isLoading,
}) => {
  const { isMobile, isDesktop } = useMediaBrakepoint();

  const wrapperHeight = useMediaValue('120px', '120px', '');
  const wrapperWithButtonsHeight = useMediaValue('190px', '138px', '');
  const wrapperGridTemplateColumns = useMediaValue(
    '157px 1fr',
    '1fr auto 1fr',
    '1fr 220px 1fr'
  );
  const wrapperGridTemplateRows = useMediaValue('1fr 1fr', '120px', '');
  const wrapperWithButtonsGridTemplateRows = useMediaValue(
    '1fr 1fr',
    '138px',
    ''
  );

  const gridAreaSupply = useMediaValue('', '', '1/1/2/2');
  const gridAreaNetApy = useMediaValue('', '', '1/2/2/3');
  const gridAreaBorrow = useMediaValue('', '', '1/3/2/4');

  const hasSupply = Number(supplyUSD) !== 0;
  const hasBorrow = Number(borrowUSD) !== 0;
  const handleClick = () => {
    !connected && connect();
  };

  return (
    <div
      className={classNames(classes.wrapper, {
        [classes.withButtons]: isMobile && withButtons,
        [classes.withoutButtons]: isMobile && !withButtons,
        [classes.desktop]: isDesktop,
      })}
      style={{
        height:
          withButtons && connected ? wrapperWithButtonsHeight : wrapperHeight,
        gridTemplateRows:
          withButtons && connected
            ? wrapperWithButtonsGridTemplateRows
            : wrapperGridTemplateRows,
        gridTemplateColumns: wrapperGridTemplateColumns,
      }}
    >
      {isDesktop && (
        <div className={classes.statsWingDashboard}>
          <StatsWingDashboard />
        </div>
      )}
      <div
        className={classNames(classes.textBlock, {
          [classes.supplyMobile]: isMobile,
        })}
        style={{
          gridArea: gridAreaSupply,
        }}
      >
        {isLoading ? (
          <SkeletonRect
            className={classes.titleLoader}
            foregroundColor='#21272D'
            backgroundColor='#42484E'
            rectProps={{ rx: 4, ry: 4 }}
          />
        ) : (
          <Typography
            text={supplyTitle}
            variant='copyMBold'
            className={classes.title}
          />
        )}
        {isLoading ? (
          <SkeletonRect
            className={classes.textWithPrefixLoader}
            foregroundColor='#21272D'
            backgroundColor='#42484E'
            rectProps={{ rx: 4, ry: 4 }}
          />
        ) : (
          <div className={classes.textWithPrefix}>
            {hasSupply && (
              <Typography
                text='$'
                variant='copyLBold'
                className={classes.prefix}
              />
            )}
            <Typography
              text={hasSupply ? usd(supplyUSD, { sign: '' }) : '-'}
              variant='h2'
              className={classes.value}
            />
          </div>
        )}
        {!isMobile &&
          hasSupply &&
          (isLoading ? (
            <SkeletonRect
              className={classes.titleLoader}
              foregroundColor='#21272D'
              backgroundColor='#42484E'
              rectProps={{ rx: 4, ry: 4 }}
            />
          ) : (
            <Typography
              text={supplyUnderlying}
              variant='copyMBold'
              className={classes.title}
            />
          ))}
        {WithdrawButton && hasSupply && withButtons && connected && (
          <div className={classes.buttonWrapper}>
            <WithdrawButton />
          </div>
        )}
      </div>
      <div
        className={classNames(classes.circleWrapper, {
          [classes.mobile]: isMobile,
        })}
        style={{
          gridArea: gridAreaNetApy,
        }}
      >
        <NetApyButton
          netApyValue={netApyValue}
          connected={connected}
          onConnectClick={handleClick}
          isLoading={isLoading}
          isActive={hasSupply || hasBorrow}
        />
      </div>
      <div
        className={classNames(classes.textBlock, {
          [classes.borrowMobile]: isMobile,
        })}
        style={{
          gridArea: gridAreaBorrow,
        }}
      >
        {isLoading ? (
          <SkeletonRect
            className={classes.titleLoader}
            foregroundColor='#21272D'
            backgroundColor='#42484E'
            rectProps={{ rx: 4, ry: 4 }}
          />
        ) : (
          <Typography
            text={borrowTitle}
            variant='copyMBold'
            className={classes.title}
          />
        )}
        {isLoading ? (
          <SkeletonRect
            className={classes.textWithPrefixLoader}
            foregroundColor='#21272D'
            backgroundColor='#42484E'
            rectProps={{ rx: 4, ry: 4 }}
          />
        ) : (
          <div className={classes.textWithPrefix}>
            {hasBorrow && (
              <Typography
                text='$'
                variant='copyLBold'
                className={classes.prefix}
              />
            )}
            <Typography
              text={hasBorrow ? usd(borrowUSD, { sign: '' }) : '-'}
              variant='h2'
              className={classes.value}
            />
          </div>
        )}
        {!isMobile &&
          hasBorrow &&
          (isLoading ? (
            <SkeletonRect
              className={classes.titleLoader}
              foregroundColor='#21272D'
              backgroundColor='#42484E'
              rectProps={{ rx: 4, ry: 4 }}
            />
          ) : (
            <Typography
              text={borrowUnderlying}
              variant='copyMBold'
              className={classes.title}
            />
          ))}
        {RepayButton && hasBorrow && withButtons && connected && (
          <div className={classes.buttonWrapper}>
            <RepayButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsWing;
