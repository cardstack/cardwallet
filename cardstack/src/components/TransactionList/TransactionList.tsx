import React from 'react';
import { RefreshControl, SectionList, ActivityIndicator } from 'react-native';

import { TransactionListLoading } from './TransactionListLoading';
import { useTransactions } from '@cardstack/services';
import { colors } from '@cardstack/theme';
import {
  CenteredContainer,
  Container,
  ScrollView,
  Text,
  TransactionItem,
} from '@cardstack/components';

interface TransactionListProps {
  Header: JSX.Element;
  accountAddress: string;
}

export const TransactionList = ({ Header }: TransactionListProps) => {
  const {
    count,
    isLoadingTransactions,
    fetchMoreLoading,
    sections,
    refetch,
    refetchLoading,
    fetchMore,
    shouldFetchMore,
  } = useTransactions();

  if (isLoadingTransactions && !fetchMoreLoading) {
    return (
      <ScrollView
        backgroundColor="backgroundBlue"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {Header}
        <TransactionListLoading />
      </ScrollView>
    );
  }

  return (
    <SectionList
      ListEmptyComponent={<ListEmptyComponent />}
      ListHeaderComponent={Header}
      ListFooterComponent={
        fetchMoreLoading ? <ActivityIndicator size={40} color="white" /> : null
      }
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={props => <TransactionItem {...props} />}
      sections={sections}
      renderSectionHeader={({ section: { title } }) => (
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
      )}
      refreshControl={
        <RefreshControl
          tintColor="white"
          refreshing={refetchLoading}
          onRefresh={refetch}
        />
      }
      onEndReached={() => {
        if (shouldFetchMore) {
          fetchMore({
            variables: {
              skip: count,
            },
          });
        }
      }}
      onEndReachedThreshold={1}
      style={{ backgroundColor: colors.backgroundBlue }}
    />
  );
};

const ListEmptyComponent = () => (
  <CenteredContainer width="100%" height={100} flex={1}>
    <Text color="grayText" textAlign="center">
      No transactions
    </Text>
  </CenteredContainer>
);
