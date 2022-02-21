import React, { useCallback, createRef, useMemo } from 'react';
import {
  RefreshControl,
  SectionList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AddFundsInterstitial from '../../../../src/components/AddFundsInterstitial';
import { AssetListLoading } from './components/AssetListLoading';
import { strings } from './strings';
import AssetSectionHeader from './components/AssetSectionHeader';
import { useAssetList } from './useAssetList';
import { PinHideOptionsFooter } from '@cardstack/components/PinnedHiddenSection';
import {
  DiscordPromoBanner,
  useDiscordPromoBanner,
} from '@cardstack/components/DiscordPromoBanner';
import { Container, Text } from '@cardstack/components';
import logger from 'logger';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 180,
  },
});

// We need to pass this prop if the section to scrollTo is not on viewport
const onScrollToIndexFailed = () => {
  logger.log('onScrollToIndexFailed');
};

export const AssetList = () => {
  const sectionListRef = createRef<SectionList>();
  const { isTabBarEnabled } = useTabBarFlag();

  const {
    showPromoBanner,
    onPress: onDiscordPromoPress,
  } = useDiscordPromoBanner();

  const {
    sections,
    isFetchingSafes,
    isLoading,
    goToBuyPrepaidCard,
    onRefresh,
    componentItemExtraProps,
    showAddFundsInterstitial,
    refreshing,
  } = useAssetList({ sectionListRef });

  const renderPromoBanner = useMemo(
    () =>
      showPromoBanner && !isTabBarEnabled ? (
        <DiscordPromoBanner onPress={onDiscordPromoPress} />
      ) : null,
    [onDiscordPromoPress, showPromoBanner, isTabBarEnabled]
  );

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <AssetSectionHeader
        section={section}
        onBuyCardPress={goToBuyPrepaidCard}
      />
    ),
    [goToBuyPrepaidCard]
  );

  const renderItem = useCallback(
    ({ item, section: { Component } }) => (
      <Component {...item} {...componentItemExtraProps} />
    ),
    [componentItemExtraProps]
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

  if (isLoading) {
    return <AssetListLoading />;
  }

  if (showAddFundsInterstitial) {
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
        renderItem={renderItem}
        renderSectionFooter={renderSectionFooter}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.contentContainer}
      />
      <PinHideOptionsFooter />
    </>
  );
};
