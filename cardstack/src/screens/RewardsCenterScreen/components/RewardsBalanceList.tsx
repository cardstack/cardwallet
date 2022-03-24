import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { strings } from '../strings';
import { RewardRow } from '.';
import { Container, ListEmptyComponent } from '@cardstack/components';
import { TokenType } from '@cardstack/types';

export interface RewardsBalanceListProps {
  data?: Array<TokenType>;
}

export const RewardsBalanceList = ({ data = [] }: RewardsBalanceListProps) => {
  const renderItem = useCallback(
    ({ item }) => (
      <RewardRow
        primaryText={item.balance.display}
        coinSymbol={item.token.symbol}
      />
    ),
    []
  );

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
