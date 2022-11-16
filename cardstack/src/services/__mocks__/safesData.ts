const safesDataFromSDK = [
  {
    type: 'prepaid-card',
    address: '0xA3f83326cE7BD51fB6FDFC3D1c7fA76Dc9d52aee',
    customizationDID: 'did:cardstack:1p1yjzBVRA9oVnwykkFPArZd8102efdbe0693517',
    issuingToken: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
    spendFaceValue: 1000,
    issuer: '0xEdEeb0Ec367CF65Be7efA8340be05170028679aA',
    hasBeenUsed: false,
    reloadable: false,
    transferrable: false,
    prepaidCardOwner: '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
    tokens: [
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: '9980039920159680738',
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
        },
      },
    ],
    createdAt: 1634244400,
    owners: [
      '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
      '0xEba6d63dDf30174B87272D5cF566D63547e60119',
    ],
  },
  {
    type: 'prepaid-card',
    address: '0x67367bCBB0289B5c588bfAbaFe1328F35405DA9A',
    customizationDID: 'did:cardstack:1p1yjzBVRA9oVnwykkFPArZd8102efdbe0693517',
    issuingToken: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
    spendFaceValue: 1000,
    issuer: '0xEdEeb0Ec367CF65Be7efA8340be05170028679aA',
    hasBeenUsed: false,
    reloadable: false,
    transferrable: false,
    prepaidCardOwner: '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
    tokens: [
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: '9980039920159680738',
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
        },
      },
    ],
    createdAt: 1634244445,
    owners: [
      '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
      '0xEba6d63dDf30174B87272D5cF566D63547e60119',
    ],
  },
  {
    type: 'merchant',
    address: '0x43e186b7Af9a152F11392C82B3B57a79161f9168',
    infoDID: 'did:cardstack:1mkwwGvxAyzHAkjQyvxBtNLWea3e64a9b06d587f',
    accumulatedSpendValue: 3551,
    merchant: '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
    tokens: [
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: '33769477674550758459',
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
        },
      },
    ],
    createdAt: 1631038460,
    owners: ['0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811'],
  },
  {
    type: 'merchant',
    address: '0x63677A28d53a26830C4307b4460Ae097258a391d',
    infoDID: 'PLACEHOLDER',
    accumulatedSpendValue: 0,
    merchant: '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
    tokens: [],
    createdAt: 1631035615,
    owners: ['0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811'],
  },
  {
    type: 'depot',
    address: '0xa3E33F13b1b2945250A84b79758740b6bC9a8362',
    tokens: [
      {
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
        balance: '618912488496194715454',
        token: {
          name: 'CARD Token Testnet.CPXD',
          symbol: 'CARD',
          decimals: 18,
        },
      },
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        balance: '57226099823095488327',
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
        },
      },
    ],
    createdAt: 1627931865,
    owners: ['0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811'],
  },
];

const safesMappedByType = {
  depots: [
    {
      type: 'depot',
      address: '0xa3E33F13b1b2945250A84b79758740b6bC9a8362',
      tokens: [
        {
          tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
          balance: '618912488496194715454',
          token: {
            name: 'CARD Token Testnet.CPXD',
            symbol: 'CARD',
            decimals: 18,
            value: '618.912488496194715454',
          },
        },
        {
          tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
          balance: '57226099823095488327',
          token: {
            name: 'Dai Stablecoin.CPXD',
            symbol: 'DAI',
            decimals: 18,
            value: '57.226099823095488327',
          },
        },
      ],
      createdAt: 1627931865,
      owners: ['0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811'],
    },
  ],
  merchantSafes: [
    {
      type: 'merchant',
      address: '0x43e186b7Af9a152F11392C82B3B57a79161f9168',
      infoDID: 'did:cardstack:1mkwwGvxAyzHAkjQyvxBtNLWea3e64a9b06d587f',
      accumulatedSpendValue: 3551,
      merchant: '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
      tokens: [
        {
          tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
          balance: '33769477674550758459',
          token: {
            name: 'Dai Stablecoin.CPXD',
            symbol: 'DAI',
            decimals: 18,
            value: '33.769477674550758459',
          },
        },
      ],
      createdAt: 1631038460,
      owners: ['0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811'],
    },
    {
      type: 'merchant',
      address: '0x63677A28d53a26830C4307b4460Ae097258a391d',
      infoDID: 'PLACEHOLDER',
      accumulatedSpendValue: 0,
      merchant: '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
      tokens: [],
      createdAt: 1631035615,
      owners: ['0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811'],
    },
  ],
  prepaidCards: [
    {
      type: 'prepaid-card',
      address: '0xA3f83326cE7BD51fB6FDFC3D1c7fA76Dc9d52aee',
      customizationDID:
        'did:cardstack:1p1yjzBVRA9oVnwykkFPArZd8102efdbe0693517',
      issuingToken: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
      spendFaceValue: 1000,
      issuer: '0xEdEeb0Ec367CF65Be7efA8340be05170028679aA',
      hasBeenUsed: false,
      reloadable: false,
      transferrable: false,
      prepaidCardOwner: '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
      tokens: [
        {
          tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
          balance: '9980039920159680738',
          token: {
            name: 'Dai Stablecoin.CPXD',
            symbol: 'DAI',
            decimals: 18,
            value: '9.980039920159680738',
          },
        },
      ],
      createdAt: 1634244400,
      owners: [
        '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
        '0xEba6d63dDf30174B87272D5cF566D63547e60119',
      ],
      cardCustomization: {
        issuerName: 'Wyre',
        background: '#0069F9',
        patternColor: 'black',
        textColor: 'white',
        patternUrl: null,
      },
    },
    {
      type: 'prepaid-card',
      address: '0x67367bCBB0289B5c588bfAbaFe1328F35405DA9A',
      customizationDID:
        'did:cardstack:1p1yjzBVRA9oVnwykkFPArZd8102efdbe0693517',
      issuingToken: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
      spendFaceValue: 1000,
      issuer: '0xEdEeb0Ec367CF65Be7efA8340be05170028679aA',
      hasBeenUsed: false,
      reloadable: false,
      transferrable: false,
      prepaidCardOwner: '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
      tokens: [
        {
          tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
          balance: '9980039920159680738',
          token: {
            name: 'Dai Stablecoin.CPXD',
            symbol: 'DAI',
            decimals: 18,
            value: '9.980039920159680738',
          },
        },
      ],
      createdAt: 1634244445,
      owners: [
        '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811',
        '0xEba6d63dDf30174B87272D5cF566D63547e60119',
      ],
      cardCustomization: {
        issuerName: 'Wyre',
        background: '#0069F9',
        patternColor: 'black',
        textColor: 'white',
        patternUrl: null,
      },
    },
  ],
};

export const safesData = {
  fromSDK: safesDataFromSDK,
  mappedByType: safesMappedByType,
};
