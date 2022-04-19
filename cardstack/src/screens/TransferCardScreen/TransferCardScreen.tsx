import React, { useMemo } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  Button,
  Container,
  Icon,
  Input,
  SafeAreaView,
  Text,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { Device, screenHeight } from '@cardstack/utils';

import { useDimensions } from '@rainbow-me/hooks';

import { QRCodeScannerPage } from '../QRScannerScreen/pages';

import { strings } from './strings';
import { useTransferCardScreen } from './useTransferCardScreen';

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.backgroundDarkPurple,
  },
});

const TransferCardScreen = () => {
  const {
    isValidAddress,
    onChangeText,
    onTransferPress,
    onScanPress,
    goBack,
    renderScanPage,
    dismissScanPage,
    onScanHandler,
    newOwnerAddress,
  } = useTransferCardScreen();

  const { isTinyPhone } = useDimensions();

  const keyboardOffset = useMemo(() => {
    const percentageMultiplier = isTinyPhone ? 0.1 : 0.25;
    const screenSizePercentage = screenHeight * percentageMultiplier;
    const negativeOffset = -screenSizePercentage;

    return negativeOffset;
  }, [isTinyPhone]);

  const scanPage = useMemo(
    () => (
      <Container flex={1} justifyContent="flex-end">
        <QRCodeScannerPage customScanAddressHandler={onScanHandler} />
        <Container flex={0.35} justifyContent="flex-start" alignItems="center">
          <Button variant="primary" onPress={dismissScanPage}>
            {strings.scanPage.btnLabel}
          </Button>
        </Container>
      </Container>
    ),
    [dismissScanPage, onScanHandler]
  );

  return (
    <Container flex={1} backgroundColor="backgroundDarkPurple">
      {renderScanPage ? (
        scanPage
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Device.keyboardBehavior}
            style={styles.keyboardAvoidView}
            keyboardVerticalOffset={keyboardOffset}
            enabled={Device.isIOS}
          >
            <SafeAreaView flex={1} margin={2} alignItems="center">
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
                    value={newOwnerAddress}
                  />
                </Container>
                <Container flexGrow={0.6}>
                  <Button
                    marginVertical={5}
                    variant="primary"
                    onPress={onScanPress}
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
      )}
    </Container>
  );
};

export default TransferCardScreen;
