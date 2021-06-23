import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { useCallback } from 'react';
import { ENABLE_PAYMENTS } from '../../cardstack/src/constants';
import showWalletErrorAlert from '../helpers/support';
import { useNavigation } from '../navigation/Navigation';
import { magicMemo } from '../utils';
import { Button, Container, Text } from '@cardstack/components';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import networkTypes from '@rainbow-me/networkTypes';
import Routes from '@rainbow-me/routes';

const AddFundsInterstitial = () => {
  const { navigate } = useNavigation();
  const { isDamaged } = useWallets();
  const { network } = useAccountSettings();
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

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

  const showAddFunds = network === networkTypes.mainnet && ENABLE_PAYMENTS;

  return (
    <Container
      flex={1}
      flexDirection="column"
      justifyContent="flex-start"
      padding={5}
      paddingTop={25}
      position="absolute"
      top="10%"
      width="100%"
    >
      {showAddFunds ? <BuyEth onPress={onPress} /> : null}
      <Container marginTop={16}>
        <Text color="white" fontSize={26}>
          {showAddFunds ? 'or ' : ''}{showAddFunds ? 's' : 'S'}end {nativeTokenSymbol} to your account
        </Text>
      </Container>
      <Button
        borderColor="buttonSecondaryBorder"
        iconProps={{
          color: 'teal',
          iconSize: 'medium',
          marginRight: 3,
          name: 'copy',
        }}
        marginTop={4}
        onPress={handlePressCopyAddress}
        variant="primary"
      >
        Copy Address
      </Button>
    </Container>
  );
};

const BuyEth = ({ onPress }) => (
  <Container alignItems="center" justifyContent="space-between" width="100%">
    <Text color="white" fontSize={26}>
      To get started, buy some ETH with Apple Pay
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
      variant="primary"
    >
      Custom Amount
    </Button>
  </Container>
);

export default magicMemo(AddFundsInterstitial, ['network', 'offsetY']);
