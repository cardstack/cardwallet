import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
} from '@cardstack/components';
import { useSelectedWallet } from '@cardstack/hooks';
import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { Routes } from '@cardstack/navigation';
import { usePersistedFlagsActions } from '@cardstack/redux/persistedFlagsSlice';

import { strings } from './strings';

const BackupExplanationScreen = () => {
  const { navigate } = useNavigation();
  const { seedPhrase } = useSelectedWallet();

  const { navigateOnboardingTo } = useShowOnboarding();

  const { triggerSkipBackup } = usePersistedFlagsActions();

  const handleBackupOnPress = useCallback(() => {
    navigate(Routes.BACKUP_MANUAL_BACKUP, { seedPhrase });
  }, [navigate, seedPhrase]);

  const handleLaterOnPress = useCallback(() => {
    triggerSkipBackup();
    navigateOnboardingTo(Routes.PROFILE_SLUG);
  }, [triggerSkipBackup, navigateOnboardingTo]);

  return (
    <PageWithStackHeader
      canGoBack={false}
      skipPressCallback={handleLaterOnPress}
    >
      <Container flex={1} width="90%">
        <Text variant="pageHeader" paddingBottom={4}>
          {strings.title}
        </Text>
        <Text color="grayText" letterSpacing={0.4}>
          {strings.description}
        </Text>
      </Container>
      <PageWithStackHeaderFooter>
        <CenteredContainer>
          <Button onPress={handleBackupOnPress} marginBottom={4}>
            {strings.primaryBtn}
          </Button>
          <Button variant="linkWhite" onPress={handleLaterOnPress}>
            {strings.secondaryBtn}
          </Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupExplanationScreen);
