import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';

import { Container, TokenBalance } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { TokenType } from '@cardstack/types';
import { isBridgedCardToken } from '@cardstack/utils';

interface BalancesProps {
  tokens: TokenType[];
  safeAddress: string;
  isDepot?: boolean;
}

export const BalanceSection = ({
  tokens,
  safeAddress,
  isDepot = false,
}: BalancesProps) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(
    (token: TokenType) => () => {
      const asset = {
        ...token,
        ...token.token,
      };

      navigate(Routes.TOKEN_SHEET, { asset, safeAddress });
    },
    [navigate, safeAddress]
  );

  const renderTokens = useMemo(
    () =>
      tokens.map(token => (
        <TokenBalance
          isStaking={isBridgedCardToken(token.token.symbol) && isDepot}
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
    [onPress, tokens, isDepot]
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
