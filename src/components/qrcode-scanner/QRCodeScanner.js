import React, { useEffect, useRef } from 'react';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';
import styled from 'styled-components';
import { ErrorText } from '../text';
import QRCodeScannerCrosshair from './QRCodeScannerCrosshair';
import QRCodeScannerNeedsAuthorization from './QRCodeScannerNeedsAuthorization';
import { CenteredContainer, Container } from '@cardstack/components';
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
  enableCamera,
}) {
  const [error, showError] = useBooleanState();
  const [isInitialized, setInitialized] = useBooleanState();
  const { result: isEmulator } = useIsEmulator();
  const { isCameraAuthorized, onScan } = useScanner(enableCamera);

  const showErrorMessage = error && !isInitialized;
  const showCrosshair = !error && !showErrorMessage;
  const cameraRef = useRef();

  useEffect(() => {
    if (ios || !isInitialized) {
      return;
    }
    if (enableCamera) {
      cameraRef.current?.resumePreview?.();
    } else {
      cameraRef.current?.pausePreview?.();
    }
  }, [enableCamera, isInitialized]);

  return (
    <Container backgroundColor="black">
      <CenteredContainer backgroundColor="white" height="100%">
        {enableCamera && isEmulator && <EmulatorCameraFallback />}
        {(enableCamera || android) && !isEmulator && (
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
          {showErrorMessage && <ErrorText error="Error mounting camera" />}
          {showCrosshair && <QRCodeScannerCrosshair />}
        </CenteredContainer>
      ) : (
        <QRCodeScannerNeedsAuthorization />
      )}
    </Container>
  );
}
