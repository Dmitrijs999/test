import { BigNumber } from 'ethers';

import { expScale } from './constants';

export const getTotalNetAPY = (
  totalAnnualIncome: BigNumber,
  userTotalSupplyUSD: BigNumber,
  userMntWithdrawableUSD: BigNumber
): BigNumber => {
  if (
    totalAnnualIncome.eq(0) ||
    (userTotalSupplyUSD.eq(0) && userMntWithdrawableUSD.eq(0))
  ) {
    return BigNumber.from(0);
  }
  return totalAnnualIncome
    .mul(expScale)
    .div(userTotalSupplyUSD.add(userMntWithdrawableUSD));
};
