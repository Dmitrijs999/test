import React, { useState } from 'react';

import { ButtonBase } from '@minterest-finance/ui-kit';

import classes from './WrappedTokenSpecificComponents.module.scss';
import { ArrowDownSvg } from 'assets/svg';
import { TokenInfo } from 'types';

// Icon component for wrapped token: has two options for token selection
export const IconComponent = ({
  selectedToken,
  tokenOptions,
  setWrappedTokenSelect,
}: {
  selectedToken: TokenInfo;
  tokenOptions: TokenInfo[];
  setWrappedTokenSelect: React.Dispatch<any>;
}) => {
  if (!selectedToken) selectedToken = tokenOptions[0];
  const [opened, setOpened] = useState(false);
  if (!setWrappedTokenSelect) return null;

  const handleSelect = (value) => {
    setWrappedTokenSelect(value);
    setOpened(false);
  };

  const ActiveIcon = selectedToken.icon;
  return (
    <div className={classes.iconBlock}>
      <ButtonBase
        sx={{
          height: 34,
          background: '#21272D',
          color: 'white',
          borderRadius: '4px',
          padding: '0 8px',
          marginLeft: '8px',
        }}
        onClick={() => setOpened(!opened)}
      >
        <ActiveIcon />
        <ArrowDownSvg className={classes.arrowDown} />
      </ButtonBase>
      {opened && (
        <div className={classes.dropdownContent}>
          {tokenOptions.map((option) => (
            <button
              key={option.symbol}
              className={classes.dropdownOption}
              onClick={() => handleSelect(option.symbol)}
            >
              <div className={classes.wrappedTokenSpecificDropdownOption}>
                <option.icon />
                <div className={classes.wrappedTokenSpecificDropdownOptionName}>
                  {option.symbol}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
  //}
};
