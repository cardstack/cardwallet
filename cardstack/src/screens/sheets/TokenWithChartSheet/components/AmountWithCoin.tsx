import React from 'react';

import { Container, CoinIcon, Text } from '@cardstack/components';

import { AmountRow } from '../types';

export default function AmountWithCoin({ title, asset }: AmountRow) {
  return (
    <Container>
      <Text color="grayText" fontSize={13} marginBottom={1}>
        {title}
      </Text>
      <Container alignItems="center" flexDirection="row">
        <CoinIcon {...asset} size={20} />
        <Text fontSize={20} marginLeft={1} weight="extraBold">
          {asset.balance?.display}
        </Text>
      </Container>
    </Container>
  );
}
