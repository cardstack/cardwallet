import React from 'react';
import CoinIcon from 'react-coin-icon';
import { Container, Text, Touchable } from '@cardstack/components';

interface TokenBalanceProps {
  onPress?: () => void;
  Icon?: JSX.Element;
  tokenSymbol: string;
  tokenBalance: string;
  nativeBalance: string;
}

export const TokenBalance = (props: TokenBalanceProps) => {
  const { tokenSymbol, tokenBalance, nativeBalance, onPress, Icon } = props;

  const Wrapper = onPress ? Touchable : Container;

  return (
    <Wrapper onPress={onPress}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container>
          <Container flexDirection="row">
            {Icon ? Icon : <CoinIcon symbol={tokenSymbol} />}
            <Container flexDirection="column" marginLeft={2}>
              <Text weight="extraBold">{tokenBalance}</Text>
              <Text variant="subText">{nativeBalance}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Wrapper>
  );
};
