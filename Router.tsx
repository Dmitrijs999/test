import React, { Suspense } from 'react';

import { Switch, Route } from 'react-router-dom';

import { TermsOfService, NotFound, PointsScreen } from './screens';
import DashboardScreen from './screens/Dashboard/DashboardContainer';
import { CommonLoader } from 'common';
import GovernanceScreen from 'screens/Governance/Governance';
import PrivacyPolicy from 'screens/PrivacyPolicy';
import { ROUTES } from 'utils/constants';

// const DashboardScreen = React.lazy(
//   () => import('./screens/Dashboard/DashboardContainer')
// );

const MarketDetailScreen = React.lazy(
  () => import('./screens/MarketDetail/MarketDetail')
);

const MarketsOverviewScreen = React.lazy(
  () => import('./screens/MarketsOverview/MarketsOverview')
);

export default function Routing(): JSX.Element {
  return (
    <Suspense fallback={<CommonLoader />}>
      <Switch>
        <Route path={ROUTES.main} exact component={MarketsOverviewScreen} />
        <Route path={ROUTES.points} component={PointsScreen}></Route>
        <Route
          path={ROUTES.marketDetail}
          exact
          component={MarketDetailScreen}
        />
        <Route path={ROUTES.dashboard} exact component={DashboardScreen} />
        <Route path={ROUTES.governance} exact component={GovernanceScreen} />

        <Route path={ROUTES.termsOfService} exact component={TermsOfService} />
        <Route path={ROUTES.privacyPolicy} exact component={PrivacyPolicy} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
