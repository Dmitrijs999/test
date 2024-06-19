import React from 'react';

import { Redirect } from 'react-router-dom';

import DashboardScreen from './Dashboard';
import { CommonLoader } from 'common';
import config from 'config';
import { useIsDashboardAvailable } from 'features';
import { ROUTES } from 'utils/constants';

const DashboardContainer: React.FC = () => {
  const { isAvailable: isDashboardAvailable, loading } =
    useIsDashboardAvailable();
  if (loading) {
    return <CommonLoader />;
  }
  if (isDashboardAvailable && config.FEATURE.DASHBOARD) {
    return <DashboardScreen />;
  }
  return <Redirect to={ROUTES.main} />;
};

export default DashboardContainer;
