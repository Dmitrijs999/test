import { indexerApi, TAGS } from './base';
import {
  ChartTimeFrame,
  ITotalReturns,
  IYield,
  ILendBorrowChart,
  ITotalNetApy,
} from 'types';

const charts = indexerApi.injectEndpoints({
  endpoints: (builder) => ({
    getInterestRateChartData: builder.query<ILendBorrowChart, string>({
      query: (symbol) => `charts/interest-rate/${symbol}`,
      providesTags: [{ type: TAGS.interestRateChart }],
    }),
    getUtilizationChartData: builder.query<ILendBorrowChart, string>({
      query: (symbol) => `charts/utilization-history/${symbol}`,
      providesTags: [{ type: TAGS.utilizationChart }],
    }),
    getHistoryYieldData: builder.query<
      ILendBorrowChart,
      { symbol: string; frame: ChartTimeFrame }
    >({
      query: ({ symbol, frame }) => {
        return `charts/historical-yield/${symbol}?period=${frame}`;
      },
      providesTags: [{ type: TAGS.historyChart }],
    }),
    getTotalReturnsData: builder.query<
      ITotalReturns,
      { address: string; frame: ChartTimeFrame }
    >({
      query: ({ frame, address }) => {
        return `charts/total-returns/${address}?period=${frame}`;
      },
      providesTags: [{ type: TAGS.totalReturnsChart }],
    }),
    getTotalNetAPYData: builder.query<
      ITotalNetApy,
      { address: string; frame: ChartTimeFrame }
    >({
      query: ({ frame, address }) => {
        return `charts/total-net-apy/${address}?period=${frame}`;
      },
      providesTags: [{ type: TAGS.totalReturnsChart }],
    }),
    getYieldPercentData: builder.query<
      IYield,
      { address: string; symbol: string; frame: ChartTimeFrame }
    >({
      query: ({ address, symbol, frame }) => {
        return `charts/yield-percent/${address}/${symbol}?period=${frame}`;
      },
      providesTags: (result, error, args) => [
        { type: TAGS.yieldPercent, address: args.address, symbol: args.symbol },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInterestRateChartDataQuery,
  useGetUtilizationChartDataQuery,
  useGetHistoryYieldDataQuery,
  useGetTotalReturnsDataQuery,
  useGetTotalNetAPYDataQuery,
  useGetYieldPercentDataQuery,
} = charts;
