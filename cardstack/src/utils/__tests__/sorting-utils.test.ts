import { sortedByTokenBalanceAmount } from '@cardstack/utils/sorting-utils';

describe('Sorting by token balance amount', () => {
  it('should return the same when list has only one item or empty', () => {
    const mockData = [
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        tokenSymbol: 'DAI',
        token: { symbol: 'DAI' },
        balance: { amount: '0.000173983', display: '0.000174 DAI' },
        native: { balance: { amount: 0.00017433, display: '$0.000174 USD' } },
      },
    ];

    expect(sortedByTokenBalanceAmount(mockData)).toStrictEqual(mockData);
    expect(sortedByTokenBalanceAmount([])).toStrictEqual([]);
  });

  it('should return ordered list with the one with biggest amount on the top', () => {
    const mockData = [
      {
        tokenAddress: '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
        token: {
          name: 'CARD Token Testnet.CPXD',
          symbol: 'CARD',
          decimals: 18,
          value: '100',
        },
        coingecko_id: 'cardstack',
        balance: { amount: '100', display: '100.00 CARD' },
        native: { balance: { amount: 0.733227, display: '$0.733 USD' } },
      },
      {
        tokenAddress: '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1',
        token: {
          name: 'Dai Stablecoin.CPXD',
          symbol: 'DAI',
          decimals: 18,
          value: '3.475236916195608782',
        },
        coingecko_id: 'dai',
        balance: { amount: '3.475236916195608782', display: '3.475 DAI' },
        native: { balance: { amount: 3.48218739, display: '$3.48 USD' } },
      },
    ];

    expect(sortedByTokenBalanceAmount(mockData)[0]).toHaveProperty(
      'tokenAddress',
      '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1'
    );
  });
});
