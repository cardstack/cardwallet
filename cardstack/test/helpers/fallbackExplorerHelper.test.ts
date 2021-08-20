import { fetchedData, inputData, updatedData } from './mocks/dataMocks';
import {
  reduceAssetsWithPriceChartAndBalances,
  reduceDepotsWithPricesAndChart,
} from '@cardstack/helpers/fallbackExplorerHelper';

import { Network } from '@rainbow-me/helpers/networkTypes';

describe('Fallback Explorer Helpers', () => {
  it(`should return updated assets with prices, chartData and balances`, () => {
    const { assets } = inputData;
    const { prices, balances, chartData } = fetchedData;

    const updatedAssets = reduceAssetsWithPriceChartAndBalances({
      assets,
      prices,
      balances,
      chartData,
      formattedNativeCurrency: 'usd',
      network: Network.sokol,
    });

    expect(updatedAssets).toEqual(updatedData.updatedAssets);
  });

  it(`should return updated depots safes with prices, chartData and native price`, () => {
    const { depots } = inputData;
    const { prices, chartData } = fetchedData;

    const updatedDepots = reduceDepotsWithPricesAndChart({
      depots: depots as any, // need to figure right types
      prices,
      chartData,
      formattedNativeCurrency: 'usd',
      nativeCurrency: 'USD',
    });

    expect(updatedDepots).toEqual(updatedData.updatedDepots);
  });

  it(`should return updated prepaid cards safes with prices, chartData and native price`, () => {
    const { prepaidCards } = inputData;
    const { prices, chartData } = fetchedData;

    const updatedPrepaidCards = reduceDepotsWithPricesAndChart({
      depots: prepaidCards as any, // need to figure right types
      prices,
      chartData,
      formattedNativeCurrency: 'usd',
      nativeCurrency: 'USD',
    });

    expect(updatedPrepaidCards).toEqual(updatedData.updatedPrepaidCards);
  });
});
