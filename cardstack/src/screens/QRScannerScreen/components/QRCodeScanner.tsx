import { useFocusEffect } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { InteractionManager, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';
import styled from 'styled-components';
import PeopleIllustrationBackground from '../../../assets/people-ill-bg.png';
import QRCodeScannerCrosshair from './QRCodeScannerCrosshair';
import QRCodeScannerNeedsAuthorization from './QRCodeScannerNeedsAuthorization';
import { CenteredContainer, Container, Text } from '@cardstack/components';
import { useBooleanState, useScanner } from '@rainbow-me/hooks';
import { ImgixImage } from '@rainbow-me/images';
import { position } from '@rainbow-me/styles';

const EmulatorCameraFallback = styled(ImgixImage).attrs({
  source: PeopleIllustrationBackground,
})`
  ${position.cover};
  ${position.size('100%')};
`;

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});

interface QRCodeScannerProps {
  contentPositionBottom: number;
  contentPositionTop: number;
}

const QRCodeScanner = ({
  contentPositionBottom,
  contentPositionTop,
}: QRCodeScannerProps) => {
  const [error, showError] = useBooleanState();
  const { result: isEmulator } = useIsEmulator();

  const [cameraEnableState, enableCamera, disableCamera] = useBooleanState(
    false
  );

  const { isCameraAuthorized, isScanningEnabled, onScan } = useScanner(
    cameraEnableState
  );

  useFocusEffect(
    useCallback(() => {
      InteractionManager.runAfterInteractions(() => {
        enableCamera();
      });

      return () => disableCamera();
    }, [disableCamera, enableCamera])
  );

  if (!cameraEnableState) return null;

  return (
    <Container backgroundColor="transparent">
      <CenteredContainer backgroundColor="transparent" height="100%">
        {isEmulator ? (
          <EmulatorCameraFallback />
        ) : (
          <RNCamera
            captureAudio={false}
            notAuthorizedView={<QRCodeScannerNeedsAuthorization />}
            onBarCodeRead={onScan}
            onMountError={showError}
            style={styles.camera}
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
            <Text>Error mounting camera"</Text>
          ) : (
            <QRCodeScannerCrosshair isScanningEnabled={isScanningEnabled} />
          )}
        </CenteredContainer>
      ) : null}
    </Container>
  );
};

export default memo(QRCodeScanner);
