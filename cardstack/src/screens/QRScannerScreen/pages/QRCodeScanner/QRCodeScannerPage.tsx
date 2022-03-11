import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';
import { useIsFocused } from '@react-navigation/core';
import PeopleIllustrationBackground from '../../../../assets/people-ill-bg.png';
import {
  CameraNotAuthorizedView,
  QRCodeOverlay,
  BottomIconsSection,
  crosshair,
  CROSSHAIR_SIZE,
} from './components';
import { strings } from './strings';
import { useScanner } from './useScanner';
import {
  Container,
  Text,
  Image,
  AbsoluteFullScreenContainer,
} from '@cardstack/components';
import { useBooleanState } from '@rainbow-me/hooks';
import { colors } from '@cardstack/theme';

const styles = StyleSheet.create({
  loadingContainer: { paddingTop: CROSSHAIR_SIZE * 0.45 },
  bottomSectionContainer: {
    paddingTop: crosshair.position.y + CROSSHAIR_SIZE * 1.05,
  },
});

const QRCodeScannerPage = () => {
  const [error, showError] = useBooleanState();

  const { result: isEmulator } = useIsEmulator();

  const { onScan, isLoading } = useScanner();

  const isFocused = useIsFocused();

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
      ) : (
        isFocused && (
          <RNCamera
            captureAudio={false}
            notAuthorizedView={<CameraNotAuthorizedView />}
            onBarCodeRead={onScan}
            onMountError={showError}
            style={StyleSheet.absoluteFillObject}
          />
        )
      )}
      <AbsoluteFullScreenContainer zIndex={1}>
        <QRCodeOverlay />
      </AbsoluteFullScreenContainer>
      <AbsoluteFullScreenContainer
        zIndex={1}
        alignItems="center"
        top={crosshair.position.y}
      >
        <Container style={styles.loadingContainer}>
          {error ? (
            <Text textAlign="center" fontSize={20} color="white">
              {strings.cameraMountError}
            </Text>
          ) : (
            isLoading && (
              <Container>
                <ActivityIndicator size="large" color={colors.teal} />
              </Container>
            )
          )}
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
                {strings.scanQRCodeText}
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
