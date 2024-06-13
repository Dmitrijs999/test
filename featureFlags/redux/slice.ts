import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FeatureFlagsState, Feature } from 'types';

const initialState: FeatureFlagsState = {
  features: [],
  isLoading: false,
  error: null,
};
const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    fetchFeaturesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchFeaturesSuccess(state, action: PayloadAction<Feature[]>) {
      state.features = action.payload;
      state.isLoading = false;
    },
    fetchFeaturesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

const { actions, reducer } = featuresSlice;

export const FeatureFlagsReducer = reducer;
export const {
  fetchFeaturesStart,
  fetchFeaturesSuccess,
  fetchFeaturesFailure,
} = actions;

export default FeatureFlagsReducer;
