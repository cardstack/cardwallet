import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';

import { Container, ListEmptyComponent } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { TokenType } from '@cardstack/types';

import { strings } from '../strings';
import useRewardsBalanceHistory from '../useRewardsBalanceHistory';

import { RewardRow } from '.';

export type TokenWithSafeAddress = TokenType & { safeAddress: string };

export const RewardsBalanceList = () => {
  const { navigate } = useNavigation();
  const { tokensBalanceData } = useRewardsBalanceHistory();

  const onPress = useCallback(
    tokenInfo => () => {
      navigate(Routes.REWARD_WITHDRAW_TO, {
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
      data={tokensBalanceData}
      renderItem={renderItem}
      ItemSeparatorComponent={spacing}
      ListEmptyComponent={<ListEmptyComponent text={strings.balance.empty} />}
    />
  );
};
