import { createApi } from '@reduxjs/toolkit/query/react';

import { resolverQuery } from 'features/queries';
import { ContractAddressesResponse, BenchmarkCostsResponse } from 'types';

export const networkApi = createApi({
  reducerPath: 'networkApi',
  baseQuery: resolverQuery,
  endpoints: (builder) => ({
    addresses: builder.query<ContractAddressesResponse, void>({
      query: () => `addresses.json`,
    }),
    benchmarkCosts: builder.query<BenchmarkCostsResponse, void>({
      query: () => `gas-costs.json`,
    }),
  }),
});

export const { useAddressesQuery, useBenchmarkCostsQuery } = networkApi;
