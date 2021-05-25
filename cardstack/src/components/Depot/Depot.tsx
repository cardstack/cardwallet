import React from 'react';
import { FlatList } from 'react-native';
import CoinIcon from 'react-coin-icon';

import { DepotType } from '@cardstack/types';
import { Container, Icon, Text, Touchable } from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

/**
 * A inventory card component
 */
export const Depot = (depot: DepotType) => {
  const { navigate } = useNavigation();

  return (
    <Container width="100%" paddingHorizontal={4}>
      <Touchable
        width="100%"
        testID="inventory-card"
        onPress={() => navigate(Routes.DEPOT_SHEET)}
      >
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <Top {...depot} />
          <Bottom {...depot} />
        </Container>
      </Touchable>
    </Container>
  );
};

const Top = ({ address, onPress }: DepotType) => (
  <Container width="100%">
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="black"
      paddingVertical={4}
      paddingHorizontal={5}
    >
      <Container flexDirection="row" alignItems="center">
        <Text fontFamily="RobotoMono-Regular" color="white">
          {getAddressPreview(address)}
        </Text>
      </Container>
      <Touchable flexDirection="row" alignItems="center" onPress={onPress}>
        <Text color="white" weight="extraBold" size="small" marginRight={3}>
          View
        </Text>
        <Icon name="chevron-right" color="white" iconSize="medium" />
      </Touchable>
    </Container>
  </Container>
);

const Bottom = ({ tokens }: DepotType) => {
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
