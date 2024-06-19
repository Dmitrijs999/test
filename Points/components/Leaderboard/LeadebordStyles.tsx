import { useMediaBrakepoint } from '@minterest-finance/ui-kit';

export const useMarkupValues = (): {
  rowHeight: number; // from figma
  headerHeight: number; // from figma
  footerHeight: number; // from figma
  maxListHeight: number; // from figma
  paddingLeft: number; // move content of first column without moving border
  paddingBottom: number; // to make list with 1 item more buty, maybe unnecessary
  explorerIconSize: number; // from figma
  rowWidths: {
    rank: number;
    user: number;
    amount: number;
  };
  loaders: {
    rank: {
      width: number;
      height: number;
    };
    user: {
      width: number;
      height: number;
    };
    amount: {
      width: number;
      height: number;
    };
  };
} => {
  const { isMobile, isTablet } = useMediaBrakepoint();
  const initalValues = {
    rowHeight: 58,
    headerHeight: 48,
    footerHeight: 64,
    maxListHeight: 823,
    paddingLeft: 0,
    paddingBottom: 10,
    explorerIconSize: 20,
    rowWidths: {
      rank: 395,
      user: 395,
      amount: 395,
    },
    loaders: {
      rank: { width: 115, height: 28 },
      user: { width: 115, height: 28 },
      amount: { width: 115, height: 28 },
    },
  };
  if (isTablet) {
    initalValues.rowHeight = 56;
    initalValues.headerHeight = 40;
    initalValues.footerHeight = 64;
    initalValues.maxListHeight = 764;
    initalValues.paddingLeft = 0;
    initalValues.rowWidths = {
      rank: 195,
      user: 195,
      amount: 195,
    };
    initalValues.loaders = {
      rank: { width: 75, height: 22 },
      user: { width: 75, height: 22 },
      amount: { width: 75, height: 22 },
    };
  }
  if (isMobile) {
    initalValues.rowHeight = 53;
    initalValues.headerHeight = 40;
    initalValues.footerHeight = 64;
    initalValues.maxListHeight = 710;
    initalValues.paddingLeft = 0;
    initalValues.paddingBottom = 5;
    initalValues.explorerIconSize = 20;
    initalValues.rowWidths = {
      rank: 106,
      user: 106,
      amount: 106,
    };
    initalValues.loaders = {
      rank: { width: 55, height: 22 },
      user: { width: 55, height: 22 },
      amount: { width: 55, height: 22 },
    };
  }
  return initalValues;
};
