import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';
import { useIsFocused } from '@react-navigation/core';
import PeopleIllustrationBackground from '../../../assets/people-ill-bg.png';

import { strings, QRCodeOverlay, QRCodeScannerNeedsAuthorization } from '.';
import {
  CenteredContainer,
  Container,
  Text,
  Icon,
  IconName,
  ContainerProps,
  Image,
  AbsoluteFullScreenContainer,
} from '@cardstack/components';
import { useBooleanState, useScanner } from '@rainbow-me/hooks';
import { colors } from '@cardstack/theme';

export const QRCodeScanner = memo(() => {
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
            notAuthorizedView={<QRCodeScannerNeedsAuthorization />}
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
        <Container flex={0.7} alignItems="center" justifyContent="center">
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
});

const IconWrapper = ({
  iconName,
  text,
  ...props
}: {
  iconName: IconName;
  text: string;
} & ContainerProps) => (
  <CenteredContainer flex={1} {...props}>
    <Icon name={iconName} size={20} />
    <Text fontSize={14} color="white" weight="bold" marginTop={3}>
      {text}
    </Text>
  </CenteredContainer>
);

const BottomIconsSection = (props: ContainerProps) => (
  <Container flexDirection="row" {...props}>
    <IconWrapper
      iconName="pay-icon"
      text={strings.pay}
      borderRightWidth={1}
      borderRightColor="whiteTinyLightOpacity"
    />
    <IconWrapper iconName="connect-icon" text={strings.connect} />
  </Container>
);
