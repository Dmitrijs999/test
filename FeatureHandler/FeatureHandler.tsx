import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { useGetFeaturesQuery } from 'features';
import {
  fetchFeaturesStart,
  fetchFeaturesSuccess,
  fetchFeaturesFailure,
} from 'features/featureFlags';

const FeaturesHandler: React.FC = () => {
  const dispatch = useDispatch();
  const { data: features, error } = useGetFeaturesQuery();

  useEffect(() => {
    dispatch(fetchFeaturesStart());
  }, [dispatch]);

  useEffect(() => {
    if (features) {
      dispatch(fetchFeaturesSuccess(features));
    } else if (error) {
      dispatch(fetchFeaturesFailure(error as string));
    }
  }, [dispatch, features, error]);

  return null;
};

export default FeaturesHandler;
