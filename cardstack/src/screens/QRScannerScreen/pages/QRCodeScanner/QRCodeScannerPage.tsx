import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';

import {
  Container,
  Text,
  Image,
  AbsoluteFullScreenContainer,
} from '@cardstack/components';
import { useBooleanState } from '@cardstack/hooks';
import { colors } from '@cardstack/theme';

import { useAccountSettings } from '@rainbow-me/hooks';

import PeopleIllustrationBackground from '../../../../assets/people-ill-bg.png';

import {
  CameraNotAuthorizedView,
  QRCodeOverlay,
  BottomIconsSection,
  crosshair,
  CROSSHAIR_SIZE,
} from './components';
import { strings } from './strings';
import { useScanner, useScannerParams } from './useScanner';

const styles = StyleSheet.create({
  loadingContainer: { paddingTop: CROSSHAIR_SIZE * 0.45 },
  bottomSectionContainer: {
    paddingTop: crosshair.position.y + CROSSHAIR_SIZE * 1.05,
  },
});

type QRCodeScannerProps = useScannerParams;

const QRCodeScannerPage = (props: QRCodeScannerProps) => {
  const [error, showError] = useBooleanState();

  const { result: isEmulator } = useIsEmulator();

  const { network } = useAccountSettings();
  const networkName = getConstantByNetwork('name', network);

  const { onScan, isLoading } = useScanner(props);

  const isFocused = useIsFocused();

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
                {strings.scanQRCodeText(networkName)}
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
