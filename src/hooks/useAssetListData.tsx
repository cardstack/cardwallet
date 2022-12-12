import {
  convertAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { add, orderBy } from 'lodash';
import { BalanceCoinRowWrapper } from '../components/coin-row';
import useAccountSettings from './useAccountSettings';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from './usePinnedAndHiddenItemOptions';
import {
  CollectibleRow,
  Depot,
  MerchantSafe,
  PrepaidCard,
} from '@cardstack/components';
import { AssetListSectionItem } from '@cardstack/components/AssetList/types';
import { assetsWithoutNFTs } from '@cardstack/parsers/collectibles';
import { useGetSafesDataQuery } from '@cardstack/services';
import {
  AssetType,
  AssetWithNativeType,
  CollectibleType,
  DepotType,
  MerchantSafeType,
  PrepaidCardType,
} from '@cardstack/types';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const usePrepaidCardSection = (
  prepaidCards: PrepaidCardType[],
  timestamp: string
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
      showContextMenu: !!prepaidCards.length,
    },
    data: prepaidCards,
    timestamp,
    Component: PrepaidCard,
  };
};

const useDepotSection = (
  depots: DepotType[],
  timestamp: string
): AssetListSectionItem<DepotType> => ({
  header: {
    title: 'Depot',
  },
  data: depots,
  timestamp,
  Component: Depot,
});

const useMerchantSafeSection = (
  merchantSafes: MerchantSafeType[],
  timestamp: string
): AssetListSectionItem<MerchantSafeType> => ({
  header: {
    title: 'Accounts',
    count: merchantSafes?.length,
  },
  data: merchantSafes,
  timestamp,
  Component: MerchantSafe,
});

const useOtherTokensSection = (): AssetListSectionItem<AssetWithNativeType> => {
  const [stateAssets, nativeCurrency, network] = useRainbowSelector<
    [AssetType[], string, string]
  >(state => [
    state.data.assets,
    state.settings.nativeCurrency,
    state.settings.network,
  ]);

  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const assetsToInclude = assetsWithoutNFTs(
    stateAssets
  ) as AssetWithNativeType[];

  const total = convertAmountToNativeDisplay(
    assetsToInclude.reduce(
      (total, { native }) => add(total, parseInt(native.balance.amount)),
      0
    ),
    nativeCurrency
  );

  const { hidden, pinned } = usePinnedAndHiddenItemOptions();
  const count = assetsToInclude.filter(a => !hidden.includes(a.address)).length;

  let assets = orderBy(
    assetsToInclude,
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

  return {
    header: {
      title: 'Other Tokens',
      count,
      total,
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

export const useAssetListData = () => {
  const {
    accountAddress,
    nativeCurrency,
    noCardPayAccount,
    isOnCardPayNetwork,
  } = useAccountSettings();

  const {
    isFetching: isFetchingSafes,
    isLoading,
    refetch: refetchSafes,
    prepaidCards,
    depots,
    merchantSafes,
    timestamp,
    isUninitialized,
  } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },

    {
      selectFromResult: ({ data, ...rest }) => ({
        prepaidCards: data?.prepaidCards || [],
        depots: data?.depots || [],
        merchantSafes: data?.merchantSafes || [],
        timestamp: data?.timestamp || '',
        ...rest,
      }),
      skip: noCardPayAccount,
    }
  );

  const prepaidCardSection = usePrepaidCardSection(prepaidCards, timestamp);
  const depotSection = useDepotSection(depots, timestamp);
  const merchantSafesSection = useMerchantSafeSection(merchantSafes, timestamp);
  const otherTokensSection = useOtherTokensSection();
  const collectiblesSection = useCollectiblesSection();

  const isUninitializedOnCardPayCompatible =
    isOnCardPayNetwork && isUninitialized;

  const isLoadingRainbowAssets = useRainbowSelector(
    state => state.data.isLoadingAssets
  );

  const isLoadingAssets =
    isLoadingRainbowAssets || isUninitializedOnCardPayCompatible || isLoading;

  // order of sections in asset list
  const orderedSections = [
    prepaidCardSection,
    merchantSafesSection,
    depotSection,
    otherTokensSection,
    collectiblesSection,
  ];

  const sections = orderedSections.filter(
    section =>
      section?.data?.length ||
      (section?.header.type === PinnedHiddenSectionOption.PREPAID_CARDS &&
        isOnCardPayNetwork)
  );

  const isEmpty = !sections.length;
  return {
    isLoadingAssets,
    isEmpty,
    sections,
    refetchSafes,
    isFetchingSafes,
  };
};
