import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { memo, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import {
  Container,
  Text,
  Image,
  AbsoluteFullScreenContainer,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';

import { networkInfo } from '@rainbow-me/helpers/networkInfo';

import PeopleIllustrationBackground from '../../../../assets/people-ill-bg.png';

import {
  CameraNotAuthorizedView,
  QRCodeOverlay,
  BottomIconsSection,
  crosshair,
  CROSSHAIR_SIZE,
} from './components';
import { strings } from './strings';
import { useQRCodeScannerPage } from './useQRCodeScannerPage';
import { useScannerParams } from './useScanner';

const styles = StyleSheet.create({
  loadingContainer: { paddingTop: CROSSHAIR_SIZE * 0.45 },
  bottomSectionContainer: {
    paddingTop: crosshair.position.y + CROSSHAIR_SIZE * 1.05,
  },
});

type QRCodeScannerProps = useScannerParams;

const QRCodeScannerPage = (props: QRCodeScannerProps) => {
  const {
    isCameraAllowed,
    error,
    isLoading,
    showError,
    isEmulator,
    network,
    onScan,
    isFocused,
    onEnableCameraPress,
  } = useQRCodeScannerPage(props);

  const renderErrorOrLoading = useMemo(
    () =>
      error ? (
        <Text textAlign="center" fontSize={20} color="white">
          {strings.cameraMountError}
        </Text>
      ) : (
        <ActivityIndicator
          size="large"
          color={colors.teal}
          animating={isLoading && isFocused}
        />
      ),
    [error, isFocused, isLoading]
  );

  return (
    <AbsoluteFullScreenContainer
      zIndex={-1}
      backgroundColor={isFocused ? 'transparent' : 'backgroundDarkPurple'}
    >
      {isEmulator ? (
        <Image
          source={PeopleIllustrationBackground}
          flex={1}
          alignSelf="center"
          zIndex={1}
        />
      ) : isFocused && isCameraAllowed ? (
        <Camera
          barCodeScannerSettings={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={onScan}
          onMountError={showError}
          style={StyleSheet.absoluteFillObject}
          ratio="16:9"
        />
      ) : (
        <CameraNotAuthorizedView onEnableCameraPress={onEnableCameraPress} />
      )}
      <AbsoluteFullScreenContainer zIndex={1}>
        <QRCodeOverlay />
      </AbsoluteFullScreenContainer>
      <AbsoluteFullScreenContainer
        zIndex={0}
        alignItems="center"
        top={crosshair.position.y}
      >
        <Container style={styles.loadingContainer} flex={1}>
          {renderErrorOrLoading}
        </Container>
      </AbsoluteFullScreenContainer>
      <AbsoluteFullScreenContainer
        zIndex={1}
        alignItems="center"
        justifyContent="center"
      >
        <Container flex={1} width="100%" style={styles.bottomSectionContainer}>
          <Container justifyContent="space-between" flex={0.8}>
            <Container flex={0.6}>
              <Text textAlign="center" fontSize={20} color="white">
                {strings.scanQRCodeText(networkInfo[network].name)}
              </Text>
            </Container>
            <BottomIconsSection flex={0.6} />
          </Container>
        </Container>
      </AbsoluteFullScreenContainer>
    </AbsoluteFullScreenContainer>
  );
};

export default memo(QRCodeScannerPage);
