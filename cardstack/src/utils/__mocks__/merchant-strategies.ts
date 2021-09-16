import {
  MerchantClaimFragment,
  PrepaidCardPaymentFragment,
} from '@cardstack/graphql';

export const MERCHANT_CLAIM_MOCK_DATA: MerchantClaimFragment = {
  __typename: 'MerchantClaim',
  amount: '0',
  id: '0x245fe1637c6fc77ccb7c35f3d387f2c0e5fea1abfd9d788c988dca6a9770a8bf',
  timestamp: '1630108305',
  merchantSafe: {
    id: '0x245fe1637c6e767ccb7c35f3d387f2c0e5fea1abfd9d788c988dca6a9770a8bf',
    infoDid: undefined,
  },
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

export const MERCHANT_EARNED_SPEND_MOCK_DATA = {
  __typename: 'MerchantRevenueEvent',
  historicLifetimeAccumulation: '1497005988023952095',
  historicUnclaimedBalance: '1489520958083832335',
  id: '0x5293d95a240c231852724fd31ff6df119e5b5cf7661a7aec38f7cf10893dc2eb',
  timestamp: '1629156260',
  prepaidCardPayments: [
    {
      __typename: 'PrepaidCardPayment',
      id: '0x5293d95a240c231852724fd31ff6df119e5b5cf7661a7aec38f7cf10893dc2eb',
      issuingToken: {
        __typename: 'Token',
        id: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        name: 'Dai Stablecoin.CPXD',
        symbol: 'DAI',
      },
      issuingTokenAmount: '1497005988023952095',
      issuingTokenUSDPrice: '1.002',
      merchantSafe: {
        __typename: 'MerchantSafe',
        id: '0xcba12315cc838375F0e1E9a9f5b2aFE0196B07B6',
        infoDid: '3a13a41e-e44a-4b0f-b079-2d3d53571870',
      },
      prepaidCard: {
        __typename: 'PrepaidCard',
        customizationDID: 'c6f4d200-e879-49c2-abdf-432693fd18c3',
        id: '0x72DB39da38fa313A004770E8C4d9416428068024',
      },
      spendAmount: '150',
      timestamp: '1629156260',
      transaction: {
        __typename: 'Transaction',
        merchantFeePayments: [
          {
            __typename: 'MerchantFeePayment',
            feeCollected: '7485029940119760',
            issuingToken: { __typename: 'Token', symbol: 'DAI' },
          },
        ],
      },
    },
  ],
  merchantClaims: [null],
};

export const PREPAID_CARD_PAYMENT_MOCK = {
  __typename: 'Transaction',
  bridgeToLayer1Events: [],
  bridgeToLayer2Events: [],
  id: '0x7e3d3ad2b3cc284a96339b0f0e0a2eabce1fc7a8438858b358aa2cbd55cef333',
  merchantClaims: [],
  merchantCreations: [
    {
      __typename: 'MerchantCreation',
      createdAt: '1629411270',
      id: '0x8de5D051565dF590A92f00a57B6d24609a17BC01',
      merchantSafe: { __typename: 'MerchantSafe', infoDid: 'merchant18989898' },
    },
  ],
  merchantFeePayments: [],
  merchantRegistrationPayments: [
    {
      __typename: 'MerchantRegistrationPayment',
      id: '0x7e3d3ad2b3cc284a96339b0f0e0a2eabce1fc7a8438858b358aa2cbd55cef333',
    },
  ],
  prepaidCardCreations: [],
  prepaidCardPayments: [
    {
      __typename: 'PrepaidCardPayment',
      id: '0x7e3d3ad2b3cc284a96339b0f0e0a2eabce1fc7a8438858b358aa2cbd55cef333',
      issuingToken: {
        __typename: 'Token',
        id: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        name: 'Dai Stablecoin.CPXD',
        symbol: 'DAI',
      },
      issuingTokenAmount: '998003992015968063',
      issuingTokenUSDPrice: '1.002',
      merchantSafe: {
        __typename: 'MerchantSafe',
        id: '0x9Ed84407e5ed5B7c0323E5653A06F4528357e3B5',
        infoDid: '3a13a41e-e44a-4b0f-b079-2d3d53571870',
      },
      prepaidCard: {
        __typename: 'PrepaidCard',
        customizationDID:
          'did:cardstack:1p3fJF6oNCLEz1xhCLYYWq59b05d0d718792153b',
        id: '0x35Ae15dCEB6930756A59EfcC2169d2b834CdD371',
      },
      spendAmount: '100',
      timestamp: '1629411270',
      transaction: { __typename: 'Transaction', merchantFeePayments: [] },
    },
  ],
  prepaidCardSplits: [],
  prepaidCardTransfers: [],
  spendAccumulations: [],
  supplierInfoDIDUpdates: [],
  timestamp: '1629411270',
  tokenSwaps: [],
  tokenTransfers: [
    {
      __typename: 'TokenTransfer',
      amount: '998003992015968063',
      from: '0x35Ae15dCEB6930756A59EfcC2169d2b834CdD371',
      id:
        '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1-0x7e3d3ad2b3cc284a96339b0f0e0a2eabce1fc7a8438858b358aa2cbd55cef333-0',
      timestamp: '1629411270',
      to: '0xaE5AC3685630b33Ed2677438EEaAe0aD5372c795',
      token: {
        __typename: 'Token',
        id: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        name: 'Dai Stablecoin.CPXD',
        symbol: 'DAI',
      },
    },
    {
      __typename: 'TokenTransfer',
      amount: '998003992015968063',
      from: '0xaE5AC3685630b33Ed2677438EEaAe0aD5372c795',
      id:
        '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1-0x7e3d3ad2b3cc284a96339b0f0e0a2eabce1fc7a8438858b358aa2cbd55cef333-2',
      timestamp: '1629411270',
      to: '0xc267d67cDbb5aCC6f477D4eAb173Dcc54F00e762',
      token: {
        __typename: 'Token',
        id: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        name: 'Dai Stablecoin.CPXD',
        symbol: 'DAI',
      },
    },
    {
      __typename: 'TokenTransfer',
      amount: '998003992015968063',
      from: '0xc267d67cDbb5aCC6f477D4eAb173Dcc54F00e762',
      id:
        '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1-0x7e3d3ad2b3cc284a96339b0f0e0a2eabce1fc7a8438858b358aa2cbd55cef333-4',
      timestamp: '1629411270',
      to: '0x09FBEDDc5f94fA2713CDa75A68457cA8A4527adf',
      token: {
        __typename: 'Token',
        id: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        name: 'Dai Stablecoin.CPXD',
        symbol: 'DAI',
      },
    },
  ],
};
