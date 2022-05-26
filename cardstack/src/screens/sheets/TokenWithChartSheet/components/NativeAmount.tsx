import React from 'react';

import { Container, Text } from '@cardstack/components';

import { AmountRow } from '../types';

export default function NativeAmount({ title, asset }: AmountRow) {
  return (
    <Container>
      <Text color="grayText" fontSize={13} marginBottom={1} textAlign="right">
        {title}
      </Text>
      <Text fontSize={20} weight="extraBold">
        {asset?.native?.balance.display}
      </Text>
    </Container>
  );
}
