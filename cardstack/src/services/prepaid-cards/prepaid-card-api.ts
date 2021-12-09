import { getSDK } from '@cardstack/cardpay-sdk';
import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';
import {
  PrepaidCardSafeQueryParams,
  PrepaidCardsQueryResult,
} from './prepaid-card-types';
import { fetchPrepaidCards } from './prepaid-card-service';
import HDProvider from '@cardstack/models/hd-provider';
import Web3Instance from '@cardstack/models/web3-instance';

const prepaidCardApi = safesApi.injectEndpoints({
  endpoints: builder => ({
    getPrepaidCards: builder.query<
      PrepaidCardsQueryResult,
      PrepaidCardSafeQueryParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          PrepaidCardsQueryResult,
          PrepaidCardSafeQueryParams
        >(fetchPrepaidCards, params, {
          errorLogMessage: 'Error fetching prepaidCards',
        });
      },
      providesTags: [CacheTags.PREPAID_CARDS],
    }),
    // TODO: Add right types, and extract to prepaid-card-service service
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
            walletId: selectedWallet.id || '',
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
      invalidatesTags: [CacheTags.SAFES],
    }),
  }),
});

export const {
  usePayMerchantMutation,
  useGetPrepaidCardsQuery,
} = prepaidCardApi;
