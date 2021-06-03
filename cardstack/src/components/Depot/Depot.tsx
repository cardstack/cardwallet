import React from 'react';
import CoinIcon from 'react-coin-icon';
import { FlatList } from 'react-native';
import { Container, SafeHeader, Text, Touchable } from '@cardstack/components';
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
            <Container
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              minHeight={75}
            >
              <Container flexDirection="row" alignItems="center">
                <CoinIcon size={30} {...item.token} />
                <Text size="body" marginLeft={2}>
                  {item.token.name}
                </Text>
              </Container>
              <Container alignItems="flex-end">
                <Text size="medium" weight="extraBold">
                  {`${item.balance.display}`}
                </Text>
              </Container>
            </Container>
          );
        }}
      />
    </Container>
  );
};
