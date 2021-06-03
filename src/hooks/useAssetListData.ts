import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { BalanceCoinRowWrapper } from '../../src/components/coin-row';
import {
  AssetListSectionItem,
  Depot,
  MerchantSafe,
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

const useMerchantSafeSection = (): AssetListSectionItem<DepotType> => {
  const merchantSafes = useRainbowSelector(state => state.data.merchantSafes);

  return {
    header: {
      title: 'Merchants',
      count: merchantSafes?.length,
    },
    data: merchantSafes,
    Component: MerchantSafe,
  };
};

const useBalancesSection = (): AssetListSectionItem<AssetWithNativeType> => {
  const [stateAssets, nativeCurrency, network] = useRainbowSelector<
    [AssetType[], string, string]
  >(state => [
    state.data.assets,
    state.settings.nativeCurrency,
    state.settings.network,
  ]);
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);
  const assetsWithNative = parseAssetsNativeWithTotals(
    stateAssets,
    nativeCurrency
  );
  const sortedAssets = assetsWithNative.assetsNativePrices.sort(a =>
    a.symbol === nativeTokenSymbol ? -1 : 1
  );
  const assets = sortedAssets as AssetWithNativeType[];

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
  const merchantSafesSection = useMerchantSafeSection();
  const balancesSection = useBalancesSection();
  const isLoadingAssets = useRainbowSelector(
    state => state.data.isLoadingAssets
  );
  const orderedSections = [
    prepaidCardSection,
    depotSection,
    merchantSafesSection,
    balancesSection,
  ];
  const sections = orderedSections.filter(section => section?.data?.length);

  const isEmpty = !sections.length;

  return {
    isLoadingAssets,
    isEmpty,
    sections,
  };
};
