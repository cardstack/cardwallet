import { orderBy } from 'lodash';
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
import { useAssets } from '@cardstack/hooks/assets/useAssets';
import { useGetSafesDataQuery } from '@cardstack/services';
import {
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
    type: 'safe',
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
  type: 'safe',
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
  type: 'safe',
});

const useOtherTokensSection = (): AssetListSectionItem<AssetWithNativeType> => {
  const {
    legacyAssetsStruct,
    getTotalAssetNativeBalance,
    unixFulfilledTimestamp,
  } = useAssets();

  const { hidden } = usePinnedAndHiddenItemOptions();

  const assets = legacyAssetsStruct as AssetWithNativeType[];

  const notHiddenItems = assets.filter(a => !hidden.includes(a.address));

  return {
    header: {
      title: 'Other Tokens',
      count: notHiddenItems.length,
      total: getTotalAssetNativeBalance(notHiddenItems.map(a => a.id)),
      type: PinnedHiddenSectionOption.BALANCES,
      showContextMenu: true,
    },
    data: assets,
    Component: BalanceCoinRowWrapper,
    timestamp: unixFulfilledTimestamp,
    type: 'eoaAsset',
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
    type: 'collectible',
  };
};

export const useAssetListData = () => {
  const {
    accountAddress,
    nativeCurrency,
    noCardPayAccount,
    isOnCardPayNetwork,
  } = useAccountSettings();

  const { isLoading: isLoadingEOAAssets } = useAssets();

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

  const isLoadingAssets =
    isLoadingEOAAssets || isUninitializedOnCardPayCompatible || isLoading;

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

  return {
    isLoadingAssets,
    sections,
    refetchSafes,
    isFetchingSafes,
  };
};
