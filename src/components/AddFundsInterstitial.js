import React, { memo } from 'react';

import { useNavigation } from '../navigation/Navigation';
import { Button, Container, Text } from '@cardstack/components';

import { Device } from '@cardstack/utils';
import Routes from '@rainbow-me/routes';

const AddFundsInterstitial = () => {
  const { navigate } = useNavigation();

  const onPress = useCallback(
    amount => () => {
      navigate(Routes.ADD_CASH_FLOW, {
        params: !isNaN(amount || 0) ? { amount } : null,
        screen: Routes.ADD_CASH_SCREEN_NAVIGATOR,
      });
    },
    [navigate]
  );

  const renderAmounts = useMemo(
    () =>
      Device.supportsPrefilledAmount &&
      [25, 50, 75].map(amount => (
        <Button
          borderColor="buttonSecondaryBorder"
          key={amount}
          maxWidth="30%"
          onPress={onPress(amount)}
          variant="square"
          wrapper="fragment"
        >
          ${amount}
        </Button>
      )),
    [onPress]
  );

  return (
    <Container flex={0.8} justifyContent="center" padding={5} width="100%">
      <Text color="white" fontSize={26}>
        To get started, buy some ETH with Apple Pay
      </Text>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        marginTop={4}
      >
        {renderAmounts}
      </Container>
      <Button
        borderColor="buttonSecondaryBorder"
        marginVertical={4}
        onPress={onPress()}
        variant="primary"
      >
        Custom Amount
      </Button>
    </Container>
  );
};

export default memo(AddFundsInterstitial);
