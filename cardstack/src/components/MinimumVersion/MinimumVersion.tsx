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
import { screenHeight, screenWidth } from '@cardstack/utils';

const strings = {
  title: 'There is a new version of Card Wallet.',
  subtitle: 'Update now for the best experience.',
  button: 'Update',
};

const paths = {
  appStore: {
    uri: `itms-apps://apps.apple.com/app/1549183378?mt=8`,
    url: `https://apps.apple.com/app/1549183378?mt=8`,
  },
  testFlight: {
    uri: `itms-beta://beta.itunes.apple.com/v1/app/1549183378?mt=8`,
    url: `https://beta.itunes.apple.com/v1/app/1549183378?mt=8`,
  },
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
      width: screenWidth,
      bottom: -25,
    },
  },
};

const handleUriOrUrl = ({ uri, url }: { uri: string; url: string }) => {
  Linking.canOpenURL(uri).then(supported => {
    if (supported) {
      Linking.openURL(uri);
    } else {
      Linking.openURL(url);
    }
  });
};

export const MinimumVersion = () => {
  const onUpdatePress = useCallback(() => {
    const { isTestFlight } = NativeModules.RNTestFlight.getConstants();

    handleUriOrUrl(paths[isTestFlight ? 'testFlight' : 'appStore']);
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
