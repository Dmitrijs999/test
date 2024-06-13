import React, { FunctionComponent, SVGProps } from 'react';

export type SVGIcon = FunctionComponent<
  SVGProps<SVGSVGElement> & { title?: string | undefined }
>;

export enum MarketTableType {
  Lend = 'Supply',
  Borrow = 'Borrow',
}

export type AlertPayload = {
  variant: 'info' | 'success' | 'error' | 'warn';
  text: string;
  RightComponent?: React.ReactNode;
};

export type DropdownLink = {
  Icon: SVGIcon;
  name: string;
  route: string;
};
