import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useIsEmulator } from 'react-native-device-info';
import { CenteredContainer, Text } from '@cardstack/components';

import { useDimensions } from '@rainbow-me/hooks';

const CrossHairAspectRatio = 259 / 375;

export function QRCodeScannerCrosshair({
  isScanningEnabled,
}: {
  isScanningEnabled: boolean;
}) {
  const { width: deviceWidth } = useDimensions();
  const { result: isEmulator } = useIsEmulator();
  const size = deviceWidth * CrossHairAspectRatio;

  return (
    <CenteredContainer height={size} marginBottom={10} width={size} zIndex={10}>
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
