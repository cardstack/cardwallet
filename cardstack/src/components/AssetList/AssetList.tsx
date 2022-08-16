import React, { useCallback, createRef } from 'react';
import { RefreshControl, SectionList, ActivityIndicator } from 'react-native';

import { Container, Text, RewardsPromoBanner } from '@cardstack/components';
import { PinHideOptionsFooter } from '@cardstack/components/PinnedHiddenSection';

import logger from 'logger';

import { AssetListLoading } from './components/AssetListLoading';
import AssetSectionHeader from './components/AssetSectionHeader';
import { strings } from './strings';
import { useAssetList } from './useAssetList';

// We need to pass this prop if the section to scrollTo is not on viewport
const onScrollToIndexFailed = () => {
  logger.log('onScrollToIndexFailed');
};

export const AssetList = () => {
  const sectionListRef = createRef<SectionList>();

  const {
    sections,
    isFetchingSafes,
    isLoading,
    goToBuyPrepaidCard,
    onRefresh,
    refreshing,
    networkName,
    hasRewardsAvailable,
  } = useAssetList({ sectionListRef });

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
      <Component {...item} networkName={networkName} />
    ),
    [networkName]
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

  return (
    <>
      <SectionList
        ListHeaderComponent={
          <RewardsPromoBanner
            hasUnclaimedRewards={hasRewardsAvailable}
            paddingTop={2}
          />
        }
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
      />
      <PinHideOptionsFooter />
    </>
  );
};
