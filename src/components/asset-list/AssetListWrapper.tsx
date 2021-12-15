import { NativeCurrency } from '@cardstack/cardpay-sdk';
import React from 'react';
import { AssetList } from '@cardstack/components';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { useAssetListData } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const AssetListWrapper = () => {
  const [network, nativeCurrency, currencyConversionRates] = useRainbowSelector<
    [Network, NativeCurrency, { [key: string]: number }]
  >(state => [
    state.settings.network as Network,
    state.settings.nativeCurrency,
    state.currencyConversion.rates,
  ]);

  const {
    sections,
    isLoadingAssets,
    isEmpty,
    refetchSafes,
    isFetchingSafes,
  } = useAssetListData();

  return (
    <AssetList
      currencyConversionRates={currencyConversionRates}
      isEmpty={isEmpty}
      isFetchingSafes={isFetchingSafes}
      loading={isLoadingAssets}
      nativeCurrency={nativeCurrency}
      network={network}
      refetchSafes={refetchSafes}
      sections={sections}
    />
  );
};

export default AssetListWrapper;
