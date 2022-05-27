import React, { memo } from 'react';

import { Container, CoinIcon, Text } from '@cardstack/components';

import { AmountRowProps } from '../types';

const AmountWithCoin = ({ title, asset }: AmountRowProps) => {
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
};

export default memo(AmountWithCoin);
