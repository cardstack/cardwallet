import React from 'react';
import CoinIcon from 'react-coin-icon';
import { Container, Text, Touchable } from '@cardstack/components';
import { TokenType } from '@cardstack/types';

interface TokenBalanceProps {
  item: TokenType;
  onPress: () => void;
}

export const TokenBalance = (props: TokenBalanceProps) => {
  const { item, onPress } = props;

  return (
    <Touchable onPress={onPress}>
      <Container
        alignItems="center"
        width="100%"
        paddingHorizontal={5}
        paddingVertical={2}
        flexDirection="row"
      >
        <Container
          backgroundColor="white"
          borderRadius={10}
          borderWidth={1}
          borderColor="buttonPrimaryBorder"
          padding={4}
          width="100%"
          zIndex={1}
        >
          <Container
            width="100%"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Container flexDirection="row" alignItems="center">
              <CoinIcon size={40} {...item.token} />
              <Container marginLeft={4}>
                <Text fontWeight="700">{item.token.name}</Text>
              </Container>
            </Container>
            <Container alignItems="flex-end">
              <Text fontWeight="700">{`${item.balance.display}`}</Text>
              <Text variant="subText">{`${item.native.balance.display}`}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Touchable>
  );
};
