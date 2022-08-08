import React, { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';

import {
  Button,
  Container,
  MainHeader,
  MerchantContent,
  Text,
} from '@cardstack/components';
import { isLayer1 } from '@cardstack/utils';

import { CreateProfile, strings } from './components';
import { useProfileScreen } from './useProfileScreen';

const ProfileScreen = () => {
  const {
    // Todo: handle retry on error.
    // error: safeCreationError,
    primarySafe,
    showLoading,
    isCreatingProfile,
    safesCount,
    isFetching,
    network,
    refetch,
    redirectToSwitchNetwork,
  } = useProfileScreen();

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
        <CreateProfile />
      ),
    [primarySafe, safesCount, isFetching, refetch]
  );

  return (
    <Container
      backgroundColor={
        primarySafe && !showLoading ? 'white' : 'backgroundDarkPurple'
      }
      flex={1}
    >
      <MainHeader title={strings.header.profile} />
      <Container
        justifyContent="center"
        flex={1}
        paddingHorizontal={isLayer1(network) ? 5 : 0}
      >
        {isLayer1(network) ? (
          <>
            <Text color="white" fontSize={24}>
              {strings.switchToGnosisChain}
            </Text>
            <Button
              borderColor="buttonSecondaryBorder"
              marginTop={10}
              onPress={redirectToSwitchNetwork}
              variant="primary"
            >
              {strings.switchNetwork}
            </Button>
          </>
        ) : showLoading ? (
          <>
            {isCreatingProfile && (
              <Text
                variant="semibold"
                color="white"
                textAlign="center"
                fontSize={16}
                paddingBottom={4}
              >
                {strings.ongoingProfileCreation}
              </Text>
            )}
            <ActivityIndicator size="large" />
          </>
        ) : (
          ProfileBody
        )}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
