import React, { useCallback } from 'react';
import { SectionList } from 'react-native';
import { strings } from '../strings';
import { RewardRow } from '.';
import { Container, Text, ListEmptyComponent } from '@cardstack/components';
import { RewardeeClaim } from '@cardstack/graphql';
import { fromWeiToFixedEth } from '@cardstack/utils';

export interface RewardsHistorySectionType {
  title: string;
  data: RewardeeClaim[];
}

export interface RewardsHistoryListProps {
  sections?: Array<RewardsHistorySectionType>;
}

export const RewardsHistoryList = ({
  sections = [],
}: RewardsHistoryListProps) => {
  const renderSectionHeader = useCallback(
    ({ section }) => (
      <Container backgroundColor="white">
        <Text size="medium">{section.title}</Text>
      </Container>
    ),
    []
  );

  const renderItem = useCallback(({ item }: { item: RewardeeClaim }) => {
    const amountInEth = fromWeiToFixedEth(item.amount);
    const symbol = item.token.symbol || '';

    return (
      <RewardRow
        primaryText={`${amountInEth} ${symbol}`}
        coinSymbol={symbol}
        claimed
      />
    );
  }, []);

  const spacing = useCallback(() => <Container paddingBottom={4} />, []);

  return (
    <SectionList
      renderSectionHeader={renderSectionHeader}
      sections={sections}
      renderItem={renderItem}
      ItemSeparatorComponent={spacing}
      SectionSeparatorComponent={spacing}
      ListEmptyComponent={<ListEmptyComponent text={strings.history.empty} />}
    />
  );
};
