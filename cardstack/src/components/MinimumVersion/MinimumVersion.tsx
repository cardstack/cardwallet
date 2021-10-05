import React, { useCallback } from 'react';

import { Linking, NativeModules } from 'react-native';
import CardWalletLogo from '../../assets/cardstackLogo.png';
import {
  Button,
  Container,
  Image,
  Text,
  CenteredContainer,
} from '@cardstack/components';

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

const Constants = {
  iconSize: 90,
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
    <CenteredContainer backgroundColor="backgroundBlue" flex={1}>
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
  );
};
