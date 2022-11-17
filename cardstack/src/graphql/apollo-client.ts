import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';

import { NetworkType } from '@cardstack/types';

const gnosisLink = new HttpLink({
  uri: getConstantByNetwork('subgraphURL', NetworkType.gnosis),
});

const sokolLink = new HttpLink({
  uri: getConstantByNetwork('subgraphURL', NetworkType.sokol),
});

const cache = new InMemoryCache({
  typePolicies: {
    Account: {
      fields: {
        transactions: {
          keyArgs: false,
          merge(existing = [], incoming, { args }) {
            // Initial fetch/refetch
            if (!args?.skip) {
              return incoming;
            }

            // Pagination
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

const link = ApolloLink.split(
  operation => operation.getContext().network === NetworkType.gnosis,
  gnosisLink,
  sokolLink
);

export const apolloClient = new ApolloClient({
  cache,
  link,
});
