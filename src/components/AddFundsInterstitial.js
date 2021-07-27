import React, { useCallback } from 'react';
import { ENABLE_PAYMENTS } from '../../cardstack/src/constants';
import showWalletErrorAlert from '../helpers/support';
import { useNavigation } from '../navigation/Navigation';
import { magicMemo } from '../utils';
import {
  Button,
  CenteredContainer,
  Container,
  Text,
} from '@cardstack/components';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import networkTypes from '@rainbow-me/networkTypes';
import Routes from '@rainbow-me/routes';

const AddFundsInterstitial = () => {
  const { navigate } = useNavigation();
  const { isDamaged } = useWallets();
  const { network } = useAccountSettings();

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

  // Temporally hiding button
  const showCopyAddress = false;

  return (
    <CenteredContainer flex={1} flexDirection="column" padding={5} width="100%">
      {showAddFunds ? <BuyEth onPress={onPress} /> : null}
      <Container flex={0.35} marginHorizontal={1}>
        <Text color="white" fontSize={26} textAlign="center">
          {showAddFunds ? 'or ' : ''}
          {showAddFunds ? 'v' : 'V'}isit app.cardstack.com on your computer to
          connect your wallet to use the full Card Pay functions
        </Text>
      </Container>
      {showCopyAddress && (
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
      )}
    </CenteredContainer>
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
      marginVertical={4}
      onPress={onPress}
      variant="primary"
    >
      Custom Amount
    </Button>
  </Container>
);

export default magicMemo(AddFundsInterstitial, ['network', 'offsetY']);
