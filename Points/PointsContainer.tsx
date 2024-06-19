import React from 'react';

import { Redirect } from 'react-router-dom';

import LeaderbordScreen from './PointsScreen';
import { CommonLoader } from 'common';
import config from 'config';
import { useIsDashboardAvailable } from 'features';
import { ROUTES } from 'utils/constants';

const PointsContainer: React.FC = () => {
  const { isAvailable: isDashboardAvailable, loading } =
    useIsDashboardAvailable();
  if (loading) {
    return <CommonLoader />;
  }
  if (isDashboardAvailable && config.FEATURE.DASHBOARD) {
    return <LeaderbordScreen />;
  }
  return <Redirect to={ROUTES.main} />;
};

export default PointsContainer;
