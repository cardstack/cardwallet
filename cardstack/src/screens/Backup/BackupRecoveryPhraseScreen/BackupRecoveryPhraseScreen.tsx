import React, { memo } from 'react';

import { Container, PageWithStackHeader, Text } from '@cardstack/components';

import { strings } from './strings';

const BackupRecoveryPhraseScreen = () => {
  return (
    <PageWithStackHeader>
      <Container flex={1} width="90%">
        <Text variant="pageHeader" paddingBottom={4}>
          {strings.title}
        </Text>
        <Text color="grayText" letterSpacing={0.4}>
          {strings.description}
        </Text>
      </Container>
    </PageWithStackHeader>
  );
};

export default memo(BackupRecoveryPhraseScreen);
