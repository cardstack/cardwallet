import { useRoute } from '@react-navigation/core';
import React from 'react';
import { SectionList } from 'react-native';
import { TransactionListLoading } from '../components/TransactionList/TransactionListLoading';
import {
  CenteredContainer,
  Container,
  PrepaidCard,
  PrepaidCardProps,
  SafeAreaView,
  SheetHandle,
  Text,
  TransactionItem,
} from '@cardstack/components';
import { usePrepaidCardTransactions } from '@cardstack/hooks';

const PrepaidCardModal = () => {
  const {
    params: { prepaidCardProps },
  } = useRoute() as { params: { prepaidCardProps: PrepaidCardProps } };

  const { sections, loading } = usePrepaidCardTransactions(
    prepaidCardProps.address
  );

  return (
    <SafeAreaView backgroundColor="black" flex={1} width="100%">
      <PrepaidCard
        {...prepaidCardProps}
        disabled
        paddingHorizontal={0}
        marginBottom={1}
      />
      <Container
        alignItems="center"
        paddingTop={1}
        borderRadius={10}
        minHeight="100%"
        backgroundColor="white"
        flexDirection="column"
        width="100%"
      >
        <SheetHandle />
        <Container width="100%" paddingVertical={4} paddingHorizontal={5}>
          <Text size="medium">Recent Activity</Text>
        </Container>
        {loading ? (
          <TransactionListLoading light />
        ) : (
          <SectionList
            ListEmptyComponent={<ListEmptyComponent />}
            contentContainerStyle={{ paddingBottom: 400 }}
            renderItem={props => <TransactionItem {...props} includeBorder />}
            sections={sections}
            renderSectionHeader={({ section: { title } }) => (
              <Container
                paddingVertical={2}
                paddingHorizontal={5}
                width="100%"
                backgroundColor="white"
              >
                <Text color="blueText">{title}</Text>
              </Container>
            )}
            style={{ width: '100%' }}
          />
        )}
      </Container>
    </SafeAreaView>
  );
};

const ListEmptyComponent = () => (
  <CenteredContainer width="100%" height={100} flex={1}>
    <Text color="grayText" textAlign="center">
      No transactions
    </Text>
  </CenteredContainer>
);

export default PrepaidCardModal;
