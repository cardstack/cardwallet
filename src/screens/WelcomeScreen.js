import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'react-native';
import logo from '../../cardstack/src/assets/cardstackLogo.png';
import {
  fetchUserDataFromCloud,
  isCloudBackupAvailable,
} from '../handlers/cloudBackup';
import { cloudPlatform } from '../utils/platform';
import { Button, CenteredContainer, Container } from '@cardstack/components';
import { useHideSplashScreen } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import logger from 'logger';

export default function WelcomeScreen() {
  const { replace, navigate } = useNavigation();
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
      backgroundColor="backgroundBlue"
      height="100%"
      justifyContent="flex-end"
    >
      <CenteredContainer
        height="100%"
        position="absolute"
        testID="welcome-screen"
      >
        <Container height={88} width={88}>
          <Image
            source={logo}
            style={{
              resizeMode: 'contain',
              height: '100%',
              width: '100%',
            }}
          />
        </Container>
      </CenteredContainer>
      <Container paddingBottom="24">
        <Button onPress={onCreateWallet} testID="new-wallet-button">
          Create a new account
        </Button>
        <Button
          marginTop={5}
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
