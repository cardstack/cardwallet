import React from 'react';
import { SectionList } from 'react-native';
import { CenteredContainer, Text } from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { useAccountTransactions } from '@rainbow-me/hooks';

interface TransactionListProps {
  Header: JSX.Element;
  accountAddress: string;
}

export const TransactionList = ({ Header }: TransactionListProps) => {
  const { sections } = useAccountTransactions();

  console.log({ sections });

  return (
    <SectionList
      ListEmptyComponent={<ListEmptyComponent />}
      ListHeaderComponent={Header}
      // renderItem={({ item }) => <TransactionCoinRow item={item} />}
      contentContainerStyle={{ paddingBottom: 40 }}
      sections={sections}
      renderSectionHeader={({ section: { title } }) => (
        <Text
          size="medium"
          marginVertical={2}
          paddingHorizontal={5}
          color="white"
        >
          {title}
        </Text>
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
