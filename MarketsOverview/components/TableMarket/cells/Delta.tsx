import React, { FC } from 'react';

import { Typography, usd } from '@minterest-finance/ui-kit';
import classNames from 'classnames';

import { DeltaArrow } from 'assets/svg';

import classes from '../TableMarket.module.scss';

type Props = {
  delta: number;
};

export const Delta: FC<Props> = ({ delta }) => {
  const text = usd(Math.abs(delta), { sign: '', compact: true });
  return (
    <div className={classes.deltaWrapper}>
      <DeltaArrow
        style={{
          transform: delta < 0 ? 'rotate(180deg)' : 'rotate(0deg)',
          fill: delta < 0 ? '#E46179' : '#5DB14F',
        }}
      />
      <Typography
        text={`${delta < 0 ? '-' : ''}${text}`}
        variant='copySBold'
        className={classNames(classes.text, {
          [classes.isNegative]: delta < 0,
        })}
      />
    </div>
  );
};
