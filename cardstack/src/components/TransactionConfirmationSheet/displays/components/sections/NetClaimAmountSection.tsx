import React from 'react';
import { strings } from '../../../strings';
import { SectionHeaderText } from '../SectionHeaderText';
import { Container, Text } from '@cardstack/components';
import { RewardsClaimData } from '@cardstack/types';

interface NetClaimAmountSectionProps extends Partial<RewardsClaimData> {
  headerText: string;
}

export const NetClaimAmountSection = ({
  headerText,
  balance,
  spendAmount,
  token,
}: NetClaimAmountSectionProps) => {
  return (
    <Container>
      <SectionHeaderText>{headerText}</SectionHeaderText>
      <Container marginLeft={15} marginTop={2}>
        <Text size="xxs">{strings.rewards.claim.breakdownSection.reward}</Text>
        <Text size="body" weight="bold" paddingBottom={3}>
          {balance?.display}
        </Text>

        <Text size="xxs">{strings.rewards.claim.breakdownSection.estGas}</Text>
        <Text size="body" weight="bold" paddingBottom={3}>
          {spendAmount} {token?.symbol}
        </Text>

        <Text size="xxs">{strings.rewards.claim.breakdownSection.estNet}</Text>
        <Text size="body" weight="bold" paddingBottom={3}>
          {Number(balance?.amount) - (spendAmount || 0)} {token?.symbol}
        </Text>
      </Container>
    </Container>
  );
};
