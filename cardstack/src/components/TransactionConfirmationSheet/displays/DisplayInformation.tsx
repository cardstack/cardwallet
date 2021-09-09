import React, { ElementType } from 'react';

import { ActivityIndicator } from 'react-native';
import { ClaimRevenueDisplay } from './ClaimRevenueDisplay';
import { GenericDisplay } from './GenericDisplay';
import { IssuePrepaidCardDisplay } from './PrepaidCard/IssuePrepaidCardDisplay';
import { PayMerchantDisplay } from './Merchant/PayMerchantDisplay';
import { RegisterMerchantDisplay } from './Merchant/RegisterMerchantDisplay';
import { SplitPrepaidCardDisplay } from './PrepaidCard/SplitPrepaidCardDisplay';
import { TransferPrepaidCardDisplay } from './PrepaidCard/TransferPrepaidCardDisplay';
import { WithdrawalDisplay } from './WithdrawalDisplay';
import { HubAuthenticationDisplay } from './HubAuthenticationDisplay';
import { TransactionConfirmationType } from '@cardstack/types';
import {
  CenteredContainer,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';

export const transactionTypeMap: Record<
  TransactionConfirmationType,
  { title: string; component: ElementType }
> = {
  [TransactionConfirmationType.GENERIC]: {
    title: '',
    component: GenericDisplay,
  },
  [TransactionConfirmationType.HUB_AUTH]: {
    title: 'Authenticate Account',
    component: HubAuthenticationDisplay,
  },
  [TransactionConfirmationType.ISSUE_PREPAID_CARD]: {
    title: 'Issue Prepaid Card',
    component: IssuePrepaidCardDisplay,
  },
  [TransactionConfirmationType.WITHDRAWAL]: {
    title: 'Withdraw Funds',
    component: WithdrawalDisplay,
  },
  [TransactionConfirmationType.REGISTER_MERCHANT]: {
    title: 'Create Merchant',
    component: RegisterMerchantDisplay,
  },
  [TransactionConfirmationType.PAY_MERCHANT]: {
    title: 'Pay Merchant',
    component: PayMerchantDisplay,
  },
  [TransactionConfirmationType.CLAIM_REVENUE]: {
    title: 'Claim Funds',
    component: ClaimRevenueDisplay,
  },
  [TransactionConfirmationType.SPLIT_PREPAID_CARD]: {
    title: 'Split Prepaid Card',
    component: SplitPrepaidCardDisplay,
  },
  [TransactionConfirmationType.TRANSFER_PREPAID_CARD_1]: {
    title: 'Transfer Prepaid Card - Step 1/2',
    component: TransferPrepaidCardDisplay,
  },
  [TransactionConfirmationType.TRANSFER_PREPAID_CARD_2]: {
    title: 'Transfer Prepaid Card - Step 2/2',
    component: TransferPrepaidCardDisplay,
  },
};

export const DisplayInformation = (
  props: TransactionConfirmationDisplayProps
) => {
  if (props.loading) {
    return (
      <CenteredContainer width="100%" height={475}>
        <ActivityIndicator size="large" />
      </CenteredContainer>
    );
  }

  const Display =
    transactionTypeMap[props.data.type]?.component || GenericDisplay;

  return <Display {...props} />;
};
