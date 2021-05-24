import {
  AssetType,
  AssetWithNativeType,
  DepotType,
  PrepaidCardType,
} from '@cardstack/types';
import React from 'react';
import { BalanceCoinRowWrapper } from '../coin-row';
import {
  AssetList,
  AssetListSectionItem,
  Depot,
  PrepaidCard,
} from '@cardstack/components';
import { parseAssetsNativeWithTotals } from '@rainbow-me/parsers';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const usePrepaidCardSection = (): AssetListSectionItem<PrepaidCardType> => {
  const prepaidCards = useRainbowSelector(state => state.data.prepaidCards);

  return {
    header: {
      title: 'Prepaid Cards',
      count: prepaidCards.length,
      showContextMenu: true,
    },
    data: prepaidCards,
    Component: PrepaidCard,
  };
};

const useDepotSection = (): AssetListSectionItem<DepotType> => {
  const depots = useRainbowSelector(state => state.data.depots);

  return {
    header: {
      title: 'Depot',
    },
    data: depots,
    Component: Depot,
  };
};

const useBalancesSection = (): AssetListSectionItem<AssetWithNativeType> => {
  const [stateAssets, nativeCurrency] = useRainbowSelector<
    [AssetType[], string]
  >(state => [state.data.assets, state.settings.nativeCurrency]);
  console.log({ stateAssets });
  const assetsWithNative = parseAssetsNativeWithTotals(
    stateAssets,
    nativeCurrency
  );
  const assets = assetsWithNative.assetsNativePrices as AssetWithNativeType[];

  return {
    header: {
      title: 'Balances',
      count: assets.length,
      total: assetsWithNative.total.display,
      showContextMenu: true,
    },
    data: assets,
    Component: BalanceCoinRowWrapper,
  };
};

const AssetListWrapper = () => {
  const [isLoadingAssets, network] = useRainbowSelector<[boolean, string]>(
    state => [state.data.isLoadingAssets, state.settings.network]
  );
  const prepaidCardSection = usePrepaidCardSection();
  const depotSection = useDepotSection();
  const balancesSection = useBalancesSection();

  const sections = [prepaidCardSection, depotSection, balancesSection].filter(
    section => section.data.length
  );

  return (
    <AssetList
      isEmpty={!sections.length}
      loading={isLoadingAssets}
      network={network}
      sections={sections}
    />
  );
};

export default AssetListWrapper;
