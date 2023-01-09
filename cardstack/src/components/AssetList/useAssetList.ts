import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, RefObject } from 'react';
import { SectionList } from 'react-native';

import { useIsFetchingDataNewAccount } from '@cardstack/hooks';
import { useAssets } from '@cardstack/hooks/assets/useAssets';
import useRewardsDataFetch from '@cardstack/screens/RewardsCenterScreen/useRewardsDataFetch';
import { useGetServiceStatusQuery } from '@cardstack/services';

import {
  PinnedHiddenSectionOption,
  useAccountSettings,
  useAssetListData,
} from '@rainbow-me/hooks';

import { AssetListRouteType } from './types';

export const useAssetList = ({
  sectionListRef,
}: {
  sectionListRef: RefObject<SectionList>;
}) => {
  const { navigate, setParams } = useNavigation();
  const { params } = useRoute<AssetListRouteType>();

  const { hasClaimableRewards } = useRewardsDataFetch();

  const {
    sections,
    isLoadingAssets,
    refetchSafes,
    isFetchingSafes,
  } = useAssetListData();

  // Account changed, flag to load skeleton
  const isLoadingSafesDiffAccount = useIsFetchingDataNewAccount(
    isFetchingSafes
  );

  // Handle refresh
  const {
    refresh: refreshAssets,
    isRefetching: isRefetchingEoaAssets,
  } = useAssets();

  const { refetch: refetchServiceStatus } = useGetServiceStatusQuery();

  const { network, isOnCardPayNetwork } = useAccountSettings();

  const onRefresh = useCallback(() => {
    if (isOnCardPayNetwork) {
      refetchSafes();
    }

    // Refresh Service Status Notice
    refetchServiceStatus();

    // Refresh Account Data
    refreshAssets();
  }, [isOnCardPayNetwork, refetchSafes, refetchServiceStatus, refreshAssets]);

  useEffect(() => {
    if (params?.forceRefreshOnce) {
      // Set to false so it won't update on assetsRefresh
      onRefresh();
      setParams({ forceRefreshOnce: false });
    }
  }, [onRefresh, params, sectionListRef, sections, setParams]);

  // Handle scroll to prepaidCard after buying it
  useEffect(() => {
    if (params?.scrollToPrepaidCardsSection) {
      const prepaidCardSectionIndex = sections.findIndex(
        section =>
          section.header.type === PinnedHiddenSectionOption.PREPAID_CARDS
      );

      sectionListRef.current?.scrollToLocation({
        animated: false,
        sectionIndex: prepaidCardSectionIndex,
        itemIndex: 0,
      });

      // Set to false so it won't update on assetsRefresh
      setTimeout(() => {
        setParams({ scrollToPrepaidCardsSection: false });
      }, 2500);
    }
  }, [params, sectionListRef, sections, setParams]);

  const networkName = useMemo(() => getConstantByNetwork('name', network), [
    network,
  ]);

  return {
    isLoading: isLoadingAssets || isLoadingSafesDiffAccount,
    isFetchingSafes,
    isRefetchingEoaAssets,
    sections,
    onRefresh,
    networkName,
    hasClaimableRewards,
  };
};
