import React, { useCallback, useEffect, useState } from 'react';

import { useLocation, useHistory } from 'react-router-dom';

import {
  selectIsNetworkSupported,
  selectUserAddress,
  useConnect,
} from 'features';
import { useAppSelector } from 'features/store';

const SHOW_CONNECT_PARAM = 'connect';

const DeepLinking: React.FC = () => {
  const connect = useConnect();
  const userAddress = useAppSelector(selectUserAddress);
  const location = useLocation();
  const [initialLocation, setLocation] = useState(
    `${location.pathname}${location.search}`
  );
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const history = useHistory();
  const isNetworkSupported = useAppSelector(selectIsNetworkSupported);

  const handleConnect = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has(SHOW_CONNECT_PARAM)) {
      connect();
      setShouldRedirect(true);
      queryParams.delete(SHOW_CONNECT_PARAM);
      history.replace({ search: queryParams.toString() });
      setLocation(`${location.pathname}?${queryParams.toString()}`);
    }
  }, [location]);

  const handleLink = useCallback(() => {
    if (shouldRedirect && isNetworkSupported) {
      history.push(initialLocation);
      setShouldRedirect(false);
    }
  }, [shouldRedirect, initialLocation, isNetworkSupported]);

  useEffect(() => {
    if (userAddress) {
      handleLink();
    } else {
      handleConnect();
    }
  }, [userAddress, handleConnect, handleLink]);

  return null;
};

export default DeepLinking;
