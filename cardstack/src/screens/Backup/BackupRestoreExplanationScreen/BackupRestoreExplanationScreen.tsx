import React, { memo, useCallback } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
} from '@cardstack/components';
import { Device } from '@cardstack/utils';

import { strings } from './strings';

const BackupRestoreExplanationScreen = () => {
  const handleRestoreCloudOnPress = useCallback(() => {
    // TBD
  }, []);

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
          <Button onPress={handleRestoreCloudOnPress} marginBottom={4}>
            {strings.primaryBtn}
          </Button>
          <Button variant="linkWhite" onPress={handleRecoveryPhraseOnPress}>
            {strings.secondaryBtn(Device.cloudPlatform)}
          </Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupRestoreExplanationScreen);
