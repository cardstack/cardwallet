import React from 'react';
import { SectionList } from 'react-native';
import { TransactionListLoading } from './TransactionListLoading';
import {
  CenteredContainer,
  Container,
  ScrollView,
  Text,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { useAccountTransactions } from '@rainbow-me/hooks';

interface TransactionListProps {
  Header: JSX.Element;
  accountAddress: string;
}

export const TransactionList = ({ Header }: TransactionListProps) => {
  const { isLoadingTransactions, sections } = useAccountTransactions();

  if (isLoadingTransactions) {
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
      contentContainerStyle={{ paddingBottom: 40 }}
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
