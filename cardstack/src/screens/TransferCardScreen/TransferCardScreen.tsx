import React from 'react';

import { useTransferCardScreen } from './useTransferCardScreen';
import { strings } from './strings';
import { Button, Container, Icon, Input, Text } from '@cardstack/components';

const TransferCardScreen = () => {
  const {
    isValidAddress,
    onChangeText,
    onTransferPress,
    onScanPress,
    goBack,
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
        {strings.title}
      </Text>
      <Text color="blueText" size="body" padding={10} textAlign="center">
        {strings.subtitle}
      </Text>
      <Container paddingVertical={5}>
        <Input
          paddingVertical={2}
          placeholder={strings.inputPlaceholder}
          color="white"
          placeholderTextColor="gray"
          borderBottomColor="teal"
          borderBottomWidth={1}
          onChangeText={onChangeText}
          multiline
        />
      </Container>
      <Button
        marginVertical={5}
        variant="primary"
        onPress={onScanPress}
        disabled
      >
        {strings.scanQrBtn}
      </Button>
      <Button disabled={!isValidAddress} onPress={onTransferPress}>
        {strings.transferBtn}
      </Button>
    </Container>
  );
};

export default TransferCardScreen;
