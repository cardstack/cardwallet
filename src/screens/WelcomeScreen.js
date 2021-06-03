import React, { useCallback, useEffect, useState } from 'react';
import { Image, StatusBar } from 'react-native';
import logo from '../../cardstack/src/assets/cardstackLogo.png';
import {
  fetchUserDataFromCloud,
  isCloudBackupAvailable,
} from '../handlers/cloudBackup';
import { cloudPlatform } from '../utils/platform';
import {
  Button,
  CenteredContainer,
  Container,
  Text,
} from '@cardstack/components';
import { useHideSplashScreen, useInitializeWallet } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import logger from 'logger';

export default function WelcomeScreen() {
  const { navigate, replace } = useNavigation();
  const hideSplashScreen = useHideSplashScreen();
  const [userData, setUserData] = useState(null);
  const initializeWallet = useInitializeWallet();
  const [creatingWallet, setCreatingWallet] = useState(false);

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
    // setCreatingWallet(true);

    // await initializeWallet();

    replace(Routes.SWIPE_LAYOUT, {
      params: { emptyWallet: true },
      screen: Routes.WALLET_SCREEN,
    });

    // setCreatingWallet(false);
  }, [navigate, initializeWallet]);

  const showRestoreSheet = useCallback(() => {
    navigate(Routes.RESTORE_SHEET, {
      userData,
    });
  }, [navigate, userData]);

  return (
    <CenteredContainer
      backgroundColor="backgroundBlue"
      height="100%"
      justifyContent="flex-end"
    >
      <StatusBar barStyle="light-content" />
      <CenteredContainer
        height="100%"
        position="absolute"
        testID="welcome-screen"
      >
        <Container height={88} width={88}>
          <Image
            source={logo}
            style={{
              height: '100%',
              resizeMode: 'contain',
              width: '100%',
            }}
          />
        </Container>
        <Text marginTop={4} variant="welcomeScreen">
          CARD PAY
        </Text>
      </CenteredContainer>
      <Container height={118} justifyContent="space-between" marginBottom="24">
        <Button
          disabled={creatingWallet}
          onPress={onCreateWallet}
          testID="new-wallet-button"
        >
          Create a new account
        </Button>
        <Button
          disabled={creatingWallet}
          onPress={showRestoreSheet}
          testID="already-have-wallet-button"
          variant="blue"
        >
          Add an existing account
        </Button>
      </Container>
    </CenteredContainer>
  );
}
