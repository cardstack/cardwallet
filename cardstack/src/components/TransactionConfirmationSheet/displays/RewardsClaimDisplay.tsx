import React from 'react';
import { strings } from '../strings';
import { SectionIconTitle } from './components/SectionIconTitle';
import { PrepaidCardTransactionSection } from './components/sections/PrepaidCardTransactionSection';
import { NetClaimAmountSection } from './components/sections/NetClaimAmountSection';
import {
  HorizontalDivider,
  TransactionConfirmationDisplayProps,
  IconProps,
} from '@cardstack/components';
import { RewardsRegisterData } from '@cardstack/types';

interface RewardsRegisterDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: RewardsRegisterData;
}

const rewardsIconProps: IconProps = {
  name: 'rewards',
  size: 22,
  color: 'teal',
};

export const RewardsRegisterDisplay = ({
  data: { programName, prepaidCard, spendAmount },
}: RewardsRegisterDisplayProps) => (
  <>
    <SectionIconTitle
      sectionHeaderText={strings.rewards.program.title}
      title={programName}
      iconProps={rewardsIconProps}
    />
    <HorizontalDivider />
    <PrepaidCardTransactionSection
      headerText={strings.rewards.prepaidcard.title}
      prepaidCardAddress={prepaidCard}
    />
    <NetClaimAmountSection
      headerText={strings.rewards.cost.title}
      claimAmount={spendAmount}
    />
  </>
);
