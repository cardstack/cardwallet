import React, { useMemo } from 'react';

import { RewardsClaimData } from '@cardstack/types';

import { strings } from '../strings';

import { AmountSection } from './components/sections/AmountSection';

interface RewardsNetAmountSectionProps extends Partial<RewardsClaimData> {
  headerText: string;
}

export const RewardsNetAmountSection = ({
  headerText,
  balance,
  estGasFee,
  token,
  loadingGasEstimate,
}: RewardsNetAmountSectionProps) => {
  const estimateNetClaim = useMemo(
    () => (Number(balance?.amount) - Number(estGasFee)).toFixed(2),
    [balance, estGasFee]
  );

  const data = useMemo(
    () => [
      {
        description: strings.rewards.claim.breakdownSection.reward,
        valueDisplay: balance?.display,
      },
      {
        description: strings.rewards.claim.breakdownSection.estGas,
        valueDisplay: `-${estGasFee} ${token?.symbol}`,
      },
      {
        description: strings.rewards.claim.breakdownSection.estNet,
        valueDisplay: `${estimateNetClaim} ${token?.symbol}`,
      },
    ],
    [balance, estGasFee, token, estimateNetClaim]
  );

  return (
    <AmountSection
      title={headerText}
      data={data}
      showLoading={loadingGasEstimate}
    />
  );
};
