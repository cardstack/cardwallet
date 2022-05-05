import React from 'react';

import {
  Container,
  HorizontalDivider,
  Text,
  TransactionConfirmationDisplayProps,
} from '@cardstack/components';
import { useSpendToNativeDisplay } from '@cardstack/hooks/currencies/useSpendDisplay';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import { PayMerchantDecodedData } from '@cardstack/types';

import TransactionListItem from '../components/TransactionListItem';
import MerchantSectionCard from '../components/sections/MerchantSectionCard';
import { PayThisAmountSection } from '../components/sections/PayThisAmountSection';
import { PrepaidCardTransactionSection } from '../components/sections/PrepaidCardTransactionSection';

interface PayMerchantDisplayProps extends TransactionConfirmationDisplayProps {
  data: PayMerchantDecodedData;
}

export const PayMerchantDisplay = ({
  data: { infoDID = '', spendAmount = 0, prepaidCard = '', merchantSafe },
}: PayMerchantDisplayProps) => {
  const { merchantInfoDID } = useMerchantInfoFromDID(infoDID);
  const spendDisplay = useSpendToNativeDisplay({ spendAmount });

  return (
    <>
      <Container paddingBottom={4} paddingTop={1}>
        <MerchantSectionCard merchantInfoDID={merchantInfoDID}>
          <Container paddingTop={6} paddingBottom={3} alignItems="center">
            <Text fontSize={34} weight="extraBold">
              {spendDisplay.nativeBalanceDisplay}
            </Text>
          </Container>
        </MerchantSectionCard>
      </Container>
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
        headerText="TO"
        title={merchantInfoDID?.name || 'Business'}
        avatarInfo={merchantInfoDID}
        address={merchantSafe}
        hideDivider
      />
    </>
  );
};
