import React from 'react';

import MainLayout from 'layouts/MainLayout/MainLayout';

import ApiHandler from './containers/ApiHandler';
import DeepLinking from './containers/DeepLinking/DeepLinking';
import ScrollToTop from './containers/ScrollUp';
import WalletsHandler from './containers/WalletsHandler';
import Router from './Router';
import FeaturesHandler from 'containers/FeatureHandler/FeatureHandler';
import LiquidationNotificationHandler from 'containers/LiquidationNotificationHandler/LiquidationNotificationHandler';
import ModalNavigationHandler from 'containers/ModalNavigationHandler/ModalNavigationHandler';

// TODO: need to handle boostrap loading more smooth
const App: React.FC = () => {
  return (
    <>
      <ModalNavigationHandler />
      <FeaturesHandler />
      <WalletsHandler />
      <LiquidationNotificationHandler />
      <ApiHandler />
      <ScrollToTop />
      <DeepLinking />
      <MainLayout>
        <Router />
      </MainLayout>
    </>
  );
};

export default App;
