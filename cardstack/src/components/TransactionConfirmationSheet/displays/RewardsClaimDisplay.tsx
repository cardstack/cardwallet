import React from 'react';

import {
  HorizontalDivider,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';
import { RewardsClaimData } from '@cardstack/types';

import { strings } from '../strings';

import { RewardsNetAmountSection } from './RewardsNetAmountSection';
import { SectionCoinHeader } from './components/SectionCoinHeader';

interface RewardsClaimDisplayProps extends TransactionConfirmationDisplayProps {
  data: RewardsClaimData;
}

export const RewardsClaimDisplay = ({ data }: RewardsClaimDisplayProps) => (
  <>
    <SectionCoinHeader
      marginTop={8}
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
