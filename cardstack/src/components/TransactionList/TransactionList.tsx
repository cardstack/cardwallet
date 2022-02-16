import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl, SectionList, ActivityIndicator } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { TransactionListLoading } from './TransactionListLoading';
import { useFullTransactionList } from '@cardstack/hooks';
import {
  Container,
  ListEmptyComponent,
  Text,
  TransactionItem,
  TransactionItemProps,
} from '@cardstack/components';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';

interface TransactionListProps {
  Header?: JSX.Element;
  accountAddress: string;
}

export const TransactionList = memo(({ Header }: TransactionListProps) => {
  const {
    onEndReached,
    isLoadingTransactions,
    isFetchingMore,
    sections,
    refetch,
    refetchLoading,
  } = useFullTransactionList();

  const isLoadingFallback = useRef(true);

  useEffect(() => {
    if (isLoadingTransactions) {
      // Once tx are loading we don't need to track anymore
      isLoadingFallback.current = false;
    }
  }, [isLoadingTransactions]);

  const { isTabBarEnabled } = useTabBarFlag();

  // TODO: Remove condition after tab is official
  // useBottomTabBarHeight throws error if it's not inside tabNav
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tabBarHeight = isTabBarEnabled ? useBottomTabBarHeight() : 0;

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: 40 + tabBarHeight,
    }),
    [tabBarHeight]
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <Container
        paddingVertical={2}
        paddingHorizontal={5}
        width="100%"
        backgroundColor={
          isTabBarEnabled ? 'backgroundDarkPurple' : 'backgroundBlue'
        }
      >
        <Text size="medium" color="white">
          {title}
        </Text>
      </Container>
    ),
    [isTabBarEnabled]
  );

  const onRefresh = useCallback(() => {
    refetch && refetch();
  }, [refetch]);

  useFocusEffect(onRefresh);

  const renderItem = useCallback(
    (props: TransactionItemProps) => <TransactionItem {...props} />,
    []
  );

  return (
    <SectionList
      ListEmptyComponent={
        // Use fallback to avoid flickering empty component,
        // when fetching hasn't started yet
        isLoadingTransactions || isLoadingFallback.current ? (
          <TransactionListLoading />
        ) : (
          <ListEmptyComponent
            text={`You don't have any\ntransactions yet`}
            textColor="blueText"
            hasRoundBox
          />
        )
      }
      ListHeaderComponent={Header}
      ListFooterComponent={
        isFetchingMore ? <ActivityIndicator color="white" /> : null
      }
      contentContainerStyle={contentContainerStyle}
      renderItem={renderItem}
      sections={sections}
      renderSectionHeader={renderSectionHeader}
      refreshControl={
        <RefreshControl
          tintColor="white"
          refreshing={refetchLoading}
          onRefresh={onRefresh}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
    />
  );
});

TransactionList.displayName = 'TransactionList';
