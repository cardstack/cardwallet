import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { orderBy } from 'lodash';
import { BalanceCoinRowWrapper } from '../components/coin-row';
import useAccountSettings from './useAccountSettings';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from './usePinnedAndHiddenItemOptions';
import {
  AssetListSectionItem,
  CollectibleRow,
  Depot,
  MerchantSafe,
  PrepaidCard,
} from '@cardstack/components';
import { useGetSafesDataQuery } from '@cardstack/services';
import {
  AssetType,
  AssetWithNativeType,
  CollectibleType,
  DepotType,
  MerchantSafeType,
  PrepaidCardType,
} from '@cardstack/types';
import { isLayer1 } from '@cardstack/utils';
import { parseAssetsNativeWithTotals } from '@rainbow-me/parsers';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';

const usePrepaidCardSection = (
  prepaidCards: PrepaidCardType[]
): AssetListSectionItem<PrepaidCardType> => {
  const { hidden, pinned } = usePinnedAndHiddenItemOptions();
  const count = prepaidCards.filter(pc => !hidden.includes(pc.address)).length;

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
      count,
      type: PinnedHiddenSectionOption.PREPAID_CARDS,
      showContextMenu: true,
    },
    data: prepaidCards,
    Component: PrepaidCard,
  };
};

const useDepotSection = (
  depots: DepotType[]
): AssetListSectionItem<DepotType> => ({
  header: {
    title: 'Depot',
  },
  data: depots,
  Component: Depot,
});

const useMerchantSafeSection = (
  merchantSafes: MerchantSafeType[]
): AssetListSectionItem<MerchantSafeType> => ({
  header: {
    title: 'Accounts',
    count: merchantSafes?.length,
  },
  data: merchantSafes,
  Component: MerchantSafe,
});

const useOtherTokensSection = (): AssetListSectionItem<AssetWithNativeType> => {
  const [
    stateAssets,
    collectibles,
    nativeCurrency,
    network,
  ] = useRainbowSelector<[AssetType[], any[], string, string]>(state => [
    state.data.assets,
    state.collectibles.collectibles,
    state.settings.nativeCurrency,
    state.settings.network,
  ]);
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const assetsWithNative = parseAssetsNativeWithTotals(
    stateAssets,
    nativeCurrency
  );

  let assetBalances = assetsWithNative.assetsNativePrices;

  const { hidden, pinned } = usePinnedAndHiddenItemOptions();
  const count = assetBalances.filter(a => !hidden.includes(a.address)).length;

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

  const nativeBalance = assets.find(a => nativeTokenSymbol.includes(a.symbol));
  const nativeBalancePinned = nativeBalance
    ? pinned.includes(nativeBalance.address)
    : false;

  if (nativeBalancePinned) {
    assets = assets.sort(a => (nativeTokenSymbol.includes(a.symbol) ? -1 : 1));
  }

  console.log('useOtherTokensSection assets', assets);
  console.log(
    'useOtherTokensSection collectibles',
    JSON.stringify(collectibles)
  );

  return {
    header: {
      title: 'Other Tokens',
      count,
      total: assetsWithNative.total.display,
      type: PinnedHiddenSectionOption.BALANCES,
      showContextMenu: true,
    },
    data: assets,
    Component: BalanceCoinRowWrapper,
  };
};

const useCollectiblesSection = (): AssetListSectionItem<CollectibleType> => {
  const collectibles = useRainbowSelector(
    state => state.collectibles.collectibles
  );

  return {
    header: {
      title: 'Collectibles',
      count: collectibles.length,
    },
    data: collectibles,
    Component: CollectibleRow,
  };
};

const safesInitialState = {
  prepaidCards: [],
  depots: [],
  merchantSafes: [],
};

export const useAssetListData = () => {
  const [nativeCurrency] = useNativeCurrencyAndConversionRates();
  const { network, accountAddress } = useAccountSettings();
  const walletReady = useRainbowSelector(state => state.appState.walletReady);

  const {
    isFetching: isFetchingSafes,
    isLoading: isLoadingSafes,
    refetch: refetchSafes,
    data = safesInitialState,
    isUninitialized,
  } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      skip: isLayer1(network) || !accountAddress || !walletReady,
    }
  );

  const { prepaidCards, depots, merchantSafes } = data;

  const prepaidCardSection = usePrepaidCardSection(prepaidCards);
  const depotSection = useDepotSection(depots);
  const merchantSafesSection = useMerchantSafeSection(merchantSafes);
  const otherTokensSection = useOtherTokensSection();
  const collectiblesSection = useCollectiblesSection();

  const isLoadingAssets =
    useRainbowSelector(state => state.data.isLoadingAssets) ||
    isLoadingSafes ||
    isUninitialized;

  // order of sections in asset list
  const orderedSections = [
    merchantSafesSection,
    prepaidCardSection,
    depotSection,
    otherTokensSection,
    collectiblesSection,
  ];

  const sections = orderedSections.filter(
    section =>
      section?.data?.length ||
      (section?.header.type === PinnedHiddenSectionOption.PREPAID_CARDS &&
        !isLayer1(network))
  );

  const isEmpty = !sections.length;
  console.log('useAssetListData', sections);
  return {
    isLoadingAssets,
    isEmpty,
    sections,
    refetchSafes,
    isFetchingSafes,
  };
};
