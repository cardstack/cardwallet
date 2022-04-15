import React from 'react';

import { CoinIcon, Container, Text } from '@cardstack/components';

export interface MerchantPaymentItemDetailProps {
  description: string;
  value?: string;
  subValue?: string;
  symbol?: string;
}

export const MerchantPaymentItemDetail = ({
  description,
  value,
  subValue = '',
  symbol,
}: MerchantPaymentItemDetailProps) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      marginBottom={10}
    >
      <Container flex={1}>
        <Text color="blueText" fontSize={13} weight="bold" marginTop={1}>
          {description}
        </Text>
      </Container>
      <Container flex={1} flexDirection="row">
        <Container marginRight={3} marginTop={1}>
          <CoinIcon size={20} symbol={symbol} />
        </Container>
        <Container>
          <Text weight="extraBold">{value}</Text>
          <Text color="blueText" fontSize={13}>
            {subValue}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};
