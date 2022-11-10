export const mockRewardSafeForProgram = [
  {
    address: '0x107c1F2e2cE594cCb60629eaf33cF703419E01fb',
    createdAt: 1627335495,
    owners: ['0x8a40AFffb53f4F953a204cAE087219A28771df9d'],
    rewardProgramId: '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185', // gnosis default ID
    tokens: [
      {
        balance: {
          amount: '0',
          display: '0.00 CARD.CPXD',
          wei: '70089035551997900',
        },
        native: {
          balance: {
            amount: 0,
            display: '$0.00 USD',
          },
        },
        token: { decimals: 18, name: 'Cardstack (CPXD)', symbol: 'CARD.CPXD' },
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
      },
    ],
    type: 'reward',
  },
];

export const mockfullBalanceToken = {
  balance: {
    amount: '52.479664130149567042',
    display: '52.48 CARD.CPXD',
    wei: '02d84d387a295fca42',
  },
  native: { balance: { amount: 0.10871897, display: '$0.109 USD' } },
  rewardProgramId: '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185',
  token: { symbol: 'CARD.CPXD' },
  tokenAddress: '0x52031d287Bb58E26A379A7Fec2c84acB54f54fe3',
};

export const mockclaimableBalanceToken = {
  balance: {
    amount: '52.479664130149567042',
    display: '52.48 CARD.CPXD',
    wei: '02d84d387a295fca42',
  },
  native: { balance: { amount: 0.10871897, display: '$0.109 USD' } },
  rewardProgramId: '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185',
  token: { symbol: 'CARD.CPXD' },
  tokenAddress: '0x52031d287Bb58E26A379A7Fec2c84acB54f54fe3',
};
