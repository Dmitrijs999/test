import { BigNumber, utils } from 'ethers';

import { indexerApi, TAGS } from './base';
import {
  IMntWithdraw,
  IMntWithdrawResponse,
  IMntStakeResponse,
  IMntStake,
  IMantleWithdraw,
  IMantleWithdrawResponse,
  IMantleStakeResponse,
  IMantleStake,
  BridgeMetadataResponse,
} from 'types';
import { MNT_DECIMALS, MANTLE_DECIMALS } from 'utils/constants';

export const mntApi = indexerApi.injectEndpoints({
  endpoints: (builder) => ({
    getMntWithdrawData: builder.query<IMntWithdraw, string>({
      query: (accountAddress) => `user/mnt/withdraw/${accountAddress}`,
      providesTags: [TAGS.mntWithdraw],
      transformResponse: (response: IMntWithdrawResponse): IMntWithdraw => {
        return {
          mntTotalBalance: BigNumber.from(response.mntTotalBalance ?? 0),
          userBuyBackStaked: BigNumber.from(response.userBuyBackStaked ?? 0),
          userMntAccruedDistribution: BigNumber.from(
            response.userMntAccruedDistribution ?? 0
          ),
          userVestingReleasable: BigNumber.from(
            response.userVestingReleasable ?? 0
          ),
          mntAvailableBalance: BigNumber.from(
            response.mntAvailableBalance ?? 0
          ),
          currentCooldownEnd: Number(response.currentCooldownEnd),
          currentCooldownStart: Number(response.currentCooldownStart),
          availableCharges: Number(response.availableCharges),
        };
      },
    }),
    getMantleWithdrawData: builder.query<IMantleWithdraw, string>({
      query: (accountAddress) => `user/mantle/withdraw/${accountAddress}`,
      providesTags: [TAGS.mantleWithdraw],
      transformResponse: (
        response: IMantleWithdrawResponse
      ): IMantleWithdraw => {
        return {
          userWithdrawableBalance: BigNumber.from(
            response?.userWithdrawableBalance
          ),
        };
      },
    }),
    getMntStakeData: builder.query<IMntStake, string>({
      query: (accountAddress) => `user/mnt/stake/${accountAddress}`,
      providesTags: [TAGS.mntStake],
      transformResponse: (response: IMntStakeResponse): IMntStake => {
        return {
          userMntUnderlyingBalance: utils.parseUnits(
            response.userMntUnderlyingBalance,
            MNT_DECIMALS
          ),
        };
      },
    }),
    getMantleStakeData: builder.query<IMantleStake, string>({
      query: (accountAddress) => `user/mantle/stake/${accountAddress}`,
      providesTags: [TAGS.mantleStake],
      transformResponse: (response: IMantleStakeResponse): IMantleStake => {
        return {
          userMantleUnderlyingBalance: utils.parseUnits(
            response.userMantleUnderlyingBalance,
            MANTLE_DECIMALS
          ),
        };
      },
    }),
    stakeMnt: builder.mutation({
      queryFn: () => ({ data: 'done' }),
      invalidatesTags: [TAGS.userData, TAGS.mntWithdraw, TAGS.mntStake],
    }),
    withdrawMantle: builder.mutation({
      queryFn: () => ({ data: 'done' }),
      invalidatesTags: [TAGS.userData, TAGS.mantleWithdraw, TAGS.mantleStake],
    }),
    setAutostaking: builder.mutation({
      queryFn: () => ({ data: 'done' }),
      invalidatesTags: [TAGS.userData],
    }),
    withdrawMnt: builder.mutation({
      queryFn: () => ({ data: 'done' }),
      invalidatesTags: [
        TAGS.mntWithdraw,
        TAGS.mntStake,
        TAGS.userData,
        TAGS.mntAPY,
      ],
    }),
    getMintyBridgeMetadata: builder.mutation<
      BridgeMetadataResponse,
      {
        accountAddress: string;
        dstNetwork: string;
        transferAmount: string;
      }
    >({
      query: ({ accountAddress, dstNetwork, transferAmount }) => ({
        url: `utils/minty-bridge-metadata?from=${accountAddress}&to=${accountAddress}&dstNetwork=${dstNetwork}&transferAmount=${transferAmount}`,
      }),
      invalidatesTags: [TAGS.mintyBridge],
    }),
  }),
  overrideExisting: false,
});

export const {
  useStakeMntMutation,
  useGetMintyBridgeMetadataMutation,
  useSetAutostakingMutation,
  useWithdrawMntMutation,
  useWithdrawMantleMutation,
  useGetMntWithdrawDataQuery,
  useGetMntStakeDataQuery,
  useGetMantleWithdrawDataQuery,
  useGetMantleStakeDataQuery,
} = mntApi;
