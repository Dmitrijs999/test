import { indexerApi, TAGS } from './base';
import { OnlyPositive } from 'utils';

const basicOperationsApi = indexerApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionMaxValue: builder.query<
      { userValue: bigint; transactionValue: bigint },
      {
        accountAddress: string;
        operationType: string;
        symbol: string;
        tokenSymbol: string;
      }
    >({
      query: ({ symbol, accountAddress, operationType, tokenSymbol }) => {
        return `user/max/${symbol}/${tokenSymbol}/${operationType}/${accountAddress}`;
      },
      providesTags: [TAGS.maxValue],
      transformResponse: (response: {
        userValue: string;
        transactionValue: string;
      }): { userValue: bigint; transactionValue: bigint } => {
        return {
          userValue: OnlyPositive(BigInt(response.userValue)),
          transactionValue: OnlyPositive(BigInt(response.transactionValue)),
        };
      },
    }),
    basicOperation: builder.mutation<
      string,
      {
        accountAddress: string;
        symbol: string;
      }
    >({
      queryFn: () => ({ data: 'done' }),
      invalidatesTags: (res, err, args) => [
        TAGS.userData,
        TAGS.marketsData,
        TAGS.oraclePrices,
        TAGS.transactionHistory,
        {
          type: TAGS.yieldPercent,
          account: args.accountAddress,
          symbol: args.symbol,
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const { useGetTransactionMaxValueQuery, useBasicOperationMutation } =
  basicOperationsApi;
