import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';
import {
  CenteredContainer,
  Container,
  Text,
  Button,
} from '@cardstack/components';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

const BuyPrepaidCard = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { replace } = useNavigation();

  const onPress = useCallback(async () => {
    replace(Routes.SWIPE_LAYOUT, {
      params: { emptyWallet: true },
      screen: Routes.WALLET_SCREEN,
    });
  }, [replace]);

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
            <Button
              onPress={onPress}
              variant="square"
              borderColor="buttonSecondaryBorder"
            >
              $25
            </Button>
            <Button
              onPress={onPress}
              variant="square"
              borderColor="buttonSecondaryBorder"
            >
              $50
            </Button>
            <Button
              onPress={onPress}
              variant="square"
              borderColor="buttonSecondaryBorder"
            >
              $70
            </Button>
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
