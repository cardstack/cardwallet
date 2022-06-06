import { useCallback, useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

import { useBiometricSwitch } from '@cardstack/components/BiometricSwitch';
import { DEFAULT_PIN_LENGTH } from '@cardstack/components/Input/PinInput/PinInput';
import { useBooleanState } from '@cardstack/hooks';
import { getPin } from '@cardstack/models/secure-storage';
import { useAuthActions } from '@cardstack/redux/authSlice';
import { useWorker } from '@cardstack/utils';

import { wipeKeychain } from '@rainbow-me/model/keychain';

import { strings } from './strings';

export const useUnlockScreen = () => {
  const storedPin = useRef<string | null>(null);

  const { biometryAvailable } = useBiometricSwitch();
  const [inputPin, setInputPin] = useState('');
  const [pinInvalid, setPinInvalid, setPinValid] = useBooleanState();

  const { setUserAuthorized } = useAuthActions();

  // Fetch on init so login is faster
  const { callback: getStoredPin } = useWorker(async () => {
    storedPin.current = await getPin();
  }, []);

  useEffect(() => {
    getStoredPin();
  }, [getStoredPin]);

  const validatePin = useCallback(
    async (input: string) => {
      if (storedPin.current === input) {
        setPinValid();
        setUserAuthorized();
      } else {
        setPinInvalid();
        setInputPin('');
      }
    },
    [setPinInvalid, setPinValid, setUserAuthorized]
  );

  const onResetWalletPress = useCallback(() => {
    Alert.alert(strings.reset.title, strings.reset.message, [
      {
        text: strings.reset.delete,
        onPress: async () => {
          await wipeKeychain();
          RNRestart.Restart();
        },
      },
      {
        text: strings.reset.cancel,
        style: 'cancel',
      },
    ]);
  }, []);

  useEffect(() => {
    if (inputPin.length < DEFAULT_PIN_LENGTH) {
      return;
    }

    validatePin(inputPin);
  }, [inputPin, validatePin]);

  return {
    biometryAvailable,
    inputPin,
    setInputPin,
    pinInvalid,
    onResetWalletPress,
  };
};
