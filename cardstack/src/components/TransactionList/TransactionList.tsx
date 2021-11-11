import React, { memo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  RefreshControl,
  SectionList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { TransactionListLoading } from './TransactionListLoading';
import { useFullTransactionList } from '@cardstack/hooks';
import { colors } from '@cardstack/theme';
import {
  Container,
  ListEmptyComponent,
  ScrollView,
  Text,
  TransactionItem,
} from '@cardstack/components';

interface TransactionListProps {
  Header: JSX.Element;
  accountAddress: string;
}

const styles = StyleSheet.create({
  contentContainerStyle: { paddingBottom: 40 },
  background: { backgroundColor: colors.backgroundBlue },
});

const renderSectionHeader = ({
  section: { title },
}: {
  section: { title: string };
}) => (
  <Container
    paddingVertical={2}
    paddingHorizontal={5}
    width="100%"
    backgroundColor="backgroundBlue"
  >
    <Text size="medium" color="white">
      {title}
    </Text>
  </Container>
);

export const TransactionList = memo(({ Header }: TransactionListProps) => {
  const {
    onEndReached,
    isLoadingTransactions,
    isFetchingMore,
    sections,
    refetch,
    refetchLoading,
  } = useFullTransactionList();

  const onRefresh = useCallback(() => {
    refetch && refetch();
  }, [refetch]);

  useFocusEffect(onRefresh);

  if (isLoadingTransactions) {
    return (
      <ScrollView
        backgroundColor="backgroundBlue"
        contentContainerStyle={styles.contentContainerStyle}
      >
        {Header}
        <TransactionListLoading />
      </ScrollView>
    );
  }

  return (
    <SectionList
      ListEmptyComponent={
        <ListEmptyComponent
          text={`You don't have any\ntransactions yet`}
          textColor="blueText"
          hasRoundBox
        />
      }
      ListHeaderComponent={Header}
      ListFooterComponent={
        isFetchingMore ? <ActivityIndicator color="white" /> : null
      }
      contentContainerStyle={styles.contentContainerStyle}
      renderItem={props => <TransactionItem {...props} />}
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
      style={styles.background}
    />
  );
});

TransactionList.displayName = 'TransactionList';
