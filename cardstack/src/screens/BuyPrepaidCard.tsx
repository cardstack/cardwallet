import React from 'react';
import { StatusBar } from 'react-native';
import {
  Button,
  CenteredContainer,
  Container,
  Text,
} from '@cardstack/components';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

const BuyPrepaidCard = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { navigate } = useNavigation();

  const onPress = async (amount?: number) => {
    navigate(Routes.ADD_CASH_FLOW, {
      params: !isNaN(amount || 0) ? { amount } : null,
      screen: Routes.ADD_CASH_SCREEN_NAVIGATOR,
    });
  };

  return (
    <CenteredContainer
      backgroundColor="backgroundBlue"
      height="100%"
      width="100%"
      flex={1}
      padding={5}
    >
      <StatusBar barStyle="light-content" />
      <Container
        height={350}
        alignItems="center"
        width="100%"
        justifyContent="space-between"
      >
        <Text fontSize={26} color="white">
          Buy a Prepaid Card via Apple Pay to get started
        </Text>
        <Container width="100%">
          <Container
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
          >
            {[25, 50, 75].map(amount => (
              <Button
                borderColor="buttonSecondaryBorder"
                onPress={() => onPress(amount)}
                variant="square"
              >
                ${amount}
              </Button>
            ))}
          </Container>
          <Button
            variant="blue"
            marginTop={5}
            borderColor="buttonSecondaryBorder"
            onPress={onPress}
          >
            Custom Amount
          </Button>
        </Container>
      </Container>
    </CenteredContainer>
  );
};

export default BuyPrepaidCard;
