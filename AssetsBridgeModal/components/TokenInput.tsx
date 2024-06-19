import React, { useMemo } from 'react';

import { TooltipWrapper } from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useField } from 'formik';

import classes from './TokenInput.module.scss';

interface TokenInputProps {
  className?: string;
  name: string;
  maxValue?: BigNumber;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  className,
  name,
  maxValue: uintMaxValue,
}) => {
  const [field, meta, helpers] = useField(name);
  const { value } = meta;
  const { setValue } = helpers;

  const maxValue = useMemo(() => {
    if (uintMaxValue) return formatUnits(uintMaxValue, 18).toString();
    else return null;
  }, [uintMaxValue]);

  const handleMaxClick = () => {
    if (maxValue) {
      setValue(maxValue);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      try {
        const numericValue = parseUnits(inputValue, 18);
        if (maxValue && numericValue.gt(uintMaxValue)) {
          helpers.setValue(maxValue);
        } else {
          helpers.setValue(inputValue);
        }
      } catch (errror) {
        helpers.setValue(inputValue);
      }
    }
  };

  return (
    <div className={classNames(classes.tokenInputWrapper, className)}>
      <TooltipWrapper
        classes={{ tooltip: classes.tooltip }}
        withoutIcon
        open={Boolean(meta.error) && meta.touched}
        placement='bottom'
        title={meta.error || ''}
      >
        <input
          type='text'
          className={classNames(classes.tokenInput, {
            [classes.error]: meta.error && meta.touched,
          })}
          {...field}
          value={value}
          onChange={handleChange}
        />
      </TooltipWrapper>
      {maxValue && (
        <button
          type='button'
          className={classes.maxButton}
          onClick={handleMaxClick}
        >
          MAX
        </button>
      )}
    </div>
  );
};
