import React from 'react';
import CoinIcon from 'react-coin-icon';
import { FlatList } from 'react-native';
import { CenteredContainer } from '../Container';
import { getAddressPreview } from '@cardstack/utils';
import { Container, Icon, Text, Touchable } from '@cardstack/components';
import { TokenType } from '@cardstack/types';

interface MerchantSafeType {
  address: string;
  tokens: TokenType[];
}

export const MerchantSafe = (merchantSafe: MerchantSafeType) => {
  const onPress = () => {};

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
          <Top {...merchantSafe} onPress={onPress} />
          <MerchantInfo />
          <Bottom {...merchantSafe} />
        </Container>
      </Touchable>
    </Container>
  );
};

const Top = ({
  address,
  onPress,
}: MerchantSafeType & { onPress: () => void }) => (
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

const MerchantInfo = () => (
  <Container width="100%" justifyContent="center" alignItems="center">
    <Container
      flexDirection="row"
      paddingVertical={4}
      width="100%"
      paddingHorizontal={5}
    >
      <CenteredContainer
        height={80}
        borderRadius={100}
        backgroundColor="red"
        width={80}
      >
        <Text color="white" fontSize={11} weight="extraBold">
          MANDELLO
        </Text>
      </CenteredContainer>
      <Container flexDirection="column" marginLeft={4} justifyContent="center">
        <Text weight="bold">Mandello</Text>
        <Text variant="subText">Merchant Account</Text>
      </Container>
    </Container>
  </Container>
);

const Bottom = ({ tokens }: MerchantSafeType) => {
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
