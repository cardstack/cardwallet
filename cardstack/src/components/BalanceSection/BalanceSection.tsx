import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';

import { Container, TokenBalance } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { TokenType } from '@cardstack/types';

interface BalancesProps {
  tokens: TokenType[];
  safeAddress: string;
}

export const BalanceSection = ({ tokens, safeAddress }: BalancesProps) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(
    (token: TokenType) => () => {
      const asset = {
        ...token,
        ...token.token,
      };

      navigate(Routes.TOKEN_WITH_CHART_SHEET, { asset, safeAddress });
    },
    [navigate, safeAddress]
  );

  const renderTokens = useMemo(
    () =>
      tokens.map(token => (
        <TokenBalance
          key={token.tokenAddress}
          address={token.tokenAddress}
          includeBorder
          marginHorizontal={5}
          nativeBalance={token.native.balance.display}
          onPress={onPress(token)}
          tokenBalance={token.balance.display}
          tokenSymbol={token.token.symbol}
          zIndex={1}
        />
      )),
    [onPress, tokens]
  );

  return (
    <ScrollView>
      <Container
        paddingHorizontal={5}
        paddingBottom={3}
        marginTop={7}
        flexDirection="row"
      />
      {renderTokens}
    </ScrollView>
  );
};
