import React, { useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';

import { Container, TokenBalance } from '@cardstack/components';
import { TokenType } from '@cardstack/types';

import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

interface BalancesProps {
  tokens: TokenType[];
  navProps: any;
}

export const BalanceSection = ({ tokens, navProps }: BalancesProps) => {
  const { navigate } = useNavigation();

  const onPress = useCallback(
    (token: TokenType) => () => {
      navigate(Routes.EXPANDED_ASSET_SHEET_DRILL, {
        asset: token,
        type: 'token',
        ...navProps,
      });
    },
    [navProps, navigate]
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
