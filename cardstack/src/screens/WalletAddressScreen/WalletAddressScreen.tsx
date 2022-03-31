import React, { memo } from 'react';
import { Pressable } from 'react-native';
import { strings } from './strings';
import { useWalletAddressScreen } from './useWalletAddressScreen';
import { Container, StyledQRCode, Text, Button } from '@cardstack/components';

const WalletAddressScreen = () => {
  const {
    onAddressPress,
    CopyToastComponent,
    copyToClipboard,
    addressPreview,
    accountAddress,
  } = useWalletAddressScreen();

  return (
    <>
      <Container flex={1} alignItems="center" paddingTop={10}>
        <StyledQRCode value={accountAddress} addLogo={false} />
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
      <CopyToastComponent />
    </>
  );
};

export default memo(WalletAddressScreen);
