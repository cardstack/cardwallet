import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback, useEffect } from 'react';
import { RefreshControl, SectionList, ActivityIndicator } from 'react-native';

import {
  Container,
  ListEmptyComponent,
  Text,
  TransactionItem,
  TransactionItemProps,
} from '@cardstack/components';
import { useCardPayCompatible } from '@cardstack/hooks';
import { RouteType } from '@cardstack/navigation/types';

import { TransactionListLoading } from './TransactionListLoading';
import { strings } from './strings';

const NUM_OF_ITEMS_PER_VIEW = 5;

interface TransactionListProps {
  Header?: JSX.Element;
  accountAddress: string;
}
interface NavParams {
  forceRefresh?: boolean;
}

export const TransactionList = memo(({ Header }: TransactionListProps) => {
  const { params } = useRoute<RouteType<NavParams>>();

  const {
    onEndReached,
    isLoadingTransactions,
    isFetchingMore,
    sections,
    refetch,
    refetchLoading,
  } = useCardPayCompatible();

  const onRefresh = useCallback(() => {
    if (!isLoadingTransactions || !refetchLoading) {
      refetch?.();
    }
  }, [isLoadingTransactions, refetch, refetchLoading]);

  useEffect(() => {
    if (params?.forceRefresh) {
      onRefresh();
    }
  }, [params, onRefresh]);

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

  const renderItem = useCallback(
    ({ item }: TransactionItemProps) => <TransactionItem item={item} />,
    []
  );

  const keyExtractor = useCallback(({ item }, index) => {
    const key = item?.transactionHash || item?.hash || item?.type;
    return `${key}-${index}`;
  }, []);

  return (
    <SectionList
      ListEmptyComponent={
        isLoadingTransactions ? (
          <TransactionListLoading />
        ) : (
          <Container paddingTop={4}>
            <ListEmptyComponent
              text={strings.emptyComponent}
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
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={NUM_OF_ITEMS_PER_VIEW}
      initialNumToRender={NUM_OF_ITEMS_PER_VIEW}
      removeClippedSubviews
    />
  );
});

TransactionList.displayName = 'TransactionList';
