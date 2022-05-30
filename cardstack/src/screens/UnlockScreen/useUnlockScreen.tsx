import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

import { useBiometricSwitch } from '@cardstack/components/BiometricSwitch';
import { RouteType } from '@cardstack/navigation/types';
import { ThemeVariant } from '@cardstack/theme/colorStyleVariants';

import { useAppVersion } from '@rainbow-me/hooks';
import { wipeKeychain } from '@rainbow-me/model/keychain';

import { strings } from './strings';

interface NavParams {
  variant: ThemeVariant;
}

export const useUnlockScreen = () => {
  // const { navigate } = useNavigation();
  const { params } = useRoute<RouteType<NavParams>>();
  const { biometryAvailable } = useBiometricSwitch();
  const appVersion = useAppVersion();
  const [inputPin, setInputPin] = useState('');
  const [pinInvalid, setPinInvalid] = useState<null | boolean>(null);

  const { variant = 'dark' } = params;

  const onResetWalletPress = useCallback(() => {
    Alert.alert(strings.reset.title, strings.reset.message, [
      {
        text: strings.reset.delete,
        onPress: () => {
          wipeKeychain();
          RNRestart.Restart();
        },
      },
      {
        text: strings.reset.cancel,
        style: 'cancel',
      },
    ]);
  }, []);

  return {
    biometryAvailable,
    appVersion,
    variant,
    inputPin,
    setInputPin,
    pinInvalid,
    onResetWalletPress,
  };

  // Ask to unlock PIN:
  // First call on app start
  // On returning from background mode
  // On transactions
};
