import React from 'react';

import {
  HorizontalDivider,
  TransactionConfirmationDisplayProps,
  IconProps,
} from '@cardstack/components';
import { RewardsRegisterData } from '@cardstack/types';

import { strings } from '../strings';

import { SectionIconTitle } from './components/SectionIconTitle';
import { PayThisAmountSection } from './components/sections/PayThisAmountSection';
import { PrepaidCardTransactionSection } from './components/sections/PrepaidCardTransactionSection';

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
  disabledConfirmButton: isGasFeeLoading,
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
    <PayThisAmountSection
      headerText={strings.rewards.cost.title}
      spendAmount={spendAmount}
      isGasFeeLoading={isGasFeeLoading}
    />
  </>
);
