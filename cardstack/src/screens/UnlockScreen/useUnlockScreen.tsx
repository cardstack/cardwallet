import { intervalToDuration } from 'date-fns';
import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { Alert } from 'react-native';

import { useBiometricSwitch } from '@cardstack/components/BiometricSwitch';
import { DEFAULT_PIN_LENGTH } from '@cardstack/components/Input/PinInput/PinInput';
import { useBooleanState } from '@cardstack/hooks';
import { biometricAuthentication } from '@cardstack/models/biometric-auth';
import { getPin } from '@cardstack/models/secure-storage';
import { useAuthActions } from '@cardstack/redux/authSlice';
import { handleWalletConnectRequests } from '@cardstack/redux/requests';
import { addLeftZero, useWorker } from '@cardstack/utils';

import {
  getPinAuthAttempts,
  getPinAuthNextDateAttempt,
  savePinAuthAttempts,
  savePinAuthNextDateAttempt,
} from '@rainbow-me/handlers/localstorage/globalSettings';
import { useRequests } from '@rainbow-me/hooks';
import { resetWallet } from '@rainbow-me/model/wallet';
import logger from 'logger';

import { strings } from './strings';

export const MAX_WRONG_ATTEMPTS = 5;

export const useUnlockScreen = () => {
  const storedPin = useRef<string | null>(null);
  const [inputPin, setInputPin] = useState('');
  const { latestRequest } = useRequests();

  const [pinInvalid, setPinInvalid, setPinValid] = useBooleanState();

  const [
    retryBiometricAuth,
    setRetryBiometricAuth,
    resetRetryBiometricAuth,
  ] = useBooleanState();

  const {
    setUserAuthorized,
    authWithBiometricsStarted,
    authWithBiometricsFinished,
  } = useAuthActions();

  const { isBiometryEnabled, biometryLabel } = useBiometricSwitch();

  const attemptsCount = useRef(0);
  const nextAttemptDate = useRef<number | null>(null);

  const retryBiometricLabel = useMemo(
    () => `Try ${biometryLabel || 'device authentication'} again`,
    [biometryLabel]
  );

  // Fetch on init so login is faster
  const { callback: setInitialData } = useWorker(async () => {
    storedPin.current = await getPin();
    attemptsCount.current = await getPinAuthAttempts();
    nextAttemptDate.current = await getPinAuthNextDateAttempt();
  }, []);

  const setAuthorized = useCallback(() => {
    setPinValid();
    setUserAuthorized();
    handleWalletConnectRequests(latestRequest);
  }, [setPinValid, setUserAuthorized, latestRequest]);

  const validatePin = useCallback(
    (input: string) => {
      if (storedPin.current === input) {
        attemptsCount.current = 0;
        setAuthorized();
      } else {
        attemptsCount.current++;
        setPinInvalid();
        setInputPin('');
      }

      savePinAuthAttempts(attemptsCount.current);
    },
    [setPinInvalid, setAuthorized]
  );

  const authenticateBiometrically = useCallback(async () => {
    authWithBiometricsStarted();
    logger.sentry('[Auth-Bio]: Started');
    resetRetryBiometricAuth();

    try {
      const isBiometricAuthorized = await biometricAuthentication();

      if (isBiometricAuthorized) {
        setAuthorized();
      } else {
        setRetryBiometricAuth();
      }
    } catch (e) {
      logger.sentry('[Auth-Bio]: Failed to authenticate with biometrics', e);
    } finally {
      // Avoids auth loop on Android
      setTimeout(authWithBiometricsFinished, 500);
      logger.sentry('[Auth-Bio]: Finished');
    }
  }, [
    authWithBiometricsStarted,
    resetRetryBiometricAuth,
    authWithBiometricsFinished,
    setRetryBiometricAuth,
    setAuthorized,
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
    setInitialData();
  }, [setInitialData]);

  const checkUserTemporaryBlock = useCallback(() => {
    const now = Date.now();

    if (
      !nextAttemptDate.current &&
      attemptsCount.current >= MAX_WRONG_ATTEMPTS
    ) {
      nextAttemptDate.current = now + 10 ** attemptsCount.current;

      savePinAuthNextDateAttempt(nextAttemptDate.current);
    }

    if (nextAttemptDate.current && now <= nextAttemptDate.current) {
      const { hours, minutes, seconds } = intervalToDuration({
        start: now,
        end: nextAttemptDate.current,
      });

      const H = addLeftZero(hours);
      const M = addLeftZero(minutes);
      const S = addLeftZero(seconds);

      // TODO: replace with counter
      Alert.alert(
        'Temporary block',
        `Too many attempts!\nPlease wait ${H}:${M}:${S} to try again.`
      );

      return true;
    }

    nextAttemptDate.current = null;

    savePinAuthNextDateAttempt(nextAttemptDate.current);

    return false;
  }, []);

  useEffect(() => {
    if (inputPin.length < DEFAULT_PIN_LENGTH) {
      return;
    }

    const isUserBlocked = checkUserTemporaryBlock();

    if (isUserBlocked) {
      return;
    }

    validatePin(inputPin);
  }, [checkUserTemporaryBlock, inputPin, validatePin]);

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
    // Exported for tests purposes
    nextAttemptDate,
    attemptsCount,
  };
};
