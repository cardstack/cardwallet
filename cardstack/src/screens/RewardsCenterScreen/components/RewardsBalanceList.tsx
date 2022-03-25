import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { strings } from '../strings';
import { RewardRow } from '.';
import { Container, ListEmptyComponent } from '@cardstack/components';
import { TokenType } from '@cardstack/types';
import Routes from '@rainbow-me/navigation/routesNames';
import { useNavigation } from '@rainbow-me/navigation';

export type TokensWithSafeAddress = Array<TokenType & { safeAddress: string }>;
export interface RewardsBalanceListProps {
  data?: TokensWithSafeAddress;
}

export const RewardsBalanceList = ({ data = [] }: RewardsBalanceListProps) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(
    (token: TokenType, safeAddress) => () => {
      navigate(Routes.EXPANDED_ASSET_SHEET, {
        asset: token,
        type: 'token',
        safeAddress,
      });
    },
    [navigate]
  );

  const renderItem = useCallback(
    ({ item: { safeAddress, ...token } }) => (
      <RewardRow
        primaryText={token.balance.display}
        coinSymbol={token.token.symbol}
        onPress={onPress(token, safeAddress)}
      />
    ),
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
