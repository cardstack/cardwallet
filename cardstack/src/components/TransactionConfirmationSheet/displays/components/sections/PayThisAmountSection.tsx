import React from 'react';

import { Container, Skeleton, Text } from '@cardstack/components';
import { useSpendToNativeDisplay } from '@cardstack/hooks/currencies/useSpendDisplay';

import { SectionHeaderText } from '../SectionHeaderText';

export const PayThisAmountSection = ({
  headerText,
  spendAmount,
  isLoading,
}: {
  headerText: string;
  spendAmount: string | number;
  isLoading?: boolean;
}) => {
  const { nativeBalanceDisplay } = useSpendToNativeDisplay({
    spendAmount,
  });

  return (
    <Container>
      <SectionHeaderText>{headerText}</SectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        {isLoading ? (
          <Skeleton width="40%" height={50} light />
        ) : (
          <Text size="large" weight="extraBold">
            {nativeBalanceDisplay}
          </Text>
        )}
      </Container>
    </Container>
  );
};
