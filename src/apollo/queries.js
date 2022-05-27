import gql from 'graphql-tag';

export const COMPOUND_ACCOUNT_AND_MARKET_QUERY = gql`
  query account($id: ID!) {
    markets {
      exchangeRate
      id
      name
      supplyRate
      symbol
      underlyingAddress
      underlyingName
      underlyingSymbol
      underlyingDecimals
      underlyingPrice
    }
    account(id: $id) {
      id
      tokens(where: { cTokenBalance_gt: 0 }) {
        cTokenBalance
        id
        lifetimeSupplyInterestAccrued
        supplyBalanceUnderlying
        symbol
        totalUnderlyingSupplied
      }
    }
  }
`;
