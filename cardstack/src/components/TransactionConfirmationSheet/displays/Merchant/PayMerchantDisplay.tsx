import React from 'react';

import { PrepaidCardTransactionSection } from '../components/sections/PrepaidCardTransactionSection';
import { PayThisAmountSection } from '../components/sections/PayThisAmountSection';
import { TransactionConfirmationDisplayProps } from '../../TransactionConfirmationSheet';
import TransactionListItem from '../components/TransactionListItem';
import { useMerchantInfoDID } from './hooks';
import { PayMerchantDecodedData } from '@cardstack/types';
import { HorizontalDivider } from '@cardstack/components';

interface PayMerchantDisplayProps extends TransactionConfirmationDisplayProps {
  data: PayMerchantDecodedData;
}

export const PayMerchantDisplay = ({
  data: { infoDID = '', spendAmount, prepaidCard, merchantSafe },
}: PayMerchantDisplayProps) => {
  const { merchantInfoDID } = useMerchantInfoDID(infoDID);

  return (
    <>
      <PrepaidCardTransactionSection
        headerText="FROM"
        prepaidCardAddress={prepaidCard}
      />
      <PayThisAmountSection
        headerText="PAY THIS AMOUNT"
        spendAmount={spendAmount}
      />
      <HorizontalDivider />
      <TransactionListItem
        headerText="TO:"
        title={merchantInfoDID?.name || 'Merchant'}
        avatarInfo={merchantInfoDID}
        address={merchantSafe}
        hideDivider
      />
    </>
  );
};
