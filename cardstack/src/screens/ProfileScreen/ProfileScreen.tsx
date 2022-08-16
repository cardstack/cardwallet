import React from 'react';
import { ActivityIndicator, Alert } from 'react-native';

import {
  Button,
  Container,
  MainHeader,
  MerchantContent,
  Text,
} from '@cardstack/components';
import { isLayer1 } from '@cardstack/utils';

import { useSendFeedback } from '@rainbow-me/hooks';

import { CreateProfile, CreateProfileError, strings } from './components';
import { useProfileScreen } from './useProfileScreen';

// Todo: Extract errors from job-ticket api call.
const isError = true;

const ProfileScreen = () => {
  const {
    primarySafe,
    showLoading,
    isCreatingProfile,
    safesCount,
    isFetching,
    network,
    refetch,
    redirectToSwitchNetwork,
  } = useProfileScreen();

  const onSendSupport = useSendFeedback();

  const ProfileContent = () => {
    if (isLayer1(network)) {
      return (
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
      );
    }

    if (isError) {
      return (
        <CreateProfileError
          onPressRetry={() => Alert.alert('Not available yet')}
          onPressSupport={onSendSupport}
        />
      );
    }

    if (showLoading) {
      return (
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
      );
    }

    if (primarySafe) {
      return (
        <Container backgroundColor="white">
          <MerchantContent
            showSafePrimarySelection={safesCount > 1}
            isPrimarySafe
            merchantSafe={primarySafe}
            isRefreshingBalances={isFetching}
            refetch={refetch}
          />
        </Container>
      );
    }

    return <CreateProfile />;
  };

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title={strings.header.profile} />
      <Container
        justifyContent="center"
        flex={1}
        paddingHorizontal={isLayer1(network) ? 5 : 0}
      >
        <ProfileContent />
      </Container>
    </Container>
  );
};

export default ProfileScreen;
