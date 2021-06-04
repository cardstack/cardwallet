import React from 'react';

import { Linking, NativeModules } from 'react-native';
import CardWalletLogo from '../../cardstack/src/assets/cardstackLogo.png';
import { Page } from '../components/layout';
import { Button, Container, Image, Text } from '@cardstack/components';
import { colors } from '@cardstack/theme';

const DEFAULT_MESSAGE =
  'There is a new version of Card Wallet. Update now for the best experience.';

export default function MinimumVersion() {
  function onDownloadNow() {
    const appStoreURI = `itms-apps://apps.apple.com/app/1549183378?mt=8`;
    const appStoreURL = `https://apps.apple.com/app/1549183378?mt=8`;

    const testFlightURI = `itms-beta://beta.itunes.apple.com/v1/app/1549183378?mt=8`;
    const testFlightURL = `https://beta.itunes.apple.com/v1/app/1549183378?mt=8`;

    const { isTestFlight } = NativeModules.RNTestFlight.getConstants();

    if (isTestFlight) {
      Linking.canOpenURL(testFlightURI).then(supported => {
        if (supported) {
          Linking.openURL(testFlightURI);
        } else {
          Linking.openURL(testFlightURL);
        }
      });
    } else {
      Linking.canOpenURL(appStoreURI).then(supported => {
        if (supported) {
          Linking.openURL(appStoreURI);
        } else {
          Linking.openURL(appStoreURL);
        }
      });
    }
  }

  return (
    <Page color={colors.backgroundBlue} flex={1}>
      <Container
        alignItems="center"
        flex={1}
        justifyContent="center"
        testID="maintenance-modal"
      >
        <Image source={CardWalletLogo} />
        <Container padding={8}>
          <Text color="underlineGray" textAlign="center">
            {DEFAULT_MESSAGE}
          </Text>
        </Container>
        <Container>
          <Button onPress={onDownloadNow}>Download Now</Button>
        </Container>
      </Container>
    </Page>
  );
}
