import React, { memo, useCallback } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
} from '@cardstack/components';

import { strings } from './strings';
import { useBackupRestoreExplanationScreen } from './useBackupRestoreExplanationScreen';

const BackupRestoreExplanationScreen = () => {
  const { handleRestoreCloudOnPress } = useBackupRestoreExplanationScreen();

  const handleRecoveryPhraseOnPress = useCallback(() => {
    // TBD
  }, []);

  return (
    <PageWithStackHeader showSkip={false}>
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
          <Button onPress={handleRecoveryPhraseOnPress} marginBottom={4}>
            {strings.primaryBtn}
          </Button>
          <Button variant="linkWhite" onPress={handleRestoreCloudOnPress}>
            {strings.secondaryBtn}
          </Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupRestoreExplanationScreen);
