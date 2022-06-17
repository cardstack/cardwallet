import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { Alert } from 'react-native';

import { useBiometricSwitch } from '@cardstack/components/BiometricSwitch';
import { DEFAULT_PIN_LENGTH } from '@cardstack/components/Input/PinInput/PinInput';
import { useBooleanState } from '@cardstack/hooks';
import { biometricAuthentication } from '@cardstack/models/biometric-auth';
import { getPin } from '@cardstack/models/secure-storage';
import { useAuthActions } from '@cardstack/redux/authSlice';
import { useWorker } from '@cardstack/utils';

import { resetWallet } from '@rainbow-me/model/wallet';

import { strings } from './strings';

export const useUnlockScreen = () => {
  const storedPin = useRef<string | null>(null);
  const [inputPin, setInputPin] = useState('');

  const [pinInvalid, setPinInvalid, setPinValid] = useBooleanState();

  const [
    retryBiometricAuth,
    setRetryBiometricAuth,
    resetRetryBiometricAuth,
  ] = useBooleanState();

  const { setUserAuthorized } = useAuthActions();
  const { isBiometryEnabled, biometryLabel } = useBiometricSwitch();

  const retryBiometricLabel = useMemo(
    () => `Try ${biometryLabel || 'device authentication'} again`,
    [biometryLabel]
  );

  // Fetch on init so login is faster
  const { callback: getStoredPin } = useWorker(async () => {
    storedPin.current = await getPin();
  }, []);

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

  const authenticateBiometrically = useCallback(async () => {
    resetRetryBiometricAuth();

    if (await biometricAuthentication()) {
      setPinValid();
      setUserAuthorized();
    } else {
      setRetryBiometricAuth();
    }
  }, [
    setPinValid,
    setUserAuthorized,
    setRetryBiometricAuth,
    resetRetryBiometricAuth,
  ]);

  const onResetWalletPress = useCallback(() => {
    Alert.alert(strings.reset.title, strings.reset.message, [
      {
        text: strings.reset.delete,
        onPress: resetWallet,
      },
      {
        text: strings.reset.cancel,
        style: 'cancel',
      },
    ]);
  }, []);

  useEffect(() => {
    getStoredPin();
  }, [getStoredPin]);

  useEffect(() => {
    if (inputPin.length < DEFAULT_PIN_LENGTH) {
      return;
    }

    validatePin(inputPin);
  }, [inputPin, validatePin]);

  useEffect(() => {
    if (isBiometryEnabled) {
      authenticateBiometrically();
    }
  }, [authenticateBiometrically, isBiometryEnabled]);

  return {
    inputPin,
    setInputPin,
    pinInvalid,
    isBiometryEnabled,
    retryBiometricAuth,
    onResetWalletPress,
    retryBiometricLabel,
    authenticateBiometrically,
  };
};
