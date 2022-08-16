import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useCallback, useEffect, useMemo, RefObject } from 'react';
import { SectionList } from 'react-native';

import { useIsFetchingDataNewAccount } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import useRewardsDataFetch from '@cardstack/screens/RewardsCenterScreen/useRewardsDataFetch';
import { useGetServiceStatusQuery } from '@cardstack/services';

import showWalletErrorAlert from '@rainbow-me/helpers/support';
import {
  PinnedHiddenSectionOption,
  useAccountSettings,
  useAssetListData,
  useRefreshAccountData,
  useWallets,
} from '@rainbow-me/hooks';

import { AssetListRouteType } from './types';

export const useAssetList = ({
  sectionListRef,
}: {
  sectionListRef: RefObject<SectionList>;
}) => {
  const { navigate, setParams } = useNavigation();
  const { params } = useRoute<AssetListRouteType>();

  const {
    hasRewardsAvailable,
    isLoading: rewardsFetchLoading,
  } = useRewardsDataFetch();

  const {
    sections,
    isLoadingAssets,
    isEmpty,
    refetchSafes,
    isFetchingSafes,
  } = useAssetListData();

  // Account changed, flag to load skeleton
  const isLoadingSafesDiffAccount = useIsFetchingDataNewAccount(
    isFetchingSafes
  );

  // Handle refresh
  const refresh = useRefreshAccountData();
  const { refetch: refetchServiceStatus } = useGetServiceStatusQuery();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    refetchSafes();

    setRefreshing(true);

    // Refresh Service Status Notice
    refetchServiceStatus();

    // Refresh Account Data
    await refresh();

    setRefreshing(false);
  }, [refetchSafes, refetchServiceStatus, refresh]);

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

  const { isDamaged } = useWallets();

  const goToBuyPrepaidCard = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();

      return;
    }

    navigate(Routes.BUY_PREPAID_CARD);
  }, [isDamaged, navigate]);

  // Extra component props
  const { network } = useAccountSettings();

  const networkName = useMemo(() => getConstantByNetwork('name', network), [
    network,
  ]);

  return {
    isLoading:
      isLoadingAssets || isLoadingSafesDiffAccount || rewardsFetchLoading,
    isFetchingSafes,
    refreshing,
    sections,
    isEmpty,
    goToBuyPrepaidCard,
    onRefresh,
    networkName,
    hasRewardsAvailable,
  };
};
