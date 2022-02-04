import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useIsEmulator } from 'react-native-device-info';
import { CenteredContainer, Icon, Text } from '@cardstack/components';

import { useDimensions } from '@rainbow-me/hooks';

const CrossHairAspectRatio = 259 / 375;

export default function QRCodeScannerCrosshair({ isScanningEnabled }) {
  const { width: deviceWidth } = useDimensions();
  const { result: isEmulator } = useIsEmulator();
  const size = deviceWidth * CrossHairAspectRatio;

  return (
    <CenteredContainer height={size} marginBottom={10} width={size} zIndex={1}>
      <Icon color="white" name="crosshair" position="absolute" size={size} />
      {isScanningEnabled ? (
        <Text color="white" size="small" textAlign="center" weight="bold">
          {isEmulator ? `Simulator Mode\n (Paste in URI Code)` : 'Scan QR Code'}
        </Text>
      ) : (
        <ActivityIndicator color="white" size="large" />
      )}
    </CenteredContainer>
  );
}
