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
      <Container paddingHorizontal={3} marginTop={4} flexDirection="column">
        <Text variant="subText" size="xxs" marginLeft={9}>
          MERCHANT
        </Text>
        <Container flexDirection="row" alignItems="center">
          <Icon name="user" />
          <Text size="small" weight="extraBold" style={{ marginLeft: 6 }}>
            Mandello
          </Text>
        </Container>
        <Container maxWidth={180} marginLeft={9}>
          <Text variant="subAddress">{data.merchantSafe}</Text>
        </Container>
      </Container>
    </Container>
  );
};
