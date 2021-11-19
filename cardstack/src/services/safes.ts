import { getSDK } from '@cardstack/cardpay-sdk';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { fetchSafes } from './gnosis-service';
import HDProvider from '@cardstack/models/hd-provider';
import Web3Instance from '@cardstack/models/web3-instance';
import { TokenType } from '@cardstack/types';

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
        try {
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

          return { data: receipt };
        } catch (error) {
          return {
            error: { status: 418, data: error },
          };
        }
      },
      invalidatesTags: ['SAFES'],
    }),
    claimRevenue: builder.mutation<any, any>({
      async queryFn({
        selectedWallet,
        network,
        accountAddress,
        revenueBalances,
        merchantSafeAddress,
      }) {
        try {
          const web3 = await Web3Instance.get({
            selectedWallet,
            network,
          });

          const revenuePool = await getSDK('RevenuePool', web3);

          const promises = revenueBalances.map(async (token: TokenType) => {
            const claimEstimateAmount = Web3.utils.toWei(
              new BigNumber(token.balance.amount)
                .div(new BigNumber('2'))
                .toPrecision(8)
                .toString()
            );

            const gasEstimate = await revenuePool.claimGasEstimate(
              merchantSafeAddress,
              token.tokenAddress,
              // divide amount by 2 for estimate since we can't estimate the full amount
              // and the amount doesn't affect the gas price
              claimEstimateAmount
            );

            const claimAmount = new BigNumber(
              Web3.utils.toWei(token.balance.amount)
            )
              .minus(new BigNumber(gasEstimate))
              .toString();

            await revenuePool.claim(
              merchantSafeAddress,
              token.tokenAddress,
              claimAmount,
              undefined,
              { from: accountAddress }
            );
          });

          const response = await Promise.all(promises);

          // resets signed provider and web3 instance to kill poller
          await HDProvider.reset();

          // TODO: create wrapper to data and error
          return { data: response };
        } catch (error) {
          return { error: { status: 418, data: error } };
        }
      },
      invalidatesTags: ['SAFES'],
    }),
  }),
});

export const {
  useGetSafesDataQuery,
  usePayMerchantMutation,
  useClaimRevenueMutation,
} = safesApi;
