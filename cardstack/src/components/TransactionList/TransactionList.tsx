import { useFocusEffect } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { RefreshControl, SectionList, ActivityIndicator } from 'react-native';

import {
  Container,
  ListEmptyComponent,
  Text,
  TransactionItem,
  TransactionItemProps,
} from '@cardstack/components';
import { useFullTransactionList } from '@cardstack/hooks';

import { TransactionListLoading } from './TransactionListLoading';

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
    if (!isLoadingTransactions) {
      // Once tx are loading we don't need to track anymore
      isLoadingFallback.current = false;
    }
  }, [isLoadingTransactions]);

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <Container
        padding={4}
        width="100%"
        backgroundColor="backgroundDarkPurple"
      >
        <Text size="medium" color="white">
          {title}
        </Text>
      </Container>
    ),
    []
  );

  const onRefresh = useCallback(() => {
    refetch && refetch();
  }, [refetch]);

  useFocusEffect(onRefresh);

  const renderItem = useCallback(
    ({ item }: TransactionItemProps) => <TransactionItem item={item} />,
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
          <Container paddingTop={4}>
            <ListEmptyComponent
              text={`You don't have any\ntransactions yet`}
              textColor="blueText"
              hasRoundBox
            />
          </Container>
        )
      }
      ListHeaderComponent={Header}
      ListFooterComponent={
        isFetchingMore ? <ActivityIndicator color="white" /> : null
      }
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
