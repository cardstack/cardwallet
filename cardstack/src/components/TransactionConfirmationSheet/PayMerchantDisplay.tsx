import React from 'react';

import { FromPrepaidCardSection } from './FromPrepaidCardSection';
import { PayThisAmountSection } from './PayThisAmountSection';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import { TransactionConfirmationDisplayProps } from './TransactionConfirmationSheet';
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
      <FromPrepaidCardSection prepaidCardAddress={props.data.prepaidCard} />
      <HorizontalDivider />
      <PayThisAmountSection spendAmount={props.data.spendAmount} />
      <HorizontalDivider />
      <ToSection {...props} />
    </>
  );
};

const ToSection = ({ data }: PayMerchantDisplayProps) => {
  return (
    <Container>
      <TransactionConfirmationSectionHeaderText>
        TO
      </TransactionConfirmationSectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4} flexDirection="row">
        <Icon name="user" />
        <Container marginLeft={4}>
          <Text variant="subText">Merchant</Text>
          <Text size="small" weight="extraBold">
            Merchant Name
          </Text>
          <Container maxWidth={180} marginTop={2}>
            <Text variant="subAddress">{data.merchantSafe}</Text>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
