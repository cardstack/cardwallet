import React from 'react';
import { FlatList } from 'react-native';
import {
  Container,
  SafeHeader,
  TokenBalance,
  Touchable,
} from '@cardstack/components';
import { DepotType } from '@cardstack/types';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

interface DepotProps extends DepotType {
  networkName: string;
}

/**
 * A inventory card component
 */
export const Depot = (depot: DepotProps) => {
  const { navigate } = useNavigation();

  const onPress = () => navigate(Routes.DEPOT_SCREEN, { depot });

  return (
    <Container width="100%" paddingHorizontal={4}>
      <Touchable width="100%" testID="inventory-card" onPress={onPress}>
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <SafeHeader {...depot} onPress={onPress} />
          <Bottom {...depot} />
        </Container>
      </Touchable>
    </Container>
  );
};

const Bottom = ({ tokens }: DepotProps) => {
  return (
    <Container paddingHorizontal={6}>
      <FlatList
        data={tokens}
        renderItem={({ item }) => {
          return (
            <Container paddingVertical={5}>
              <TokenBalance
                tokenSymbol={item.token.symbol}
                tokenBalance={item.balance.display}
                nativeBalance={item.native.balance.display}
              />
            </Container>
          );
        }}
      />
    </Container>
  );
};
