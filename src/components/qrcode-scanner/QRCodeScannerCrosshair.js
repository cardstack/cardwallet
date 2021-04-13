import React from 'react';
import { useIsEmulator } from 'react-native-device-info';
import qrcodebg from '../../../cardstack/src/assets/QRCodeBackground.png';
import {
  CenteredContainer,
  Image,
  Text,
} from '../../../cardstack/src/components/.';
import { useDimensions } from '@rainbow-me/hooks';

const CrossHairAspectRatio = 259 / 375;

export default function QRCodeScannerCrosshair() {
  const { width: deviceWidth } = useDimensions();
  const { result: isEmulator } = useIsEmulator();

  return (
    <CenteredContainer
      height={deviceWidth * CrossHairAspectRatio}
      marginBottom={1}
      width={deviceWidth * CrossHairAspectRatio}
      zIndex={1}
    >
      <Image source={qrcodebg} style={{ position: 'absolute' }} />
      <Text color="white" size="small" textAlign="center" weight="bold">
        {isEmulator ? `Simulator Mode\n (Paste in URI Code)` : 'Scan QR Code'}
      </Text>
    </CenteredContainer>
  );
}
