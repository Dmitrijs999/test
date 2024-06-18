import React from 'react';

import { useMediaValue } from '@minterest-finance/ui-kit';
import { useRouteMatch } from 'react-router-dom';

import classes from './MainBackground.module.scss';

interface Props {
  children: React.ReactChild;
}

const backgroundImage = `url("data:image/svg+xml,%3Csvg width='1440' height='723' viewBox='0 0 1440 723' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0.472656H1440V630.473L719.672 722.51L0 630.473V0.472656Z' fill='url(%23paint0_linear_14037_139278)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_14037_139278' x1='720' y1='0.472656' x2='720' y2='909.113' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0.286192' stop-color='%230C1218'/%3E%3Cstop offset='1' stop-color='%23262E38'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E")`;
const backgroundRepeat = 'no-repeat';

// TODO: use only scss for media queries, refactor in case additional conditions
const MainBackground: React.FC<Props> = ({ children }) => {
  const isDashboard = useRouteMatch('/dashboard');
  const isMarketDetail = useRouteMatch('/market/:slug');
  const isGovernance = useRouteMatch('/governance');

  const backgroundPosition = useMediaValue(
    `center -${
      isDashboard ? 35 : isMarketDetail ? 1 : isGovernance ? 285 : 1
    }px`,
    `center -${
      isDashboard ? 28 : isMarketDetail ? 115 : isGovernance ? 285 : 1
    }px`,
    `center -${
      isDashboard ? 619 : isMarketDetail ? 618 : isGovernance ? 805 : 550
    }px`
  );
  const backgroundSize = useMediaValue(
    '1440px 715px',
    '1440px 722px',
    'auto 1340px'
  );
  return (
    <div
      className={classes.backgroundLayout}
      style={{
        backgroundImage,
        backgroundRepeat,
        backgroundPosition,
        backgroundSize,
      }}
    >
      {children}
    </div>
  );
};

export default MainBackground;
