import React from 'react';
import { AssetList } from '@cardstack/components';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { useAssetListData } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const AssetListWrapper = () => {
  const [network, nativeCurrency, currencyConversionRates] = useRainbowSelector<
    [string, string, { [key: string]: number }]
  >(state => [
    state.settings.network,
    state.settings.nativeCurrency,
    state.currencyConversion.rates,
  ]);
  const { sections, isLoadingAssets, isEmpty } = useAssetListData();

  return (
    <AssetList
      currencyConversionRates={currencyConversionRates}
      isEmpty={isEmpty}
      loading={isLoadingAssets}
      nativeCurrency={nativeCurrency}
      network={network as Network}
      sections={sections}
    />
  );
};

export default AssetListWrapper;
