import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

import { useBiometricSwitch } from '@cardstack/components/BiometricSwitch';
import { DEFAULT_PIN_LENGTH } from '@cardstack/components/Input/PinInput/PinInput';
import { useBooleanState } from '@cardstack/hooks';
import { getPin, deletePin } from '@cardstack/models/secure-storage';
import { Routes } from '@cardstack/navigation/routes';
import { RouteType } from '@cardstack/navigation/types';
import { ThemeVariant } from '@cardstack/theme/colorStyleVariants';

import { useAppVersion } from '@rainbow-me/hooks';
import { wipeKeychain } from '@rainbow-me/model/keychain';

import { strings } from './strings';

interface NavParams {
  variant: ThemeVariant;
}

export const useUnlockScreen = () => {
  const { navigate } = useNavigation();
  const { params } = useRoute<RouteType<NavParams>>();
  const { biometryAvailable } = useBiometricSwitch();
  const appVersion = useAppVersion();
  const [inputPin, setInputPin] = useState('');
  const [pinInvalid, setPinInvalid, setPinValid] = useBooleanState();

  const { variant = 'dark' } = params;

  const validatePin = useCallback(
    async (input: string) => {
      const savedPin = await getPin();

      if (savedPin === input) {
        setPinValid();
        navigate(Routes.WALLET_SCREEN);
      } else {
        setPinInvalid();
        setInputPin('');
      }
    },
    [navigate, setPinInvalid, setPinValid]
  );

  const onResetWalletPress = useCallback(() => {
    Alert.alert(strings.reset.title, strings.reset.message, [
      {
        text: strings.reset.delete,
        onPress: async () => {
          await wipeKeychain();
          await deletePin();
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
    appVersion,
    variant,
    inputPin,
    setInputPin,
    pinInvalid,
    onResetWalletPress,
  };
};
