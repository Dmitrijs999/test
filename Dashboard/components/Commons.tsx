import React from 'react';

import { Typography, useTheme, useMediaQuery } from '@minterest-finance/ui-kit';

export const Subtitle: React.FC<{ text: string; color?: string }> = ({
  text,
  color,
}) => (
  <Typography
    style={{ paddingBottom: '8px', color: color || '#6D7692' }}
    text={text}
    variant={'copyMBold'}
  />
);

export const ColToRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  return (
    <div
      {...props}
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: isDesktop ? 'column' : 'row',
        justifyContent: 'space-between',
        ...(props.style ?? {}),
      }}
    />
  );
};

export const RowToCol: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  return (
    <div
      {...props}
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: isDesktop ? 'row' : 'column',
        justifyContent: 'space-between',
        ...(props.style ?? {}),
      }}
    />
  );
};
