import React, { useCallback, createRef, useMemo } from 'react';
import { RefreshControl, SectionList, ActivityIndicator } from 'react-native';

import { Container, Text, RewardsPromoBanner } from '@cardstack/components';
import { PinHideOptionsFooter } from '@cardstack/components/PinnedHiddenSection';

import { useAccountSettings } from '@rainbow-me/hooks';
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
  const { isOnCardPayNetwork } = useAccountSettings();

  const {
    sections,
    isFetchingSafes,
    isLoading,
    goToBuyPrepaidCard,
    onRefresh,
    isRefetchingEoaAssets,
    networkName,
    hasClaimableRewards,
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
    ({ section: { timestamp, data, type } }) =>
      timestamp && !!data.length ? (
        <Container
          paddingHorizontal={4}
          alignItems="flex-end"
          justifyContent="center"
        >
          {(type === 'safe' && isFetchingSafes) ||
          (type === 'eoaAsset' && isRefetchingEoaAssets) ? (
            <ActivityIndicator size={15} color="white" />
          ) : (
            <Text color="white" size="xs">
              {strings.lastUpdatedAt(timestamp)}
            </Text>
          )}
        </Container>
      ) : null,
    [isFetchingSafes, isRefetchingEoaAssets]
  );

  const renderListHeaderComponent = useMemo(
    () =>
      isOnCardPayNetwork ? (
        <RewardsPromoBanner
          hasUnclaimedRewards={hasClaimableRewards}
          paddingTop={2}
        />
      ) : null,
    [hasClaimableRewards, isOnCardPayNetwork]
  );

  if (isLoading) {
    return <AssetListLoading />;
  }

  return (
    <>
      <SectionList
        ListHeaderComponent={renderListHeaderComponent}
        onScrollToIndexFailed={onScrollToIndexFailed}
        ref={sectionListRef}
        refreshControl={
          <RefreshControl
            tintColor="white"
            onRefresh={onRefresh}
            // This is a required prop, but we are handling the visual feedback in another way
            refreshing={false}
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
