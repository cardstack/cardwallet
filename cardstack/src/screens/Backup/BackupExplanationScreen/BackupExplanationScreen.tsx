import React, { memo } from 'react';

import { Container, PageWithStackHeader, Text } from '@cardstack/components';

import { strings } from './strings';

const BackupExplanationScreen = () => {
  return (
    <PageWithStackHeader>
      <Container>
        <Container width="90%" paddingBottom={4}>
          <Text variant="pageHeader">{strings.title}</Text>
        </Container>
      </Container>
    </PageWithStackHeader>
  );
};

export default memo(BackupExplanationScreen);
