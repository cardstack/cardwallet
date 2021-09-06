import React from 'react';

import { PrepaidCardTransactionSection } from '../components/sections/PrepaidCardTransactionSection';
import { PayThisAmountSection } from '../components/sections/PayThisAmountSection';
import { SectionHeaderText } from '../components/SectionHeaderText';
import { TransactionConfirmationDisplayProps } from '../../TransactionConfirmationSheet';
import { PayMerchantDecodedData } from '@cardstack/types';
import {
  Container,
  HorizontalDivider,
  Icon,
  Text,
} from '@cardstack/components';

interface PayMerchantDisplayProps extends TransactionConfirmationDisplayProps {
  data: PayMerchantDecodedData;
}

export const PayMerchantDisplay = (props: PayMerchantDisplayProps) => {
  return (
    <>
      <PrepaidCardTransactionSection
        headerText="FROM"
        prepaidCardAddress={props.data.prepaidCard}
      />

      <PayThisAmountSection
        headerText="PAY THIS AMOUNT"
        spendAmount={props.data.spendAmount}
      />
      <HorizontalDivider />
      <ToSection {...props} />
    </>
  );
};

const ToSection = ({ data }: PayMerchantDisplayProps) => {
  return (
    <Container>
      <SectionHeaderText>TO</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4} flexDirection="column">
        <Text variant="subText" size="xxs" marginLeft={9}>
          MERCHANT
        </Text>
        <Container flexDirection="row" alignItems="center">
          <Icon name="user" />
          <Text size="small" weight="extraBold" style={{ marginLeft: 6 }}>
            Merchant Name
          </Text>
        </Container>
        <Container maxWidth={180} marginLeft={9}>
          <Text variant="subAddress">{data.merchantSafe}</Text>
        </Container>
      </Container>
    </Container>
  );
};
