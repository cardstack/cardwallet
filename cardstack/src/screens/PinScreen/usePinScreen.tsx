import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { DEFAULT_PIN_LENGTH } from '@cardstack/components/Input/PinInput/PinInput';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { ThemeVariant } from '@cardstack/theme/colorStyleVariants';

import { PinFlow } from './types';

const successDelayDismiss = 1500;

const initialFLows = [PinFlow.create, PinFlow.new];

interface NavParams {
  flow: PinFlow;
  variant: ThemeVariant;
  showBiometricSwitcher?: boolean;
  canGoBack?: boolean;
  initialPin?: string;
  onSuccess?: (pin: string) => void;
  customSubtitle?: string;
}

export const usePinScreen = () => {
  const { dispatch: navDispatch } = useNavigation();
  const { params } = useRoute<RouteType<NavParams>>();

  const [inputPin, setInputPin] = useState('');
  const [isValidPin, setIsValidPin] = useState<null | boolean>(null);

  const {
    flow = PinFlow.create,
    canGoBack = false,
    variant = 'dark',
    showBiometricSwitcher = true,
    initialPin = '',
  } = params;

  useEffect(() => {
    if (inputPin.length < DEFAULT_PIN_LENGTH) {
      return;
    }

    if (initialFLows.includes(flow)) {
      navDispatch(
        StackActions.push(Routes.PIN_SCREEN, {
          flow: PinFlow.confirm,
          initialPin: inputPin,
          variant,
          canGoBack: true,
        })
      );
    }

    if (flow === PinFlow.confirm) {
      setIsValidPin(initialPin === inputPin);
    } else {
      setIsValidPin(null);
    }
  }, [navDispatch, flow, inputPin, variant, initialPin]);

  useEffect(() => {
    if (isValidPin) {
      // Probably gonna need to extract to async func
      // If so, sending a dimiss callback might be better
      // then using setTimeout
      params?.onSuccess?.(inputPin);

      setTimeout(() => {
        navDispatch(StackActions.popToTop());
      }, successDelayDismiss);
    }
  }, [navDispatch, isValidPin, params, inputPin]);

  return {
    canGoBack,
    showBiometricSwitcher,
    isValidPin,
    variant,
    setInputPin,
    inputPin,
    flow,
  };
};
