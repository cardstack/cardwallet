import React, {
  useState,
  useCallback,
  useEffect,
  createRef,
  useMemo,
  useRef,
} from 'react';
import {
  RefreshControl,
  SectionList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/core';
import AddFundsInterstitial from '../../../../src/components/AddFundsInterstitial';
import { AssetListLoading } from './components/AssetListLoading';
import { AssetListProps, AssetListRouteType } from './types';
import { strings } from './strings';
import AssetSectionHeader from './components/AssetSectionHeader';
import { PinHideOptionsFooter } from '@cardstack/components/PinnedHiddenSection';
import {
  DiscordPromoBanner,
  useDiscordPromoBanner,
} from '@cardstack/components/DiscordPromoBanner';
import { Container, Text } from '@cardstack/components';
import { isLayer1 } from '@cardstack/utils';
import {
  PinnedHiddenSectionOption,
  useAccountProfile,
  useRefreshAccountData,
  useWallets,
} from '@rainbow-me/hooks';
import { useGetServiceStatusQuery } from '@cardstack/services';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import logger from 'logger';

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 180,
  },
});

// We need to pass this prop if the section to scrollTo is not on viewport
const onScrollToIndexFailed = () => {
  logger.log('onScrollToIndexFailed');
};

export const AssetList = (props: AssetListProps) => {
  const sectionListRef = createRef<SectionList>();
  const refresh = useRefreshAccountData();
  const { refetch: refetchServiceStatus } = useGetServiceStatusQuery(null);
  const [refreshing, setRefreshing] = useState(false);
  const { accountAddress } = useAccountProfile();
  const { navigate, setParams } = useNavigation();
  const { params } = useRoute<AssetListRouteType>();

  const { isDamaged } = useWallets();

  const {
    isEmpty,
    loading,
    sections,
    network,
    nativeCurrency,
    currencyConversionRates,
    isFetchingSafes,
  } = props;

  const networkName = getConstantByNetwork('name', network);

  const {
    showPromoBanner,
    onPress: onDiscordPromoPress,
  } = useDiscordPromoBanner();

  const renderPromoBanner = useMemo(
    () =>
      showPromoBanner ? (
        <DiscordPromoBanner onPress={onDiscordPromoPress} />
      ) : null,
    [onDiscordPromoPress, showPromoBanner]
  );

  const onRefresh = useCallback(async () => {
    props.refetchSafes();

    setRefreshing(true);

    // Refresh Service Status Notice
    refetchServiceStatus();

    // Refresh Account Data
    await refresh();

    setRefreshing(false);
  }, [props, refresh, refetchServiceStatus]);

  useEffect(() => {
    if (params?.forceRefreshOnce) {
      // Set to false so it won't update on assetsRefresh
      onRefresh();
      setParams({ forceRefreshOnce: false });
    }
  }, [onRefresh, params, sectionListRef, sections, setParams]);

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

  const goToBuyPrepaidCard = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();

      return;
    }

    navigate(Routes.BUY_PREPAID_CARD);
  }, [isDamaged, navigate]);

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <AssetSectionHeader
        section={section}
        onBuyCardPress={goToBuyPrepaidCard}
      />
    ),
    [goToBuyPrepaidCard]
  );

  const renderSectionFooter = useCallback(
    ({ section: { timestamp, data } }) =>
      timestamp && !!data.length ? (
        <Container
          paddingHorizontal={4}
          alignItems="flex-end"
          justifyContent="center"
        >
          {isFetchingSafes ? (
            <ActivityIndicator size={15} color="white" />
          ) : (
            <Text color="white" size="xs">
              {strings.lastUpdatedAt(timestamp)}
            </Text>
          )}
        </Container>
      ) : null,
    [isFetchingSafes]
  );

  const prevAccount = useRef(null);

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

  if (loading || isLoadingSafesDiffAccount) {
    return <AssetListLoading />;
  }

  if (isEmpty && isLayer1(network)) {
    return <AddFundsInterstitial />;
  }

  return (
    <>
      <SectionList
        ListHeaderComponent={renderPromoBanner}
        onScrollToIndexFailed={onScrollToIndexFailed}
        ref={sectionListRef}
        refreshControl={
          <RefreshControl
            tintColor="white"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        sections={sections}
        renderItem={({ item, section: { Component } }) => (
          <Component
            {...item}
            networkName={networkName}
            nativeCurrency={nativeCurrency}
            currencyConversionRates={currencyConversionRates}
          />
        )}
        renderSectionFooter={renderSectionFooter}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.contentContainer}
      />
      <PinHideOptionsFooter />
    </>
  );
};
