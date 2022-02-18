import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  RefObject,
} from 'react';
import { SectionList } from 'react-native';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/core';
import { AssetListRouteType } from './types';
import { isLayer1 } from '@cardstack/utils';
import {
  PinnedHiddenSectionOption,
  useAccountProfile,
  useAccountSettings,
  useAssetListData,
  useRefreshAccountData,
  useWallets,
} from '@rainbow-me/hooks';
import { useGetServiceStatusQuery } from '@cardstack/services';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';

export const useAssetList = ({
  sectionListRef,
}: {
  sectionListRef: RefObject<SectionList>;
}) => {
  const { navigate, setParams } = useNavigation();
  const { params } = useRoute<AssetListRouteType>();

  const {
    sections,
    isLoadingAssets,
    isEmpty,
    refetchSafes,
    isFetchingSafes,
  } = useAssetListData();

  // Handle switch account
  const prevAccount = useRef(null);

  const { accountAddress } = useAccountProfile();

  useEffect(() => {
    if (accountAddress) {
      prevAccount.current = accountAddress;
    }
  }, [accountAddress]);

  // Account was switched so show loading skeleton
  const isLoadingSafesDiffAccount = useMemo(
    () => isFetchingSafes && prevAccount.current !== accountAddress,
    [accountAddress, isFetchingSafes, prevAccount]
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
  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const { network } = useAccountSettings();

  const componentItemExtraProps = useMemo(() => {
    const networkName = getConstantByNetwork('name', network);

    return {
      nativeCurrency,
      currencyConversionRates,
      networkName,
    };
  }, [currencyConversionRates, nativeCurrency, network]);

  return {
    isLoading: isLoadingAssets || isLoadingSafesDiffAccount,
    isFetchingSafes,
    refreshing,
    sections,
    isEmpty,
    goToBuyPrepaidCard,
    onRefresh,
    componentItemExtraProps,
    showAddFundsInterstitial: isEmpty && isLayer1(network),
  };
};
