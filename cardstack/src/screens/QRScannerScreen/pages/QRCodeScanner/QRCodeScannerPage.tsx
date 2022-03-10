import React, { memo, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';
import { useIsFocused } from '@react-navigation/core';
import PeopleIllustrationBackground from '../../../../assets/people-ill-bg.png';
import {
  CameraNotAuthorizedView,
  QRCodeOverlay,
  BottomIconsSection,
} from './components';
import { strings } from './strings';
import { useScanner } from './useScanner';
import {
  Container,
  Text,
  Image,
  AbsoluteFullScreenContainer,
} from '@cardstack/components';
import { useBooleanState, useDimensions } from '@rainbow-me/hooks';
import { colors } from '@cardstack/theme';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';

const QRCodeScannerPage = () => {
  const [error, showError] = useBooleanState();

  const { result: isEmulator } = useIsEmulator();

  const { onScan, isLoading } = useScanner();

  const { isSmallPhone } = useDimensions();

  const isFocused = useIsFocused();

  // TODO: Remove after adding the header
  // start-block
  const { isTabBarEnabled } = useTabBarFlag();

  const flex = useMemo(() => (isTabBarEnabled || isSmallPhone ? 0.7 : 0.5), [
    isTabBarEnabled,
    isSmallPhone,
  ]);
  // end-block

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
        justifyContent="center"
      >
        <Container flex={flex} alignItems="center" justifyContent="center">
          <Container flex={0.35} justifyContent="flex-end">
            {error ? (
              <Text textAlign="center" fontSize={20} color="white">
                {strings.cameraMountError}
              </Text>
            ) : (
              isLoading && (
                <ActivityIndicator size="large" color={colors.teal} />
              )
            )}
          </Container>
        </Container>
        <Container flex={0.45} width="100%">
          <Container justifyContent="space-between" flex={0.5}>
            <Container flex={0.8}>
              <Text textAlign="center" fontSize={20} color="white">
                {strings.scanQRCodeText}
              </Text>
            </Container>
            <BottomIconsSection flex={1} />
          </Container>
        </Container>
      </AbsoluteFullScreenContainer>
    </AbsoluteFullScreenContainer>
  );
};

export default memo(QRCodeScannerPage);
