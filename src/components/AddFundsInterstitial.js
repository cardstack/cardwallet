import React, { memo } from 'react';

import { useNavigation } from '../navigation/Navigation';
import { Button, Container, Text } from '@cardstack/components';

import { Routes } from '@cardstack/navigation';
import { Device } from '@cardstack/utils';
import { useAccountSettings } from '@rainbow-me/hooks';

const AddFundsInterstitial = () => {
  const { navigate } = useNavigation();
  const { accountAddress } = useAccountSettings();

  const onPress = useCallback(
    amount => () => {
      if (Device.supportsNativeWyreIntegration) {
        navigate(Routes.ADD_CASH_FLOW, {
          params: !isNaN(amount || 0) ? { amount } : null,
          screen: Routes.ADD_CASH_SCREEN_NAVIGATOR,
        });
      } else {
        navigate(Routes.WYRE_WEBVIEW_NAVIGATOR, {
          params: {
            amount,
            address: accountAddress,
          },
          screen: Routes.WYRE_WEBVIEW,
        });
      }
    },
    [navigate, accountAddress]
  );

  const renderAmounts = useMemo(
    () =>
      [25, 50, 75].map(amount => (
        <Container flex={1} key={amount} marginHorizontal={2}>
          <Button
            borderColor="buttonSecondaryBorder"
            marginVertical={2}
            onPress={onPress(amount)}
            variant="square"
          >
            ${amount}
          </Button>
        </Container>
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
