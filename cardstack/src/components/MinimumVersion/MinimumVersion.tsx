import React, { useCallback } from 'react';

import { Linking, NativeModules } from 'react-native';
import CardWalletLogo from '../../assets/cardstackLogo.png';
import PeopleIllustrationBackground from '../../assets/people-ill-bg.png';
import {
  Button,
  Container,
  Image,
  Text,
  CenteredContainer,
} from '@cardstack/components';
import { Device, screenHeight, screenWidth } from '@cardstack/utils';

const strings = {
  title: 'There is a new version of Card Wallet.',
  subtitle: 'Update now for the best experience.',
  button: 'Update',
};

const screenWidthPercentage = {
  '100': screenWidth,
  '110': screenWidth * 1.1,
};

// Not quite sure about these magical numbers but it works
const Constants = {
  iconSize: screenWidth * 0.25,
  peopleBg: {
    container: {
      width: '107%',
      flex: 0.9,
    },
    image: {
      height: screenHeight * 0.48,
      width: screenWidthPercentage[Device.isAndroid ? 110 : 100],
      bottom: -25,
    },
  },
};

const getStoreOrBetaPath = () => {
  const paths = {
    ios: {
      store: `https://apps.apple.com/app/1549183378?mt=8`,
      testFlight: `https://beta.itunes.apple.com/v1/app/1549183378?mt=8`,
    },
    android:
      'https://play.google.com/store/apps/details?id=com.cardstack.cardpay',
  };

  if (Device.isAndroid) {
    return paths.android;
  } else {
    const { isTestFlight } = NativeModules?.RNTestFlight?.getConstants();

    return paths.ios[isTestFlight ? 'testFlight' : 'store'];
  }
};

export const MinimumVersion = () => {
  const onUpdatePress = useCallback(() => {
    const url = getStoreOrBetaPath();

    Linking.openURL(url);
  }, []);

  return (
    <Container backgroundColor="backgroundBlue" flex={1}>
      <CenteredContainer flex={1} justifyContent="flex-end">
        <Image
          height={Constants.iconSize}
          source={CardWalletLogo}
          width={Constants.iconSize}
        />
        <Container padding={8}>
          <Text color="white" fontWeight="bold" size="body" textAlign="center">
            {strings.title}
          </Text>
          <Text color="white" size="body" textAlign="center">
            {strings.subtitle}
          </Text>
        </Container>
        <Container>
          <Button onPress={onUpdatePress}>{strings.button}</Button>
        </Container>
      </CenteredContainer>
      <Container
        flex={Constants.peopleBg.container.flex}
        width={Constants.peopleBg.container.width}
      >
        <Image
          width={Constants.peopleBg.image.width}
          height={Constants.peopleBg.image.height}
          overflow="visible"
          alignSelf="center"
          position="absolute"
          bottom={Constants.peopleBg.image.bottom}
          source={PeopleIllustrationBackground}
        />
      </Container>
    </Container>
  );
};
