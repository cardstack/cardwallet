import {
  MerchantClaimFragment,
  PrepaidCardPaymentFragment,
} from '@cardstack/graphql';

export const MERCHANT_CLAIM_MOCK_DATA: MerchantClaimFragment = {
  __typename: 'MerchantClaim',
  amount: '0',
  id: '0x245fe1637c6fc77ccb7c35f3d387f2c0e5fea1abfd9d788c988dca6a9770a8bf',
  timestamp: '1630108305',
  token: {
    __typename: 'Token',
    decimals: '18',
    id: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
    name: 'Dai Stablecoin.CPXD',
    symbol: 'DAI',
  },
  transaction: {
    __typename: 'Transaction',
    id: '0x245fe1637c6fc77ccb7c35f3d387f2c0e5fea1abfd9d788c988dca6a9770a8bf',
    tokenTransfers: [
      {
        __typename: 'TokenTransfer',
        amount: '0',
        fromTokenHolder: {
          __typename: 'TokenHolder',
          id:
            '0xfD59940a9789E161217A853F3D78ec619247ADb7-0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        },
        toTokenHolder: {
          __typename: 'TokenHolder',
          id:
            '0x9Ed84407e5ed5B7c0323E5653A06F4528357e3B5-0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        },
        token: {
          __typename: 'Token',
          symbol: 'DAI',
        },
      },
      {
        __typename: 'TokenTransfer',
        amount: '97407000000000',
        fromTokenHolder: {
          __typename: 'TokenHolder',
          id:
            '0x9Ed84407e5ed5B7c0323E5653A06F4528357e3B5-0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        },
        toTokenHolder: {
          __typename: 'TokenHolder',
          id:
            '0xD7182E380b7dFa33C186358De7E1E5d0950fCAE7-0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        },
        token: {
          __typename: 'Token',
          symbol: 'DAI',
        },
      },
    ],
  },
};

export const MERCHANT_EARNED_MOCK_DATA: PrepaidCardPaymentFragment = {
  __typename: 'PrepaidCardPayment',
  id: '0x13b5bb885089e05bac61857d259c8bb590375dc1cc806f4ed53a312e6e211472',
  issuingToken: {
    __typename: 'Token',
    id: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
    name: 'Dai Stablecoin.CPXD',
    symbol: 'DAI',
  },
  issuingTokenAmount: '499001996007984031',
  issuingTokenUSDPrice: '1.002',
  merchantSafe: {
    __typename: 'MerchantSafe',
    id: '0x9Ed84407e5ed5B7c0323E5653A06F4528357e3B5',
  },
  prepaidCard: {
    __typename: 'PrepaidCard',
    customizationDID: 'c6f4d200-e879-49c2-abdf-432693fd18c3',
    id: '0x72DB39da38fa313A004770E8C4d9416428068024',
  },
  spendAmount: '50',
  timestamp: '1629406705',
  transaction: {
    __typename: 'Transaction',
    merchantFeePayments: [
      {
        __typename: 'MerchantFeePayment',
        feeCollected: '2495009980039920',
        issuingToken: {
          __typename: 'Token',
          symbol: 'DAI',
        },
      },
    ],
  },
};
