import { TransactionReceipt } from 'web3-eth';
import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';
import {
  PrepaidCardPayMerchantQueryParams,
  PrepaidCardSafeQueryParams,
  PrepaidCardsQueryResult,
} from './prepaid-card-types';
import { fetchPrepaidCards, payMerchant } from './prepaid-card-service';

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

    payMerchant: builder.mutation<
      TransactionReceipt,
      PrepaidCardPayMerchantQueryParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          TransactionReceipt,
          PrepaidCardPayMerchantQueryParams
        >(payMerchant, params, {
          errorLogMessage: 'Error while paying merchant',
          resetHdProvider: true,
        });
      },
      invalidatesTags: [CacheTags.SAFES],
    }),
  }),
});

export const {
  usePayMerchantMutation,
  useGetPrepaidCardsQuery,
} = prepaidCardApi;
