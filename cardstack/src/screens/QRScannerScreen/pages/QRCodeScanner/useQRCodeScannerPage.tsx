import { useIsFocused } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { useIsEmulator } from 'react-native-device-info';

import { useBooleanState } from '@cardstack/hooks';

import { useAccountSettings } from '@rainbow-me/hooks';

import { useScanner, useScannerParams } from './useScanner';

export const useQRCodeScannerPage = (props: useScannerParams) => {
  const [isCameraAllowed, setCameraAllowed] = useBooleanState();
  const { onScan, isLoading } = useScanner(props);
  const { result: isEmulator } = useIsEmulator();
  const [error, showError] = useBooleanState();
  const { network } = useAccountSettings();
  const isFocused = useIsFocused();

  const requestPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    status === 'granted' && setCameraAllowed();
  }, [setCameraAllowed]);

  const onEnableCameraPress = useCallback(async () => {
    const {
      status: prevStatus,
      canAskAgain,
    } = await Camera.getCameraPermissionsAsync();

    if (prevStatus === 'denied' && !canAskAgain) {
      Linking.openSettings();

      return;
    }

    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    if (isFocused && !isCameraAllowed) {
      requestPermission();
    }
  }, [requestPermission, isFocused, isCameraAllowed]);

  return {
    onEnableCameraPress,
    isCameraAllowed,
    isEmulator,
    isLoading,
    showError,
    isFocused,
    network,
    onScan,
    error,
  };
};
