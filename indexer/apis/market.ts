import { indexerApi, TAGS } from './base';
import { MarketsData } from 'types';

export const marketApi = indexerApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarketsData: builder.query<MarketsData, void>({
      query: () => `markets`,
      providesTags: [{ type: TAGS.marketsData }],
      transformResponse: (response: MarketsData): MarketsData => {
        return {
          ...response,
          markets: response.markets.map((item) => ({
            ...item,
            meta: { ...item.meta, symbol: item.meta.symbol.toLowerCase() },
          })),
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetMarketsDataQuery } = marketApi;
