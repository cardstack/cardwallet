import React from 'react';

import { Container, Text } from '@cardstack/components';
import { useSpendToNativeDisplay } from '@cardstack/hooks/currencies/useSpendDisplay';

import { SectionHeaderText } from '../SectionHeaderText';

export const PayThisAmountSection = ({
  headerText,
  spendAmount,
}: {
  headerText: string;
  spendAmount: string | number;
}) => {
  const { nativeBalanceDisplay } = useSpendToNativeDisplay({
    spendAmount,
  });

  return (
    <Container>
      <SectionHeaderText>{headerText}</SectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        <Text size="large" weight="extraBold">
          {nativeBalanceDisplay}
        </Text>
      </Container>
    </Container>
  );
};
