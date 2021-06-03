import React from 'react';
import { Container, Text } from '@cardstack/components';

export const NetworkBadge = ({ networkName }: { networkName: string }) => (
  <Container
    backgroundColor="backgroundLightGray"
    paddingHorizontal={2}
    style={{ paddingVertical: 1 }}
    borderRadius={50}
    marginRight={2}
  >
    <Text color="networkBadge" fontSize={9} weight="bold">
      {`ON ${networkName.toUpperCase()}`}
    </Text>
  </Container>
);
