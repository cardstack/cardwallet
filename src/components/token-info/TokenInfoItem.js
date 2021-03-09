import React from 'react';

import TokenInfoBalanceValue from './TokenInfoBalanceValue';
import TokenInfoValue from './TokenInfoValue';
import { Container, Text } from '@cardstack/components';

export default function TokenInfoItem({
  align = 'left',
  asset,
  children,
  title,
  weight,
}) {
  return (
    <Container alignItems={align === 'left' ? 'flex-start' : 'flex-end'}>
      <Text align={align} color="grayText" fontSize={13} marginBottom={1}>
        {title}
      </Text>
      {asset ? (
        <TokenInfoBalanceValue align={align} asset={asset} />
      ) : (
        <Text fontSize={20} fontWeight="700">
          {children}
        </Text>
      )}
    </Container>
  );
}
