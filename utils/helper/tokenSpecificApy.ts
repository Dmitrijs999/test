import { TFunction } from 'i18next';

import { METHIcon, USDYIcon } from '../../assets/svg';
export function tokenSpecificApy_getTokenIconBySymbol(symbol: string) {
  if (symbol === 'mmeth') {
    return METHIcon;
  } else if (symbol === 'musdy') {
    return USDYIcon;
  }
  throw new Error(`Can not find icon for the symbol: ${symbol}`);
}
export function tokenSpecificApy_getTooltipBySymbol(
  symbol: string,
  translation: TFunction
) {
  if (symbol === 'mmeth') {
    return translation('markets.mmethApyDetails');
  } else if (symbol === 'musdy') {
    return translation('markets.mUsdyApyDetails');
  }
  throw new Error(`Can not find tooltip for the symbol: ${symbol}`);
}

type SpecificApyList = {
  USDY?: string;
  METH?: string;
};

export function getTokenSpecificApy(
  symbol: string,
  specificApyList: SpecificApyList
) {
  if (symbol === 'mmeth') {
    return specificApyList.METH;
  } else if (symbol === 'musdy') {
    return specificApyList.USDY;
  } else {
    return undefined;
  }
}
