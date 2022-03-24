import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { strings } from '../strings';
import { RewardRow, RewardRowProps } from '.';
import { Container, ListEmptyComponent } from '@cardstack/components';

export interface RewardsBalanceListProps {
  data?: Array<RewardRowProps>;
}

export const RewardsBalanceList = ({ data = [] }: RewardsBalanceListProps) => {
  const renderItem = useCallback(({ item }) => <RewardRow {...item} />, []);

  const spacing = useCallback(() => <Container paddingBottom={4} />, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={spacing}
      ListEmptyComponent={<ListEmptyComponent text={strings.balance.empty} />}
    />
  );
};
