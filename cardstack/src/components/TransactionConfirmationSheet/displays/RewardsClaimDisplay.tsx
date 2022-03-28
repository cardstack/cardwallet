import React from 'react';
import { strings } from '../strings';
import { NetClaimAmountSection } from './components/sections/NetClaimAmountSection';
import {
  HorizontalDivider,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';
import { RewardsClaimData } from '@cardstack/types';

interface RewardsClaimDisplayProps extends TransactionConfirmationDisplayProps {
  data: RewardsClaimData;
}

export const RewardsClaimDisplay = ({
  data: { claimAmount, estGasAmount, estNetClaim },
}: RewardsClaimDisplayProps) => (
  <>
    <HorizontalDivider />
    <NetClaimAmountSection
      headerText={strings.rewards.cost.title}
      claimAmount={claimAmount}
    />
  </>
);
