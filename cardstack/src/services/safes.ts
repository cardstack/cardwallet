import { getSDK } from '@cardstack/cardpay-sdk';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchSafes } from './gnosis-service';
import HDProvider from '@cardstack/models/hd-provider';
import Web3Instance from '@cardstack/models/web3-instance';

export const safesApi = createApi({
  reducerPath: 'safesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['SAFES'],
  endpoints: builder => ({
    // TODO: Add right return type
    getSafesData: builder.query<
      any,
      { address: string; nativeCurrency: NativeCurrency }
    >({
      async queryFn({ address, nativeCurrency = NativeCurrency.USD }) {
        return await fetchSafes(address, nativeCurrency);
      },
      providesTags: ['SAFES'],
    }),
    // TODO: Add right types, split endpoints and extract to own service
    payMerchant: builder.mutation<any, any>({
      async queryFn({
        selectedWallet,
        network,
        merchantAddress,
        prepaidCardAddress,
        spendAmount,
        accountAddress,
      }) {
        const web3 = await Web3Instance.get({
          selectedWallet,
          network,
        });

        const prepaidCardInstance = await getSDK('PrepaidCard', web3);

        const receipt = await prepaidCardInstance.payMerchant(
          merchantAddress,
          prepaidCardAddress,
          spendAmount,
          undefined,
          { from: accountAddress }
        );

        await HDProvider.reset();

        // TODO: create wrapper to data and error
        return receipt
          ? { data: receipt }
          : { error: { status: 418, data: '' } };
      },
      invalidatesTags: ['SAFES'],
    }),
  }),
});

export const { useGetSafesDataQuery, usePayMerchantMutation } = safesApi;
