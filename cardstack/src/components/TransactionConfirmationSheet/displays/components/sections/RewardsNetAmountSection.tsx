import React, { useMemo } from 'react';
import { strings } from '../../../strings';
import { SectionHeaderText } from '../SectionHeaderText';
import { Container, Text } from '@cardstack/components';
import { RewardsClaimData } from '@cardstack/types';

interface RewardsNetAmountSectionProps extends Partial<RewardsClaimData> {
  headerText: string;
}

export const RewardsNetAmountSection = ({
  headerText,
  balance,
  estGasFee,
  token,
}: RewardsNetAmountSectionProps) => {
  const estimateNetClaim = useMemo(
    () => (Number(balance?.amount) - Number(estGasFee)).toFixed(2),
    [balance, estGasFee]
  );

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
          {estGasFee} {token?.symbol}
        </Text>

        <Text size="xxs">{strings.rewards.claim.breakdownSection.estNet}</Text>
        <Text size="body" weight="bold" paddingBottom={3}>
          {estimateNetClaim} {token?.symbol}
        </Text>
      </Container>
    </Container>
  );
};
