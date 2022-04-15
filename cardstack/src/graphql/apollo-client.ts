import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';

import { networkTypes } from '@rainbow-me/networkTypes';

const xdaiLink = new HttpLink({
  uri: getConstantByNetwork('subgraphURL', networkTypes.xdai),
});

const sokolLink = new HttpLink({
  uri: getConstantByNetwork('subgraphURL', networkTypes.sokol),
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
  operation => operation.getContext().network === networkTypes.xdai,
  xdaiLink,
  sokolLink
);

export const apolloClient = new ApolloClient({
  cache,
  link,
});
