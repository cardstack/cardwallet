import React from 'react';

import { useNavigation } from '@react-navigation/core';
import { useTransferCardScreen } from './useTransferCardScreen';
import { Button, Container, Icon, Input, Text } from '@cardstack/components';

const TransferCardScreen = () => {
  const { goBack } = useNavigation();

  const {
    isValidAddress,
    onChangeText,
    onTransferPress,
    onScanPress,
  } = useTransferCardScreen();

  return (
    <Container
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingTop={15}
      paddingHorizontal={4}
    >
      <Icon
        flexDirection="row"
        name="x"
        color="teal"
        onPress={goBack}
        iconSize="medium"
        alignSelf="flex-end"
      />
      <Text color="white" weight="bold" textAlign="center" size="medium">
        Transfer Card
      </Text>
      <Text color="blueText" size="body" padding={10} textAlign="center">
        You can enter an EOA address or Scan it to transfer this PrepaidCard
      </Text>
      <Container paddingVertical={5}>
        <Input
          paddingVertical={2}
          placeholder="Enter address (0x...)"
          color="white"
          placeholderTextColor="gray"
          borderBottomColor="teal"
          borderBottomWidth={1}
          onChangeText={onChangeText}
          multiline
        />
      </Container>
      <Button marginVertical={5} variant="primary" onPress={onScanPress}>
        Scan QR code
      </Button>
      <Button disabled={!isValidAddress} onPress={onTransferPress}>
        Transfer
      </Button>
    </Container>
  );
};

export default TransferCardScreen;
