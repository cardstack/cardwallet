import React from 'react';
import { useSelector } from 'react-redux';

import { BalanceCoinRowWrapper } from '../coin-row';
import { AssetList, Depot, PrepaidCard } from '@cardstack/components';
import { parseAssetsNativeWithTotals } from '@rainbow-me/parsers';

interface AssetListWrapperProps {}

const usePrepaidCardSection = () => {
  const prepaidCards = useSelector(state => state.data.prepaidCards);

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

const useDepotSection = () => {
  const depots = useSelector(state => state.data.depots);

  return {
    header: {
      title: 'Depot',
    },
    data: depots,
    Component: Depot,
  };
};

const useBalancesSection = () => {
  const [stateAssets, nativeCurrency] = useSelector(state => [
    state.data.assets,
    state.settings.nativeCurrency,
  ]);
  const assetsWithNative = parseAssetsNativeWithTotals(
    stateAssets,
    nativeCurrency
  );
  const assets = assetsWithNative.assetsNativePrices;

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

const AssetListWrapper = (props: NavigationScreenProps) => {
  const [isLoadingAssets, network] = useSelector(state => [
    state.data.isLoadingAssets,
    state.settings.network,
  ]);
  const prepaidCardSection = usePrepaidCardSection();
  const depotSection = useDepotSection();
  const balancesSection = useBalancesSection();

  const sections = [prepaidCardSection, depotSection, balancesSection].filter(
    section => section.data.length
  );

  return (
    <AssetList
      isEmpty={!sections.length}
      loading
      network={network}
      sections={sections}
    />
  );
};

export default AssetListWrapper;
