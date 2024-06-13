import {
  resetWalletState,
  resetNetworkState,
  indexerApi,
  TAGS,
} from 'features';
import { AppDispatch } from 'features/store';

export const logout = (dispatch: AppDispatch): void => {
  dispatch(resetNetworkState());
  dispatch(resetWalletState());
  dispatch(
    indexerApi.util.invalidateTags([
      TAGS.userData,
      TAGS.userNft,
      TAGS.userBDRAgreements,
      TAGS.totalReturnsChart,
      TAGS.yieldPercent,
    ])
  );
  localStorage.removeItem('walletID');
};
