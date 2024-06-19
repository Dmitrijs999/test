import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import {
  dropAssetsBridgeTransaction,
  dropCollateralTransaction,
  dropMarketTransaction,
  isLoadingStatus,
  selectAssetsBridgeTransaction,
  selectCollateralTransaction,
  selectMarketTransaction,
} from 'features';
import { useAppDispatch, useAppSelector } from 'features/store';

const ModalNavigationHandler = () => {
  const assetBridgeTransaction = useAppSelector(selectAssetsBridgeTransaction);
  const assetBridgeTransactionLoading = isLoadingStatus(
    assetBridgeTransaction?.status
  );
  const marketTransaction = useAppSelector(selectMarketTransaction);
  const marketTransactionLoading = isLoadingStatus(marketTransaction?.status);

  const collateralTransaction = useAppSelector(selectCollateralTransaction);
  const collateralTransactionLoading = isLoadingStatus(
    collateralTransaction?.status
  );

  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unlisten = history.listen(() => {
      if (!assetBridgeTransactionLoading && assetBridgeTransaction?.opened) {
        dispatch(dropAssetsBridgeTransaction());
      }
      if (!marketTransactionLoading && marketTransaction?.opened) {
        dispatch(dropMarketTransaction());
      }
      if (!collateralTransactionLoading && collateralTransaction?.opened) {
        dispatch(dropCollateralTransaction());
      }
    });

    return () => {
      unlisten();
    };
  }, [
    history,
    marketTransaction,
    collateralTransaction,
    assetBridgeTransaction,
  ]);
  return <></>;
};

export default ModalNavigationHandler;
