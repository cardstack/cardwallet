import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { orderBy } from 'lodash';
import { BalanceCoinRowWrapper } from '../components/coin-row';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from './usePinnedAndHiddenItemOptions';
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
  MerchantSafeType,
  PrepaidCardType,
} from '@cardstack/types';
import { parseAssetsNativeWithTotals } from '@rainbow-me/parsers';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const usePrepaidCardSection = (): AssetListSectionItem<PrepaidCardType> => {
  let prepaidCards = useRainbowSelector(state => state.data.prepaidCards);

  const { editing, hidden, pinned } = usePinnedAndHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.PREPAID_CARDS;

  if (!isEditing) {
    prepaidCards = prepaidCards.filter(pc => !hidden.includes(pc.address));
  }

  prepaidCards = orderBy(
    prepaidCards,
    [
      function (p) {
        return pinned.includes(p.address);
      },
    ],
    ['desc']
  );

  return {
    header: {
      title: 'Prepaid Cards',
      count: prepaidCards.length,
      type: PinnedHiddenSectionOption.PREPAID_CARDS,
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

const useMerchantSafeSection = (): AssetListSectionItem<MerchantSafeType> => {
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

  let assetBalances = assetsWithNative.assetsNativePrices;

  const { editing, hidden, pinned } = usePinnedAndHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.BALANCES;

  let assets = orderBy(
    assetBalances,
    [
      function (p) {
        return pinned.includes(p.address);
      },
      function (p) {
        return p.symbol;
      },
    ],
    ['desc', 'asc', 'asc']
  ) as AssetWithNativeType[];

  if (!isEditing) {
    assets = assets.filter(a => !hidden.includes(a.address));
  }

  const nativeBalance = assets.find(a => nativeTokenSymbol.includes(a.symbol));
  const nativeBalancePinned = nativeBalance
    ? pinned.includes(nativeBalance.address)
    : false;

  if (nativeBalancePinned) {
    assets = assets.sort(a => (nativeTokenSymbol.includes(a.symbol) ? -1 : 1));
  }

  return {
    header: {
      title: 'Balances',
      count: assets.length,
      total: assetsWithNative.total.display,
      type: PinnedHiddenSectionOption.BALANCES,
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
    merchantSafesSection,
    depotSection,
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
