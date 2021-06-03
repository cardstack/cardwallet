import React from 'react';
import { AssetList } from '@cardstack/components';
import { useAssetListData } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const AssetListWrapper = () => {
  const [network, nativeCurrency] = useRainbowSelector(state => [
    state.settings.network,
    state.settings.nativeCurrency,
  ]);
  const { sections, isLoadingAssets, isEmpty } = useAssetListData();

  return (
    <AssetList
      isEmpty={isEmpty}
      loading={isLoadingAssets}
      nativeCurrency={nativeCurrency}
      network={network}
      sections={sections}
    />
  );
};

export default AssetListWrapper;
