import React from 'react';
import CoinIcon from 'react-coin-icon';
import { CoinItem } from '../../types';
import { Container, Text } from '@cardstack/components';

interface BalanceCoinRowProps {
  item: CoinItem;
}

export const BalanceCoinRow = ({ item }: BalanceCoinRowProps) => (
  <Container width="100%" paddingHorizontal={5} paddingVertical={2}>
    <Container
      backgroundColor="white"
      borderRadius={10}
      padding={4}
      width="100%"
    >
      <Container
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container flexDirection="row">
          <CoinIcon size={40} {...item} />
          <Container marginLeft={4}>
            <Text fontWeight="700">{item.name}</Text>
            <Text variant="subText">{item.balance.display}</Text>
          </Container>
        </Container>
        <Container alignItems="flex-end">
          <Text fontWeight="700">{`${item.native.balance.display} USD`}</Text>
          <Text
            variant="subText"
            color={item.price.relative_change_24h > 0 ? 'green' : 'blueText'}
          >
            {item.native.change}
          </Text>
        </Container>
      </Container>
    </Container>
  </Container>
);
