import React from 'react';

import TokenInfoBalanceValue from './TokenInfoBalanceValue';
import { Container, Text } from '@cardstack/components';

export default function TokenInfoItem({
  align = 'left',
  asset,
  children,
  title,
}) {
  return (
    <Container alignItems={align === 'left' ? 'flex-start' : 'flex-end'}>
      <Text align={align} color="grayText" fontSize={13} marginBottom={1}>
        {title}
      </Text>
      {asset ? (
        <TokenInfoBalanceValue align={align} asset={asset} />
      ) : (
        <Text fontSize={20} weight="extraBold">
          {children}
        </Text>
      )}
    </Container>
  );
}
