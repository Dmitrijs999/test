import { createApi } from '@reduxjs/toolkit/query/react';

import { offchainerQuery } from 'features/queries';
import { WalletProviders, DeviceType } from 'types';

export const offchainApi = createApi({
  reducerPath: 'offchainApi',
  baseQuery: offchainerQuery,
  endpoints: (builder) => ({
    saveSession: builder.mutation<
      void,
      {
        accountAddress: string;
        walletType: WalletProviders;
        deviceType: DeviceType;
      }
    >({
      query: ({ accountAddress, walletType, deviceType }) => ({
        url: `user/session/${accountAddress}/${walletType.toLowerCase()}/${deviceType}`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useSaveSessionMutation } = offchainApi;
