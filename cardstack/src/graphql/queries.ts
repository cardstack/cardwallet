import { gql } from '@apollo/client';

export const getTransactionHistoryData = gql`
  query GetTransactionHistoryData($address: String!) {
    account(id: $address) {
      id
      createdPrepaidCards(first: 5) {
        issuer {
          id
        }
        transaction {
          id
        }
        createdAt
        issuingToken
        issuingTokenAmount
        spendAmount
        prepaidCard {
          id
        }
      }
      receivedBridgedTokens(first: 5) {
        depot {
          id
        }
        transaction {
          id
        }
        amount
        token
        timestamp
      }
      receivedTokens(first: 5) {
        from {
          id
        }
        to {
          id
        }
        timestamp
        token {
          id
        }
        amount
      }
    }
  }
`;
