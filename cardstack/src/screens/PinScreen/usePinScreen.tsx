import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { DEFAULT_PIN_LENGTH } from '@cardstack/components/Input/PinInput/PinInput';
import { savePin } from '@cardstack/models/secure-storage';
import { Routes } from '@cardstack/navigation/routes';
import { RouteType } from '@cardstack/navigation/types';
import { useAuthActions } from '@cardstack/redux/authSlice';
import { ThemeVariant } from '@cardstack/theme/colorStyleVariants';

import logger from 'logger';

import { PinFlow } from './types';

const initialFLows = [PinFlow.create, PinFlow.new];

export interface PinScreenNavParams {
  flow: PinFlow;
  variant: ThemeVariant;
  showBiometricSwitcher?: boolean;
  canGoBack?: boolean;
  initialPin?: string;
  onSuccess?: (pin: string) => void;
  customSubtitle?: string;
  dismissOnSuccess?: boolean;
  savePinOnSuccess?: boolean;
}

export const usePinScreen = () => {
  const { dispatch: navDispatch, setOptions } = useNavigation();
  const { params } = useRoute<RouteType<PinScreenNavParams>>();

  const [inputPin, setInputPin] = useState('');
  const [isValidPin, setIsValidPin] = useState<null | boolean>(null);

  const { setUserAuthorized } = useAuthActions();

  const {
    flow = PinFlow.create,
    canGoBack = false,
    variant = 'dark',
    showBiometricSwitcher = true,
    initialPin = '',
    savePinOnSuccess = true,
  } = params;

  useEffect(() => {
    setOptions({ gestureEnabled: canGoBack });
  }, [canGoBack, setOptions]);

  useEffect(() => {
    if (inputPin.length < DEFAULT_PIN_LENGTH) {
      return;
    }

    if (initialFLows.includes(flow)) {
      navDispatch(
        StackActions.push(Routes.PIN_SCREEN, {
          ...params,
          flow: PinFlow.confirm,
          initialPin: inputPin,
          canGoBack: true,
        })
      );
    }

    if (flow === PinFlow.confirm) {
      const isPinEqual = initialPin === inputPin;

      setIsValidPin(isPinEqual);

      if (isPinEqual) {
        Keyboard.dismiss();
      }
    } else {
      setIsValidPin(null);
    }
  }, [navDispatch, flow, inputPin, variant, initialPin, params]);

  const onValidPin = useCallback(async () => {
    try {
      if (savePinOnSuccess) {
        await savePin(inputPin);
        setUserAuthorized();
      }

      await params?.onSuccess?.(inputPin);
    } catch (e) {
      logger.sentry('Error while saving PIN', e);
    }

    if (params.dismissOnSuccess) {
      navDispatch(StackActions.popToTop());
    }
  }, [inputPin, navDispatch, savePinOnSuccess, params, setUserAuthorized]);

  useEffect(() => {
    if (isValidPin) {
      onValidPin();
    }
  }, [navDispatch, isValidPin, params, inputPin, onValidPin]);

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
