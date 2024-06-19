import React, { useState } from 'react';

import { Typography, ButtonBase } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './WrappedTokenSpecificComponents.module.scss';
import { ArrowDownSvg } from 'assets/svg';
import { MarketTransactionType, TokenInfo } from 'types';

import { ModalTitles } from '../../constants';

// Title component for wrapped token: has two options for token selection
export const TitleComponent = ({
  transactionType,
  selectedToken,
  tokenOptions,
  setWrappedTokenSelect,
}: {
  transactionType: MarketTransactionType;
  selectedToken: TokenInfo;
  tokenOptions: TokenInfo[];
  setWrappedTokenSelect: React.Dispatch<any>;
}) => {
  const { t } = useTranslation();
  if (!selectedToken) selectedToken = tokenOptions[0];

  const [opened, setOpened] = useState(false);

  const handleSelect = (value) => {
    setWrappedTokenSelect(value);
    setOpened(false);
  };

  return (
    <div className={classes.specialTitle}>
      <Typography
        text={`${t(ModalTitles[transactionType])}`}
        variant='cardHeader'
        style={{
          color: '#fcfdff',
        }}
      />
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
        <Typography
          text={selectedToken.symbol}
          variant='cardHeader'
          style={{
            color: '#fcfdff',
          }}
        />
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
              <Typography
                text={option.symbol}
                variant='cardHeader'
                style={{
                  color: '#fcfdff',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
