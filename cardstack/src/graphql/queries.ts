import { gql } from '@apollo/client';

export const getTransactionHistoryData = gql`
  query GetTransactionHistoryData($address: String!) {
    account(id: $address) {
      id
      createdPrepaidCards(first: 5) {
        issuer {
          id
        }
        createdAt
        issuingToken
        spendAmount
        creationGasFeeCollected
        prepaidCard {
          customizationDID
          reloadable
          owner {
            id
          }
        }
        transaction {
          safeTxns {
            safe {
              id
            }
            to
            value
            timestamp
          }
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
