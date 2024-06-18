import {
  MiddleValueOfGBaseFeePerGas,
  GetGasPriceResponse,
  PausedOperation,
  OraclePricesResponse,
  Feature,
} from '@src/types';

import { indexerApi, TAGS } from './base';

const utilityApi = indexerApi.injectEndpoints({
  endpoints: (builder) => ({
    getGasPrice: builder.query<MiddleValueOfGBaseFeePerGas, void>({
      query: () => `utils/gas-fee`,
      providesTags: [{ type: TAGS.gasHistory }],
      transformResponse: (
        response: GetGasPriceResponse
      ): MiddleValueOfGBaseFeePerGas => {
        return {
          middleValue:
            response.baseFeePerGas
              .map((item) => +item)
              .reduce((a, b) => a + b) / response.baseFeePerGas.length,
        };
      },
    }),
    getPausedOperations: builder.query<PausedOperation[], void>({
      query: () => `utils/op-paused`,
      providesTags: [{ type: TAGS.pausedOperations }],
    }),
    getOraclePrices: builder.query<OraclePricesResponse, void>({
      query: () => `utils/oracle-price`,
      providesTags: [{ type: TAGS.oraclePrices }],
      transformResponse: (
        response: OraclePricesResponse
      ): OraclePricesResponse => {
        return {
          ...response,
          markets: response.markets.map((i) => ({
            ...i,
            symbol: i.symbol.toLowerCase(),
          })),
        };
      },
    }),
    getFeatures: builder.query<Feature[], void>({
      query: () => `utils/features`,
      providesTags: [{ type: TAGS.features }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetOraclePricesQuery,
  useGetGasPriceQuery,
  useGetPausedOperationsQuery,
  useGetFeaturesQuery,
} = utilityApi;
