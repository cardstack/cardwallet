import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';
import styled from 'styled-components';
import { ErrorText } from '../text';
import QRCodeScannerCrosshair from './QRCodeScannerCrosshair';
import QRCodeScannerNeedsAuthorization from './QRCodeScannerNeedsAuthorization';
import { CenteredContainer, Container } from '@cardstack/components';
import { Device } from '@cardstack/utils';
import SimulatorFakeCameraImageSource from '@rainbow-me/assets/simulator-fake-camera-image.jpg';
import { useBooleanState, useScanner } from '@rainbow-me/hooks';
import { ImgixImage } from '@rainbow-me/images';
import { position } from '@rainbow-me/styles';

const EmulatorCameraFallback = styled(ImgixImage).attrs({
  source: SimulatorFakeCameraImageSource,
})`
  ${position.cover};
  ${position.size('100%')};
`;

export default function QRCodeScanner({
  contentPositionBottom,
  contentPositionTop,
}) {
  const [error, showError] = useBooleanState();
  const [isInitialized, setInitialized] = useBooleanState(Device.isIOS);
  const { result: isEmulator } = useIsEmulator();
  const [cameraEnableState, enableCamera, disableCamera] = useBooleanState(
    false
  );
  const { isCameraAuthorized, onScan } = useScanner(cameraEnableState);
  const cameraRef = useRef();

  useFocusEffect(
    useCallback(() => {
      InteractionManager.runAfterInteractions(() => {
        enableCamera();
      });
      return () => disableCamera();
    }, [disableCamera, enableCamera])
  );

  useEffect(() => {
    if (Device.isIOS || !isInitialized) {
      return;
    }
    if (cameraEnableState) {
      cameraRef.current?.resumePreview?.();
    } else {
      cameraRef.current?.pausePreview?.();
    }
  }, [cameraEnableState, isInitialized]);

  if (!cameraEnableState) return null;

  return (
    <Container backgroundColor="transparent">
      <CenteredContainer backgroundColor="transparent" height="100%">
        {isEmulator ? (
          <EmulatorCameraFallback />
        ) : (
          <RNCamera
            captureAudio={false}
            notAuthorizedView={QRCodeScannerNeedsAuthorization}
            onBarCodeRead={onScan}
            onCameraReady={setInitialized}
            onMountError={showError}
            pendingAuthorizationView={null}
            ref={cameraRef}
            style={{
              height: '100%',
              bottom: 0,
              left: 0,
              position: 'absolute',
              right: 0,
              top: 0,
              backgroundColor: 'transparent',
              zIndex: 1,
            }}
          />
        )}
      </CenteredContainer>
      {isCameraAuthorized ? (
        <CenteredContainer
          bottom={contentPositionBottom}
          position="absolute"
          top={contentPositionTop}
          width="100%"
        >
          {error ? (
            <ErrorText error="Error mounting camera" />
          ) : (
            isInitialized && <QRCodeScannerCrosshair />
          )}
        </CenteredContainer>
      ) : (
        <QRCodeScannerNeedsAuthorization />
      )}
    </Container>
  );
}
