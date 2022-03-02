import React, { useMemo } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransferCardScreen } from './useTransferCardScreen';
import { strings } from './strings';
import { Button, Container, Icon, Input, Text } from '@cardstack/components';
import { Device, screenHeight } from '@cardstack/utils';
import { colors } from '@cardstack/theme';
import { useDimensions } from '@rainbow-me/hooks';

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.backgroundDarkPurple,
  },
  safeArea: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
});

const TransferCardScreen = () => {
  const {
    isValidAddress,
    onChangeText,
    onTransferPress,
    onScanPress,
    goBack,
  } = useTransferCardScreen();

  const { isTinyPhone } = useDimensions();

  const keyboardOffset = useMemo(() => {
    const percentageMultiplier = isTinyPhone ? 0.1 : 0.25;
    const screenSizePercentage = screenHeight * percentageMultiplier;
    const negativeOffset = -screenSizePercentage;

    return negativeOffset;
  }, [isTinyPhone]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Device.keyboardBehavior}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={keyboardOffset}
        enabled={Device.isIOS}
      >
        <SafeAreaView style={styles.safeArea}>
          <Icon
            flexDirection="row"
            name="x"
            color="teal"
            onPress={goBack}
            iconSize="medium"
            alignSelf="flex-end"
          />
          <Container justifyContent="space-evenly" flexGrow={1}>
            <Container justifyContent="space-between" flexGrow={0.3}>
              <Text
                color="white"
                weight="bold"
                textAlign="center"
                size="medium"
              >
                {strings.title}
              </Text>
              <Text color="blueText" size="body" textAlign="center">
                {strings.subtitle}
              </Text>
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
            <Container flexGrow={0.6}>
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
          </Container>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default TransferCardScreen;
