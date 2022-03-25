import React from 'react';
import { strings } from '../strings';
import { SectionIconTitle } from './components/SectionIconTitle';
import { PrepaidCardTransactionSection } from './components/sections/PrepaidCardTransactionSection';
import { PayThisAmountSection } from './components/sections/PayThisAmountSection';
import {
  Container,
  HorizontalDivider,
  Icon,
  Text,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';
import { RewardsRegisterData } from '@cardstack/types';

interface RewardsRegisterDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: RewardsRegisterData;
}

export const RewardsRegisterDisplay = ({
  data: { programName, prepaidCard, spendAmount },
}: RewardsRegisterDisplayProps) => (
  <>
    <SectionIconTitle
      title={programName}
      iconProps={{ name: 'cardstack', size: 15 }}
    />
    <HorizontalDivider />
    <PrepaidCardTransactionSection
      headerText={strings.rewards.prepaidcard.title}
      prepaidCardAddress={prepaidCard}
    />
    <PayThisAmountSection
      headerText={strings.rewards.cost.title}
      spendAmount={spendAmount}
    />
  </>
);
