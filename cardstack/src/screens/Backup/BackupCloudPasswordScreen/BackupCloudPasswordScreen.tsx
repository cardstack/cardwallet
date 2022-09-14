import React from 'react';

import { Container, PageWithStackHeader, Text } from '@cardstack/components';

import { strings } from './strings';

export const BackupCloudPasswordScreen = () => {
  return (
    <PageWithStackHeader showSkip={false}>
      <Container width="80%">
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
