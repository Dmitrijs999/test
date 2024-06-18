import { BigNumber, utils } from 'ethers';
import { DateTime } from 'luxon';

import { indexerApi, TAGS } from './base';
import {
  UserNFTResponse,
  EventHistoryResponseItem,
  IEventHistoryItem,
  IBDRAgreement,
  UserData,
  BridgeMetadataResponse,
  IEventHistoryItemExt,
  EventHistoryResponseItemExt,
} from 'types';

export const userApi = indexerApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserBorrowBalance: builder.query<
      BigNumber,
      { accountAddress: string; marketSymbol: string }
    >({
      query: ({ accountAddress, marketSymbol }) =>
        `user/market/${marketSymbol}/balance/borrow/${accountAddress}`,
      providesTags: [TAGS.userData],
      transformResponse: (response: { balance: string }): BigNumber => {
        return BigNumber.from(response.balance);
      },
    }),
    getUserTokenBalance: builder.query<
      BigNumber,
      { accountAddress: string; tokenSymbol: string }
    >({
      query: ({ accountAddress, tokenSymbol }) =>
        `user/token/${tokenSymbol}/balance/${accountAddress}`,
      providesTags: [TAGS.userData],
      transformResponse: (response: { balance: string }): BigNumber => {
        return BigNumber.from(response.balance);
      },
    }),

    getUserDashboardAvailable: builder.query<boolean, string>({
      query: (accountAddress) => `user/dashboard/available/${accountAddress}`,
      providesTags: [TAGS.userData],
    }),
    getUserData: builder.query<UserData, { accountAddress: string }>({
      query: ({ accountAddress }) => `user/data/${accountAddress}`,
      providesTags: [TAGS.userData],
    }),
    getUserNFT: builder.query<UserNFTResponse[], string>({
      query: (accountAddress) => `user/nft/all/${accountAddress}`,
      // todo check if this tag is needed, in once integrated
      providesTags: [TAGS.userNft],
    }),
    getNftBridgeMetadata: builder.query<
      BridgeMetadataResponse,
      {
        accountAddress: string;
        dstNetwork: string;
        tokenId: number;
        tokenTier: number;
      }
    >({
      query: ({ accountAddress, dstNetwork, tokenId, tokenTier }) =>
        `utils/nft-bridge-metadata?from=${accountAddress}&to=${accountAddress}&dstNetwork=${dstNetwork}&tokenId=${tokenId}&tokenTier=${tokenTier}`,
      // todo check if this tag is needed, in once integrated
      providesTags: [TAGS.userNft],
    }),
    getUserBDRAgreements: builder.query<IBDRAgreement[], string>({
      query: (accountAddress) => `user/bdr/agreements/${accountAddress}`,
      providesTags: [TAGS.userBDRAgreements],
    }),
    getUserTransactionHistory: builder.query<
      { items: IEventHistoryItem[]; count: number },
      {
        accountAddress: string;
        symbol: string;
        orderBy: string;
        orderDirection: string;
        skip: number;
        limit: number;
      }
    >({
      query: ({
        accountAddress,
        symbol,
        orderBy,
        orderDirection,
        skip,
        limit,
      }) =>
        `user/transactions/${symbol}/${accountAddress}?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`,
      providesTags: [TAGS.transactionHistory],
      transformResponse: (response: {
        items: EventHistoryResponseItem[];
        count: number;
      }): { count: number; items: IEventHistoryItem[] } => {
        return {
          count: response.count,
          items: response.items.map((i) => ({
            id: i.tx_hash + '-' + i.type, //Used by DOME, should be unique, pair (tx, type) is unique
            txHash: i.tx_hash,
            type: i.type,
            date: DateTime.fromSeconds(Number(i.timestamp)).toLocaleString(
              DateTime.DATE_MED
            ),
            time: DateTime.fromSeconds(Number(i.timestamp)).toLocaleString(
              DateTime.TIME_24_SIMPLE
            ),
            underlyingDecimals: i.underlying_decimals,
            amount: i.amount
              ? utils.formatUnits(i.amount, i.underlying_decimals)
              : null,
            amountUsd: i.amount_usd ? utils.formatUnits(i.amount_usd) : null,
          })),
        };
      },
    }),
    getUserTransactionHistoryAllMarkets: builder.query<
      { items: IEventHistoryItemExt[]; count: number },
      {
        accountAddress: string;
        orderBy: string;
        orderDirection: string;
        skip: number;
        limit: number;
      }
    >({
      query: ({ accountAddress, orderBy, orderDirection, skip, limit }) =>
        `user/transactions/${accountAddress}?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`,
      providesTags: [TAGS.transactionHistory],
      transformResponse: (response: {
        items: EventHistoryResponseItemExt[];
        count: number;
      }): { count: number; items: IEventHistoryItemExt[] } => {
        return {
          count: response.count,
          items: response.items.map((i) => ({
            id: i.tx_hash + '-' + i.type, //Used by DOME, should be unique, pair (tx, type) is unique
            txHash: i.tx_hash,
            type: i.type,
            date: DateTime.fromSeconds(Number(i.timestamp)).toLocaleString(
              DateTime.DATE_MED
            ),
            time: DateTime.fromSeconds(Number(i.timestamp)).toLocaleString(
              DateTime.TIME_24_SIMPLE
            ),
            underlyingDecimals: i.underlying_decimals,
            amount: i.amount
              ? utils.formatUnits(i.amount, i.underlying_decimals)
              : null,
            amountUsd: i.amount_usd ? utils.formatUnits(i.amount_usd) : null,
            tokenSymbol: i.token_symbol,
          })),
        };
      },
    }),
    getLiquidityProviderAgreement: builder.query<IBDRAgreement, string>({
      query: (accountAddress) => `user/bdr/lp/${accountAddress}`,
      providesTags: [TAGS.liquidityProviderAgreement],
    }),
    collateral: builder.mutation({
      queryFn: () => ({ data: 'done' }),
      invalidatesTags: [TAGS.userData],
    }),
    getLiquidationNotificationStatus: builder.query<boolean, string>({
      query: (accountAddress) =>
        `user/notifications/liquidation/${accountAddress}`,
      providesTags: [TAGS.liquidationNotification],
      transformResponse: (response: { newNotification: boolean }): boolean => {
        return response.newNotification;
      },
    }),
    setLiquidationNotificationStatusRead: builder.mutation<void, string>({
      query: (accountAddress) => ({
        url: `user/notifications/liquidation/${accountAddress}`,
        method: 'PATCH',
      }),
      invalidatesTags: [TAGS.liquidationNotification],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCollateralMutation,
  useGetUserDashboardAvailableQuery,
  useGetUserDataQuery,
  useGetUserNFTQuery,
  useGetUserTransactionHistoryQuery,
  useGetLiquidityProviderAgreementQuery,
  useGetUserBDRAgreementsQuery,
  useGetNftBridgeMetadataQuery,
  useGetUserTokenBalanceQuery,
  useGetUserBorrowBalanceQuery,
  useGetLiquidationNotificationStatusQuery,
  useSetLiquidationNotificationStatusReadMutation,
  useGetUserTransactionHistoryAllMarketsQuery,
} = userApi;
