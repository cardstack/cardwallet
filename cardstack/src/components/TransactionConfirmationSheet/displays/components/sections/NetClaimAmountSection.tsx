import React from 'react';
import { SectionHeaderText } from '../SectionHeaderText';
import { Container, Text } from '@cardstack/components';
import { RewardsClaimData } from '@cardstack/types';

interface NetClaimAmountSectionProps extends Partial<RewardsClaimData> {
  headerText: string;
}

export const NetClaimAmountSection = ({
  headerText,
  claimAmount = 0,
}: NetClaimAmountSectionProps) => {
  return (
    <Container>
      <SectionHeaderText>{headerText}</SectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        <Text size="large" weight="extraBold">
          {claimAmount}
        </Text>
      </Container>
    </Container>
  );
};
