import React, { useCallback } from 'react';
import { FlatList } from 'react-native';

import { Container, ListEmptyComponent } from '@cardstack/components';
import { MainRoutes } from '@cardstack/navigation';
import { TokenType } from '@cardstack/types';

import { useNavigation } from '@rainbow-me/navigation';

import { strings } from '../strings';

import { RewardRow } from '.';

export type TokenWithSafeAddress = TokenType & { safeAddress: string };
export interface RewardsBalanceListProps {
  data?: TokenWithSafeAddress[];
}

export const RewardsBalanceList = ({ data = [] }: RewardsBalanceListProps) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(
    tokenInfo => () => {
      navigate(MainRoutes.REWARD_WITHDRAW_TO, {
        tokenInfo,
      });
    },
    [navigate]
  );

  const renderItem = useCallback(
    ({ item }: { item: TokenWithSafeAddress }) => {
      const hasEnoughBalance = !!parseFloat(item.balance.amount);

      return (
        <RewardRow
          showWithdrawBtn={hasEnoughBalance}
          primaryText={item.balance.display}
          coinSymbol={item.token.symbol}
          onPress={hasEnoughBalance ? onPress(item) : undefined}
        />
      );
    },
    [onPress]
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
