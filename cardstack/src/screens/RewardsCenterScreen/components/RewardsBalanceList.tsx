import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { RewardRow, RewardRowProps } from '.';
import { Container } from '@cardstack/components';

interface RewardsBalanceListProps {
  data: Array<RewardRowProps>;
}

export const RewardsBalanceList = ({ data }: RewardsBalanceListProps) => {
  const renderItem = useCallback(({ item }) => <RewardRow {...item} />, []);

  const spacing = useCallback(() => <Container paddingBottom={4} />, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={spacing}
    />
  );
};
