import React, { memo } from 'react';

import { Container, Text } from '@cardstack/components';

import { AmountRowProps } from '../types';

const NativeAmount = ({ title, asset }: AmountRowProps) => {
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
};

export default memo(NativeAmount);
