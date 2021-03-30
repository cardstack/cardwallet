import React, { useCallback } from 'react';

import showWalletErrorAlert from '../helpers/support';
import { useNavigation } from '../navigation/Navigation';
import { magicMemo } from '../utils';
import { Button, Container, Text } from '@cardstack/components';
import { useWallets } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';

const AddFundsInterstitial = () => {
  const { navigate } = useNavigation();
  const { isDamaged } = useWallets();

  const onPress = amount => {
    navigate(Routes.ADD_CASH_FLOW, {
      params: !isNaN(amount || 0) ? { amount } : null,
      screen: Routes.ADD_CASH_SCREEN_NAVIGATOR,
    });
  };

  const handlePressCopyAddress = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }
    navigate(Routes.RECEIVE_MODAL);
  }, [navigate, isDamaged]);

  return (
    <Container
      flex={1}
      flexDirection="column"
      justifyContent="flex-start"
      padding={5}
      position="absolute"
      top="10%"
      width="100%"
    >
      <Container
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Text color="white" fontSize={26}>
          To get started, buy some xDai{ios ? ` with Apple Pay` : ''}
        </Text>
        <Container
          flexDirection="row"
          justifyContent="space-between"
          marginTop={4}
          width="100%"
        >
          {[25, 50, 75].map(amount => (
            <Button
              borderColor="buttonSecondaryBorder"
              key={amount}
              onPress={() => onPress(amount)}
              variant="square"
            >
              ${amount}
            </Button>
          ))}
        </Container>
        <Button
          borderColor="buttonSecondaryBorder"
          marginTop={4}
          onPress={onPress}
          variant="blue"
        >
          Custom Amount
        </Button>
      </Container>
      <Container marginTop={16}>
        <Text color="white" fontSize={26}>
          or send xDai to your wallet
        </Text>
      </Container>
      <Button
        borderColor="buttonSecondaryBorder"
        iconProps={{
          color: 'white',
          iconSize: 'medium',
          marginRight: 3,
          name: 'copy',
        }}
        marginTop={4}
        onPress={handlePressCopyAddress}
        variant="blue"
      >
        Copy Address
      </Button>
    </Container>
  );
};

export default magicMemo(AddFundsInterstitial, ['network', 'offsetY']);
