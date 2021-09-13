import React from 'react';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { SlackSheet } from '../sheet';
import {
  Container,
  ListEmptyComponent,
  Text,
  TransactionItem,
  TransactionListLoading,
} from '@cardstack/components';
import { useMerchantTransactions } from '@cardstack/hooks';
import { MerchantSafeType } from '@cardstack/types';
import { sectionStyle } from '@cardstack/utils/layouts';

export default function UnclaimedRevenueExpandedState(props: {
  asset: MerchantSafeType;
}) {
  return (
    <SlackSheet flex={1} scrollEnabled>
      <Container paddingHorizontal={5} paddingVertical={3}>
        <Text size="medium">Recent activity</Text>
        <Activities address={props.asset.address} />
      </Container>
    </SlackSheet>
  );
}

const Activities = ({ address }: { address: string }) => {
  const {
    sections,
    isFetchingMore,
    onEndReached,
    refetchLoading,
    refetch,
    isLoadingTransactions,
  } = useMerchantTransactions(address, 'recentActivity');

  return (
    <Container flexDirection="column" marginTop={7} width="100%">
      {isLoadingTransactions ? (
        <TransactionListLoading light />
      ) : (
        <SectionList
          ListEmptyComponent={<ListEmptyComponent text="No activity" />}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator color="white" /> : null
          }
          contentContainerStyle={sectionStyle.contentContainerStyle}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          refreshControl={
            <RefreshControl
              onRefresh={refetch}
              refreshing={refetchLoading}
              tintColor="white"
            />
          }
          renderItem={props => (
            <TransactionItem {...props} includeBorder isFullWidth />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Container backgroundColor="white" paddingVertical={2} width="100%">
              <Text color="blueText" size="medium">
                {title}
              </Text>
            </Container>
          )}
          sections={sections}
          style={sectionStyle.sectionList}
        />
      )}
    </Container>
  );
};
