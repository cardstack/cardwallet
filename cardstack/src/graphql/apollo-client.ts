import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const sokolClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri:
      'https://api.thegraph.com/subgraphs/name/habdelra/cardpay-sokol-ver-0_6_0',
  }),
});
