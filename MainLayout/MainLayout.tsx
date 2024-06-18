import React, { ReactElement } from 'react';

import Header from 'layouts/MainLayout/components/Header/Header';
import MainBackground from 'layouts/MainLayout/components/MainBackground/MainBackground';

import { Footer } from './components/Footer/Footer';
import classes from './MainLayout.module.scss';
import AssetsBridgeModal from 'containers/AssetsBridgeModal/AssetsBridgeModal';
import NFTBridgeModal from 'containers/NFTBridgeModal/NFTBridgeModal';
import { FeatureFlags, selectFeatureEnabled } from 'features';
import { useAppSelector } from 'features/store';
import Trackers from 'utils/trackers';

interface Props {
  children: ReactElement<any, any>;
}

export default function MainLayout(props: Props): JSX.Element {
  const { children } = props;
  const assetsBridgeEnabled = useAppSelector(
    selectFeatureEnabled(FeatureFlags.assetsBridge)
  );
  return (
    <>
      {assetsBridgeEnabled ? <AssetsBridgeModal /> : <NFTBridgeModal />}
      <div className={classes.main}>
        <Header />
        <Trackers />
        <MainBackground>{children}</MainBackground>
        <Footer />
      </div>
    </>
  );
}
