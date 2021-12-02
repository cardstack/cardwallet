import { fetchedData, inputData, updatedData } from '../__mocks__/dataMocks';
import { reduceAssetsWithPriceChartAndBalances } from '@cardstack/helpers/fallbackExplorerHelper';

import { Network } from '@rainbow-me/helpers/networkTypes';

jest.mock('@cardstack/services', () => ({
  getNativeBalanceFromOracle: jest.fn().mockImplementation(({ balance }) => {
    const fromWei = require('@cardstack/cardpay-sdk').fromWei;
    const balanceNumber = parseFloat(fromWei(balance));
    return balanceNumber > 0 ? balanceNumber * 4.5 : balanceNumber;
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
      network: Network.sokol,
      nativeCurrency: 'USD',
      accountAddress: '0x000000',
    });

    expect(updatedAssets).toEqual(updatedData.updatedAssets);
  });
});
