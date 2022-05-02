import { TransactionReceipt } from 'web3-eth';

import { CacheTags, safesApi } from '../safes-api';
import { queryPromiseWrapper } from '../utils';

import {
  fetchPrepaidCards,
  payMerchant,
  transferPrepaidCard,
} from './prepaid-card-service';
import {
  PrepaidCardPayMerchantQueryParams,
  PrepaidCardSafeQueryParams,
  PrepaidCardsQueryResult,
  PrepaidCardTransferQueryParams,
} from './prepaid-card-types';

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
          resetHdProvider: false,
        });
      },
      invalidatesTags: [CacheTags.SAFES],
    }),
    transferPrepaidCard: builder.mutation<
      TransactionReceipt,
      PrepaidCardTransferQueryParams
    >({
      async queryFn(params) {
        return queryPromiseWrapper<
          TransactionReceipt,
          PrepaidCardTransferQueryParams
        >(transferPrepaidCard, params, {
          errorLogMessage: 'Error while transferring prepaid card',
          resetHdProvider: false,
        });
      },
      invalidatesTags: [CacheTags.SAFES],
    }),
  }),
});

export const {
  usePayMerchantMutation,
  useGetPrepaidCardsQuery,
  useTransferPrepaidCardMutation,
} = prepaidCardApi;
