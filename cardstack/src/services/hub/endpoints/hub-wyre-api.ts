import { CustodialWallet } from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { hubApi } from '../hub-api';
import { GetCustodialWalletQueryResult } from '../hub-types';

const routes = {
  custodialWallet: '/custodial-wallet',
};

export const hubWyre = hubApi.injectEndpoints({
  endpoints: builder => ({
    getCustodialWallet: builder.query<GetCustodialWalletQueryResult, void>({
      query: () => routes.custodialWallet,
      transformResponse: (response: { data: CustodialWallet }) =>
        transformObjKeysToCamelCase(response?.data?.attributes),
    }),
  }),
});

export const { useGetCustodialWalletQuery } = hubWyre;
