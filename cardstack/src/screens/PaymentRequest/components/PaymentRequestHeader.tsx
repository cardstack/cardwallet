import React from 'react';

import { Container, Text } from '@cardstack/components';

export const PaymentRequestHeader = () => (
  <Container
    alignItems="center"
    flexDirection="column"
    paddingVertical={1}
    width="100%"
  >
    <Text size="body" weight="extraBold">
      Request Payment
    </Text>
  </Container>
);
