// Assets and Safes mock data
const assets = [
  {
    asset: {
      id: 'spoa',
      address: 'spoa',
      coingecko_id: 'spoa',
      decimals: 18,
      icon_url: 'https://s3.amazonaws.com/icons.assets/ETH.png',
      name: 'Spoa',
      price: {
        changed_at: 1582568575,
        relative_change_24h: -4.586615622469276,
        value: 259.2,
      },
      symbol: 'SPOA',
      balance: {
        amount: '',
        display: '',
      },
    },
  },
  {
    asset: {
      id: '0x6B78C121bBd10D8ef0dd3623CC1abB077b186F65',
      address: '0x6B78C121bBd10D8ef0dd3623CC1abB077b186F65',
      coingecko_id: null,
      decimals: 18,
      icon_url: 'https://s3.amazonaws.com/icons.assets/ETH.png',
      name: 'Dominic',
      price: {
        changed_at: 0,
        relative_change_24h: 0,
        value: 0,
      },
      balance: {
        amount: '',
        display: '',
      },
      symbol: 'DOM',
    },
  },
  {
    asset: {
      id: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
      address: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
      coingecko_id: 'dai',
      decimals: 18,
      icon_url:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      name: 'DAI.CPXD',
      price: {
        changed_at: 0,
        relative_change_24h: 0,
        value: 0,
      },
      balance: {
        amount: '',
        display: '',
      },
      symbol: 'DAI.CPXD',
    },
  },
  {
    asset: {
      id: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
      address: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
      coingecko_id: null,
      decimals: 18,
      icon_url:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x954b890704693af242613edEf1B603825afcD708/logo.png',
      name: 'CARD.CPXD',
      price: {
        changed_at: 0,
        relative_change_24h: 0,
        value: 0,
      },
      symbol: 'CARD.CPXD',
      balance: {
        amount: '',
        display: '',
      },
    },
  },
];

const depots = [
  {
    type: 'depot',
    address: '0x107c1F2e2cE594cCb60629eaf33cF703419E01fb',
    tokens: [
      {
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
        balance: {
          amount: '0.97659490137056214',
          display: '0.977 CARD',
        },
        token: {
          name: 'CARD Token Testnet.CPXD',
          symbol: 'CARD',
          decimals: 18,
          value: '0.97659490137056214',
        },
        coingecko_id: 'cardstack',
        native: {
          balance: {
            amount: 0.00768613,
            display: '$0.00769 USD',
          },
        },
      },
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: {
          amount: '184.162869133241516766',
          display: '184.163 DAI',
        },
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
          value: '184.162869133241516766',
        },
        coingecko_id: 'dai',
        native: {
          balance: {
            amount: 184.53119487,
            display: '$184.53 USD',
          },
        },
      },
    ],
    createdAt: 1627335495,
    owners: ['0x8a40AFffb53f4F953a204cAE087219A28771df9d'],
  },
];

const prepaidCards = [
  {
    type: 'prepaid-card',
    address: '0x4ba1A50Aecba077Acdf4625BF9aDB3Fe964eEA17',
    customizationDID: 'did:cardstack:1pk8VX7ocZpmPshX9sj6mcXgc86eb8313054bc0c',
    issuingToken: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
    spendFaceValue: 500,
    issuer: '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
    hasBeenUsed: false,
    reloadable: false,
    transferrable: true,
    prepaidCardOwner: '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
    tokens: [
      {
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
        balance: {
          amount: '1',
          display: '1.00 CARD',
        },
        token: {
          name: 'CARD Token Testnet.CPXD',
          symbol: 'CARD',
          decimals: 18,
          value: '1',
        },
        coingecko_id: 'cardstack',
        native: {
          balance: {
            amount: 0.00787034,
            display: '$0.00787 USD',
          },
        },
      },
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: {
          amount: '4.990019960079840419',
          display: '4.99 DAI',
        },
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
          value: '4.990019960079840419',
        },
        coingecko_id: 'dai',
        native: {
          balance: {
            amount: 5,
            display: '$5.00 USD',
          },
        },
      },
    ],
    createdAt: 1627495725,
    owners: [
      '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
      '0xEba6d63dDf30174B87272D5cF566D63547e60119',
    ],
    cardCustomization: {
      issuerName: 'TD',
      background: '#393642',
      patternColor: 'black',
      textColor: 'white',
      patternUrl:
        'https://app.cardstack.com/images/prepaid-card-customizations/pattern-2.svg',
    },
  },
  {
    type: 'prepaid-card',
    address: '0xc78Ea45A86EFEA4Ad7b43749a538EAfEdE6eFC61',
    customizationDID: 'did:cardstack:1pnk2pYpHsEZWe6qmsLMKKnk7b20ad8eb8ad8fec',
    issuingToken: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
    spendFaceValue: 500,
    issuer: '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
    hasBeenUsed: false,
    reloadable: false,
    transferrable: true,
    prepaidCardOwner: '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
    tokens: [
      {
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
        balance: {
          amount: '1',
          display: '1.00 CARD',
        },
        token: {
          name: 'CARD Token Testnet.CPXD',
          symbol: 'CARD',
          decimals: 18,
          value: '1',
        },
        coingecko_id: 'cardstack',
        native: {
          balance: {
            amount: 0.00787034,
            display: '$0.00787 USD',
          },
        },
      },
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: {
          amount: '4.990019960079840419',
          display: '4.99 DAI',
        },
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
          value: '4.990019960079840419',
        },
        coingecko_id: 'dai',
        native: {
          balance: {
            amount: 5,
            display: '$5.00 USD',
          },
        },
      },
    ],
    createdAt: 1627336615,
    owners: [
      '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
      '0xEba6d63dDf30174B87272D5cF566D63547e60119',
    ],
    cardCustomization: {
      issuerName: 'TSTD',
      background: '#393642',
      patternColor: 'black',
      textColor: 'white',
      patternUrl:
        'https://app.cardstack.com/images/prepaid-card-customizations/pattern-2.svg',
    },
  },
];

const prices = {
  spoa: {
    usd: 0.2,
    usd_24h_change: 22.304616235477624,
    last_updated_at: 1629399408,
  },
};

const updatedAssets = [
  {
    asset: {
      address: 'spoa',
      coingecko_id: 'spoa',
      decimals: 18,
      icon_url: 'https://s3.amazonaws.com/icons.assets/ETH.png',
      name: 'Spoa',
      native: {
        balance: {
          amount: '0.00098',
          display: '$0.00098 USD',
        },
        price: {
          amount: 0.2,
          display: '$0.20 USD',
        },
      },
      price: {
        changed_at: 1629399408,
        relative_change_24h: 22.304616235477624,
        value: 0.2,
      },
      symbol: 'SPOA',
      balance: { amount: '0.0049', display: '0.0049 SPOA' },
    },
  },
  {
    asset: {
      address: '0x6B78C121bBd10D8ef0dd3623CC1abB077b186F65',
      coingecko_id: null,
      decimals: 18,
      icon_url: 'https://s3.amazonaws.com/icons.assets/ETH.png',
      name: 'Dominic',
      native: {
        balance: {
          amount: '9',
          display: '$9.00 USD',
        },
        price: {
          amount: 4.5,
          display: '$4.50 USD',
        },
      },
      price: {
        changed_at: null,
        relative_change_24h: 0,
        value: 4.5,
      },
      symbol: 'DOM',
      balance: { amount: '2', display: '2 DOM' },
    },
  },
  {
    asset: {
      address: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
      coingecko_id: 'dai',
      decimals: 18,
      icon_url:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      name: 'DAI.CPXD',
      native: {
        balance: {
          amount: '57',
          display: '$57.00 USD',
        },
        price: {
          amount: 1,
          display: '$1.00 USD',
        },
      },
      price: {
        changed_at: null,
        relative_change_24h: 0,
        value: 1,
      },
      symbol: 'DAI.CPXD',
      balance: { amount: '57', display: '57 DAI.CPXD' },
    },
  },
  {
    asset: {
      address: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
      coingecko_id: null,
      decimals: 18,
      icon_url:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x954b890704693af242613edEf1B603825afcD708/logo.png',
      name: 'CARD.CPXD',
      native: {
        balance: {
          amount: '0.00889263',
          display: '$0.00889 USD',
        },
        price: {
          amount: 0.00889263,
          display: '$0.00889 USD',
        },
      },
      price: {
        changed_at: null,
        relative_change_24h: 0,
        value: 0.00889263,
      },
      symbol: 'CARD.CPXD',
      balance: { amount: '1', display: '1 CARD.CPXD' },
    },
  },
];

const updatedDepots = [
  {
    type: 'depot',
    address: '0x107c1F2e2cE594cCb60629eaf33cF703419E01fb',
    tokens: [
      {
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
        balance: {
          amount: '0.97659490137056214',
          display: '0.977 CARD',
          wei: '976594901370562140',
        },
        token: {
          name: 'CARD Token Testnet.CPXD',
          symbol: 'CARD',
          decimals: 18,
          value: '0.97659490137056214',
        },
        coingecko_id: 'cardstack',
        native: {
          balance: {
            amount: 0.00768613,
            display: '$0.00769 USD',
          },
          price: {
            amount: 0.00889263,
            display: '$0.00889 USD',
          },
        },
        price: {
          changed_at: 1629399408,
          relative_change_24h: 22.304616235477624,
          value: 0.00889263,
        },
      },
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: {
          amount: '184.162869133241516766',
          display: '184.163 DAI',
        },
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
          value: '184.162869133241516766',
        },
        coingecko_id: 'dai',
        native: {
          balance: {
            amount: 184.53119487,
            display: '$184.53 USD',
          },
          price: {
            amount: 1,
            display: '$1.00 USD',
          },
        },
        price: {
          changed_at: 1629399932,
          relative_change_24h: 0.5608860044696169,
          value: 1,
        },
      },
    ],
    createdAt: 1627335495,
    owners: ['0x8a40AFffb53f4F953a204cAE087219A28771df9d'],
  },
];

const updatedPrepaidCards = [
  {
    type: 'prepaid-card',
    address: '0x4ba1A50Aecba077Acdf4625BF9aDB3Fe964eEA17',
    customizationDID: 'did:cardstack:1pk8VX7ocZpmPshX9sj6mcXgc86eb8313054bc0c',
    issuingToken: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
    spendFaceValue: 500,
    issuer: '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
    hasBeenUsed: false,
    reloadable: false,
    transferrable: true,
    prepaidCardOwner: '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
    tokens: [
      {
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
        balance: {
          amount: '1',
          display: '1.00 CARD',
        },
        token: {
          name: 'CARD Token Testnet.CPXD',
          symbol: 'CARD',
          decimals: 18,
          value: '1',
        },
        coingecko_id: 'cardstack',
        native: {
          balance: {
            amount: 0.00787034,
            display: '$0.00787 USD',
          },
          price: {
            amount: 0.00889263,
            display: '$0.00889 USD',
          },
        },
        price: {
          changed_at: 1629399408,
          relative_change_24h: 22.304616235477624,
          value: 0.00889263,
        },
      },
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: {
          amount: '4.990019960079840419',
          display: '4.99 DAI',
        },
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
          value: '4.990019960079840419',
        },
        coingecko_id: 'dai',
        native: {
          balance: {
            amount: 5,
            display: '$5.00 USD',
          },
          price: {
            amount: 1,
            display: '$1.00 USD',
          },
        },
        price: {
          changed_at: 1629399932,
          relative_change_24h: 0.5608860044696169,
          value: 1,
        },
      },
    ],
    createdAt: 1627495725,
    owners: [
      '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
      '0xEba6d63dDf30174B87272D5cF566D63547e60119',
    ],
    cardCustomization: {
      issuerName: 'TD',
      background: '#393642',
      patternColor: 'black',
      textColor: 'white',
      patternUrl:
        'https://app.cardstack.com/images/prepaid-card-customizations/pattern-2.svg',
    },
  },
  {
    type: 'prepaid-card',
    address: '0xc78Ea45A86EFEA4Ad7b43749a538EAfEdE6eFC61',
    customizationDID: 'did:cardstack:1pnk2pYpHsEZWe6qmsLMKKnk7b20ad8eb8ad8fec',
    issuingToken: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
    spendFaceValue: 500,
    issuer: '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
    hasBeenUsed: false,
    reloadable: false,
    transferrable: true,
    prepaidCardOwner: '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
    tokens: [
      {
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
        balance: {
          amount: '1',
          display: '1.00 CARD',
        },
        token: {
          name: 'CARD Token Testnet.CPXD',
          symbol: 'CARD',
          decimals: 18,
          value: '1',
        },
        coingecko_id: 'cardstack',
        native: {
          balance: {
            amount: 0.00787034,
            display: '$0.00787 USD',
          },
          price: {
            amount: 0.00889263,
            display: '$0.00889 USD',
          },
        },
        price: {
          changed_at: 1629399408,
          relative_change_24h: 22.304616235477624,
          value: 0.00889263,
        },
      },
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: {
          amount: '4.990019960079840419',
          display: '4.99 DAI',
        },
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
          value: '4.990019960079840419',
        },
        coingecko_id: 'dai',
        native: {
          balance: {
            amount: 5,
            display: '$5.00 USD',
          },
          price: {
            amount: 1,
            display: '$1.00 USD',
          },
        },
        price: {
          changed_at: 1629399932,
          relative_change_24h: 0.5608860044696169,
          value: 1,
        },
      },
    ],
    createdAt: 1627336615,
    owners: [
      '0x8a40AFffb53f4F953a204cAE087219A28771df9d',
      '0xEba6d63dDf30174B87272D5cF566D63547e60119',
    ],
    cardCustomization: {
      issuerName: 'TSTD',
      background: '#393642',
      patternColor: 'black',
      textColor: 'white',
      patternUrl:
        'https://app.cardstack.com/images/prepaid-card-customizations/pattern-2.svg',
    },
  },
];

const updatedMerchantSafes = [
  {
    accumulatedSpendValue: 6908,
    address: '0x2eA77A0a4475204E9AaD18114eBD718E6a264749',
    createdAt: 1634833295,
    infoDID: 'did:cardstack:1mjFHWdpm3PQeeqChDVZqGow4fcf21a530fbcfe0',
    merchant: '0x8e9E9bB54BE3D6aa9756E254a0c93c851Cabd2B9',
    merchantInfo: {
      color: '#f53695',
      did: 'did:cardstack:1mjFHWdpm3PQeeqChDVZqGow4fcf21a530fbcfe0',
      name: "B's merchant",
      ownerAddress: '0x8e9E9bB54BE3D6aa9756E254a0c93c851Cabd2B9',
      slug: 'bw',
      textColor: '#000000',
    },
    owners: ['0x8e9E9bB54BE3D6aa9756E254a0c93c851Cabd2B9'],
    revenueBalances: [
      {
        balance: {
          amount: '0.003818914',
          display: '0.00 DAI',
          wei: '3818914000000000',
        },
        native: { balance: [Object] },
        token: { symbol: 'DAI' },
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        tokenSymbol: 'DAI',
      },
    ],
    tokens: [
      {
        balance: {
          amount: '58.702316848670658683',
          display: '58.702 DAI',
          wei: '58702316848670658683',
        },
        coingecko_id: 'dai',
        native: { balance: { amount: 58.70231684, display: '$58.70 USD' } },
        token: {
          decimals: 18,
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          value: '58.702316848670658683',
        },
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
      },
    ],
    type: 'merchant',
  },
];

export const inputData = {
  assets,
  depots,
  prepaidCards,
};

export const fetchedData = {
  prices,
};

export const updatedData = {
  updatedAssets,
  updatedDepots,
  updatedPrepaidCards,
  updatedMerchantSafes,
};
