import { BalanceCoinRowWrapper } from '../../src/components/coin-row';
import {
  AssetListSectionItem,
  Depot,
  PrepaidCard,
} from '@cardstack/components';
import {
  AssetType,
  AssetWithNativeType,
  DepotType,
  PrepaidCardType,
} from '@cardstack/types';
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

export const useAssetListData = () => {
  const prepaidCardSection = usePrepaidCardSection();
  const depotSection = useDepotSection();
  const balancesSection = useBalancesSection();
  const isLoadingAssets = useRainbowSelector(
    state => state.data.isLoadingAssets
  );

  const sections = [prepaidCardSection, depotSection, balancesSection].filter(
    section => section.data.length
  );

  const isEmpty = !sections.length;

  return {
    isLoadingAssets,
    isEmpty,
    sections,
  };
};
