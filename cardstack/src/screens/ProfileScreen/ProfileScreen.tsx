import React, { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';

import {
  Button,
  Container,
  MainHeader,
  MerchantContent,
  Text,
} from '@cardstack/components';

import { useSendFeedback } from '@rainbow-me/hooks';

import { CreateProfile, CreateProfileError, strings } from './components';
import { useProfileScreen } from './useProfileScreen';

const ProfileScreen = () => {
  const {
    primarySafe,
    showLoading,
    isCreatingProfile,
    isCreateProfileError,
    retryCurrentCreateProfile,
    isConnectionError,
    safesCount,
    isFetching,
    isOnCardPayNetwork,
    refetch,
    redirectToSwitchNetwork,
  } = useProfileScreen();

  const onSendSupport = useSendFeedback();

  const error = useMemo(() => {
    if (isCreateProfileError) {
      return strings.profileError;
    }

    if (isConnectionError) {
      return strings.connectionError;
    }

    return undefined;
  }, [isCreateProfileError, isConnectionError]);

  const renderProfileContent = useMemo(() => {
    if (!isOnCardPayNetwork) {
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

    if (error) {
      return (
        <CreateProfileError
          onPressRetry={retryCurrentCreateProfile}
          onPressSupport={onSendSupport}
          error={error}
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
        <Container backgroundColor="white" flex={1}>
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
  }, [
    error,
    isCreatingProfile,
    isFetching,
    isOnCardPayNetwork,
    onSendSupport,
    primarySafe,
    redirectToSwitchNetwork,
    refetch,
    retryCurrentCreateProfile,
    safesCount,
    showLoading,
  ]);

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title={strings.header.profile} />
      <Container
        justifyContent="center"
        flex={1}
        paddingHorizontal={isOnCardPayNetwork ? 0 : 5}
      >
        {renderProfileContent}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
