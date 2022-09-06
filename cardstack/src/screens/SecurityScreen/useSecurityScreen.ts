import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Routes } from '@cardstack/navigation';

import { updateWalletWithNewPIN } from '@rainbow-me/model/wallet';

import { PinFlow } from '../PinScreen/types';

export const useSecurityScreen = () => {
  const { navigate } = useNavigation();

  const onPressChangePin = useCallback(async () => {
    navigate(Routes.PIN_SCREEN, {
      flow: PinFlow.new,
      variant: 'light',
      canGoBack: true,
      dismissOnSuccess: true,
      savePinOnSuccess: false,
      onSuccess: async (pin: string) => {
        await updateWalletWithNewPIN(pin);
      },
    });
  }, [navigate]);

  return { onPressChangePin };
};
