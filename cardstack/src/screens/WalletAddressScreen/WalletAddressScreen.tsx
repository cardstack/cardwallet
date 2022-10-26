import React, { memo } from 'react';
import { Pressable } from 'react-native';

import { Container, StyledQRCode, Text, Button } from '@cardstack/components';

import { strings } from './strings';
import { useWalletAddressScreen } from './useWalletAddressScreen';

const WalletAddressScreen = () => {
  const {
    onAddressPress,
    copyToClipboard,
    addressPreview,
    accountAddress,
  } = useWalletAddressScreen();

  return (
    <>
      <Container flex={1} alignItems="center" paddingTop={10}>
        {!!accountAddress && (
          <StyledQRCode value={accountAddress} addLogo={false} />
        )}
        <Container
          flex={0.3}
          alignItems="center"
          justifyContent="space-around"
          paddingTop={2}
        >
          <Pressable onPress={onAddressPress}>
            <Text weight="bold" textDecorationLine="underline">
              {addressPreview}
            </Text>
          </Pressable>
          <Button onPress={copyToClipboard}>{strings.copyAddressBtn}</Button>
        </Container>
      </Container>
    </>
  );
};

export default memo(WalletAddressScreen);
