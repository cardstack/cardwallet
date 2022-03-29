import React from 'react';
import { strings } from '../strings';
import { RewardsNetAmountSection } from './components/sections/RewardsNetAmountSection';
import { SectionCoinHeader } from './components/SectionCoinHeader';
import {
  HorizontalDivider,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';
import { RewardsClaimData } from '@cardstack/types';

interface RewardsClaimDisplayProps extends TransactionConfirmationDisplayProps {
  data: RewardsClaimData;
}

export const RewardsClaimDisplay = ({ data }: RewardsClaimDisplayProps) => (
  <>
    <SectionCoinHeader
      title={strings.rewards.claim.title}
      symbol={data.token.symbol}
      primaryText={data.balance.display}
      secondaryText={data.native.balance.display}
    />
    <HorizontalDivider />
    <RewardsNetAmountSection
      headerText={strings.rewards.claim.breakdownSection.title}
      {...data}
    />
  </>
);
