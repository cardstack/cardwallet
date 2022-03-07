import { useFocusEffect } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { InteractionManager, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';
import PeopleIllustrationBackground from '../../../assets/people-ill-bg.png';
import {
  QRCodeScannerCrosshair,
  QRCodeScannerNeedsAuthorization,
  strings,
  CROSS_HAIR_TOP,
  EmulatorPasteUriButton,
  SWITCH_SELECTOR_TOP,
  QRCodeOverlay,
} from './';
import {
  CenteredContainer,
  Container,
  Text,
  Image,
  Icon,
} from '@cardstack/components';
import { useBooleanState, useScanner } from '@rainbow-me/hooks';
import { screenHeight, screenWidth } from '@cardstack/utils';

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    backgroundColor: '#777',
    zIndex: 0,
  },
});

export const QRCodeScanner = memo(() => {
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

  return (
    <CenteredContainer
      height="100%"
      width="100%"
      position="relative"
      backgroundColor="transparent"
    >
      {isEmulator ? (
        <>
          <Image
            source={PeopleIllustrationBackground}
            backgroundColor="buttonDisabledBackground"
            position="absolute"
            height={screenHeight}
            width={screenWidth}
            alignSelf="center"
          />
        </>
      ) : cameraEnableState ? (
        <RNCamera
          captureAudio={false}
          notAuthorizedView={<QRCodeScannerNeedsAuthorization />}
          onBarCodeRead={onScan}
          onMountError={showError}
          style={styles.camera}
        />
      ) : null}
      <QRCodeOverlay />
      {isCameraAuthorized ? (
        <CenteredContainer
          position="absolute"
          top={CROSS_HAIR_TOP}
          width="100%"
          zIndex={1}
        >
          {error ? (
            <Text textAlign="center" fontSize={20} color="white">
              {strings.cameraMountError}
            </Text>
          ) : (
            <CenteredContainer>
              <QRCodeScannerCrosshair isScanningEnabled={isScanningEnabled} />
              <Text textAlign="center" fontSize={20} color="white">
                {strings.scanQRCodeText}
              </Text>
              <Container
                flexDirection="row"
                width="100%"
                height={100}
                marginTop={6}
              >
                <Container
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  borderRightWidth={1}
                  borderRightColor="whiteTinyLightOpacity"
                >
                  <Icon name="pay-icon" />
                  <Text
                    fontSize={14}
                    color="white"
                    fontWeight="600"
                    marginTop={2}
                  >
                    {strings.pay}
                  </Text>
                </Container>
                <Container flex={1} justifyContent="center" alignItems="center">
                  <Icon name="connect-icon" />
                  <Text
                    fontSize={14}
                    color="white"
                    fontWeight="600"
                    marginTop={2}
                  >
                    {strings.connect}
                  </Text>
                </Container>
              </Container>
            </CenteredContainer>
          )}
        </CenteredContainer>
      ) : null}
      <Container
        position="absolute"
        right={0}
        top={SWITCH_SELECTOR_TOP + 10}
        zIndex={2}
      >
        <EmulatorPasteUriButton />
      </Container>
    </CenteredContainer>
  );
});
