import { NativeCurrency } from '@cardstack/cardpay-sdk';

import { reduceAssetsWithPriceChartAndBalances } from '@cardstack/helpers/fallbackExplorerHelper';
import { NetworkType } from '@cardstack/types';

import { fetchedData, inputData, updatedData } from '../__mocks__/dataMocks';

const pricesOracle = {
  DOM: 4.5,
  'CARD.CPXD': 0.00889263,
  'DAI.CPXD': 1,
} as any;

jest.mock('@cardstack/services', () => ({
  getNativeBalanceFromOracle: jest
    .fn()
    .mockImplementation(({ balance, symbol }) => {
      const fromWei = require('@cardstack/cardpay-sdk').fromWei;
      const balanceNumber = parseFloat(fromWei(balance));

      return balanceNumber * pricesOracle[symbol];
    }),
}));

const balances = {
  spoa: '4900000000000000',
  '0x6B78C121bBd10D8ef0dd3623CC1abB077b186F65': '2000000000000000000',
  '0xFeDc0c803390bbdA5C4C296776f4b574eC4F30D1': '57000000000000000000',
  '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee': '1000000000000000000',
} as any;

jest.mock('@cardstack/services/assets', () => ({
  getOnChainAssetBalance: jest
    .fn()
    .mockImplementation(({ asset: { address, symbol } }) => {
      const fromWei = require('@cardstack/cardpay-sdk').fromWei;
      const amount = fromWei(balances[address]);

      return {
        amount,
        display: `${amount} ${symbol}`,
      };
    }),
}));

describe('Fallback Explorer Helpers', () => {
  it(`should return updated assets with prices, chartData and balances`, async () => {
    const { assets } = inputData;
    const { prices, chartData } = fetchedData;

    const updatedAssets = await reduceAssetsWithPriceChartAndBalances({
      assets,
      prices,
      chartData,
      formattedNativeCurrency: 'usd',
      network: NetworkType.sokol,
      nativeCurrency: NativeCurrency.USD,
      accountAddress: '0x000000',
    });

    expect(updatedAssets).toEqual(updatedData.updatedAssets);
  });
});
