import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useCallback } from 'react';

import {
  Button,
  Container,
  MainHeader,
  MerchantContent,
  Text,
} from '@cardstack/components';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { isLayer1 } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import { SettingsPages } from '@rainbow-me/screens/SettingsModal';

import { CreateProfile, strings } from './components';

const ProfileScreen = () => {
  const { navigate } = useNavigation();
  const { primarySafe, isFetching, refetch, safesCount } = usePrimarySafe();
  const { network } = useAccountSettings();

  const ProfileBody = useMemo(
    () =>
      primarySafe ? (
        <MerchantContent
          showSafePrimarySelection={safesCount > 1}
          isPrimarySafe
          merchantSafe={primarySafe}
          isRefreshingBalances={isFetching}
          refetch={refetch}
        />
      ) : (
        <CreateProfile isLoading={isFetching} />
      ),
    [primarySafe, isFetching, safesCount, refetch]
  );

  const redirectToSwitchNetwork = useCallback(() => {
    navigate(Routes.SETTINGS_MODAL, {
      initialRoute: SettingsPages.network.key,
    });
  }, [navigate]);

  return (
    <Container
      backgroundColor={primarySafe ? 'white' : 'backgroundDarkPurple'}
      flex={1}
    >
      <MainHeader title={strings.header.profile} />
      <Container
        justifyContent="center"
        flexGrow={1}
        paddingHorizontal={isLayer1(network) ? 5 : 0}
      >
        {isLayer1(network) ? (
          <>
            <Text color="white" fontSize={24}>
              {strings.stepOne.switchToGnosisChain}
            </Text>
            <Button
              borderColor="buttonSecondaryBorder"
              marginTop={10}
              onPress={redirectToSwitchNetwork}
              variant="primary"
            >
              {strings.stepOne.switchNetwork}
            </Button>
          </>
        ) : (
          ProfileBody
        )}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
