import React from 'react';

import { Container, Button } from '@cardstack/components';

export const AssetFooter = () => (
  <Container
    bottom={80}
    flexDirection="row"
    justifyContent="space-between"
    padding={4}
    position="absolute"
    width="100%"
  >
    <Button small>Pin</Button>
    <Button small>Hide</Button>
  </Container>
);
