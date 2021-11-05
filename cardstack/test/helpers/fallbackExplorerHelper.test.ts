import { fetchedData, inputData, updatedData } from './mocks/dataMocks';
import {
  reduceAssetsWithPriceChartAndBalances,
  reduceDepotsWithPricesAndChart,
} from '@cardstack/helpers/fallbackExplorerHelper';

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
    const { prices, balances, chartData } = fetchedData;

    const updatedAssets = await reduceAssetsWithPriceChartAndBalances({
      assets,
      prices,
      balances,
      chartData,
      formattedNativeCurrency: 'usd',
      network: Network.sokol,
      nativeCurrency: 'USD',
    });

    expect(updatedAssets).toEqual(updatedData.updatedAssets);
  });

  it(`should return updated depots safes with prices, chartData and native price`, async () => {
    const { depots } = inputData;
    const { prices, chartData } = fetchedData;

    const updatedDepots = await reduceDepotsWithPricesAndChart({
      depots: depots as any, // need to figure right types
      prices,
      chartData,
      formattedNativeCurrency: 'usd',
      nativeCurrency: 'USD',
    });

    expect(updatedDepots).toEqual(updatedData.updatedDepots);
  });

  it(`should return updated prepaid cards safes with prices, chartData and native price`, async () => {
    const { prepaidCards } = inputData;
    const { prices, chartData } = fetchedData;

    const updatedPrepaidCards = await reduceDepotsWithPricesAndChart({
      depots: prepaidCards as any, // need to figure right types
      prices,
      chartData,
      formattedNativeCurrency: 'usd',
      nativeCurrency: 'USD',
    });

    expect(updatedPrepaidCards).toEqual(updatedData.updatedPrepaidCards);
  });
});
