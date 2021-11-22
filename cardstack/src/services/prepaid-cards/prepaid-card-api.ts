import { getSDK } from '@cardstack/cardpay-sdk';
import { CacheTags, safesApi } from '../safes-api';
import HDProvider from '@cardstack/models/hd-provider';
import Web3Instance from '@cardstack/models/web3-instance';

const prepaidCardApi = safesApi.injectEndpoints({
  endpoints: builder => ({
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
      invalidatesTags: [CacheTags.SAFES],
    }),
  }),
});

export const { usePayMerchantMutation } = prepaidCardApi;
