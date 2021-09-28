import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import {
  fetchUserDataFromCloud,
  isCloudBackupAvailable,
} from '../handlers/cloudBackup';
import { cloudPlatform } from '../utils/platform';
import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  Text,
} from '@cardstack/components';
import { useHideSplashScreen } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import logger from 'logger';

export default function WelcomeScreen() {
  const { navigate, replace } = useNavigation();
  const hideSplashScreen = useHideSplashScreen();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        logger.log(`downloading ${cloudPlatform} backup info...`);
        const isAvailable = await isCloudBackupAvailable();
        if (isAvailable && ios) {
          const data = await fetchUserDataFromCloud();
          setUserData(data);
          logger.log(`Downloaded ${cloudPlatform} backup info`);
        }
      } catch (e) {
        logger.log('error getting userData', e);
      } finally {
        hideSplashScreen();
      }
    };
    initialize();
  }, [hideSplashScreen]);

  const onCreateWallet = useCallback(async () => {
    replace(Routes.SWIPE_LAYOUT, {
      params: { emptyWallet: true },
      screen: Routes.WALLET_SCREEN,
    });
  }, [replace]);

  const showRestoreSheet = useCallback(() => {
    navigate(Routes.RESTORE_SHEET, {
      userData,
    });
  }, [navigate, userData]);

  return (
    <CenteredContainer
      backgroundColor="black"
      height="100%"
      justifyContent="flex-end"
    >
      <StatusBar barStyle="light-content" />
      <CenteredContainer
        height="100%"
        position="absolute"
        testID="welcome-screen"
      >
        <Icon name="cardstack" size={150} />

        <Text marginTop={4} variant="welcomeScreen">
          CARD WALLET
        </Text>
      </CenteredContainer>
      <Container height={118} justifyContent="space-between" marginBottom="24">
        <Button onPress={onCreateWallet} testID="new-wallet-button">
          Create a new account
        </Button>
        <Button
          onPress={showRestoreSheet}
          testID="already-have-wallet-button"
          variant="primary"
        >
          Add an existing account
        </Button>
      </Container>
    </CenteredContainer>
  );
}
