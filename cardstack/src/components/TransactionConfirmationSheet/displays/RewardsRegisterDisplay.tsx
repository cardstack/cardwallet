import React from 'react';
import { strings } from '../strings';
import { SectionIconTitle } from './components/SectionIconTitle';
import { PrepaidCardTransactionSection } from './components/sections/PrepaidCardTransactionSection';
import { PayThisAmountSection } from './components/sections/PayThisAmountSection';
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
  data: { programName, prepaidCard, estGasFee },
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
      spendAmount={estGasFee}
    />
  </>
);
