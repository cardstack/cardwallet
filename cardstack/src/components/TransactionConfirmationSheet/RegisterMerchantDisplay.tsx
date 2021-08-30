import React from 'react';

import { PrepaidCardTransactionSection } from './PrepaidCardTransactionSection';
import { TransactionConfirmationDisplayProps } from './TransactionConfirmationSheet';
import { PayThisAmountSection } from './PayThisAmountSection';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import { RegisterMerchantDecodedData } from '@cardstack/types';
import {
  Container,
  HorizontalDivider,
  Icon,
  Text,
} from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';

interface RegisterMerchantDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: RegisterMerchantDecodedData;
}

export const RegisterMerchantDisplay = (
  props: RegisterMerchantDisplayProps
) => {
  return (
    <>
      <PrepaidCardTransactionSection
        prepaidCardAddress={props.data.prepaidCard}
      />
      <HorizontalDivider />
      <PayThisAmountSection spendAmount={props.data.spendAmount} />
      <HorizontalDivider />
      <ToSection />
    </>
  );
};

const ToSection = () => {
  return (
    <Container width="100%">
      <TransactionConfirmationSectionHeaderText>
        CREATE THIS MERCHANT
      </TransactionConfirmationSectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <Icon name="user" />
          <Container marginLeft={4}>
            <Text weight="extraBold">Merchant Name</Text>
            <Text variant="subAddress" marginTop={1}>
              {getAddressPreview('0xXXXXXXXXXXXX')}*
            </Text>
            <Container
              width="100%"
              paddingRight={5}
              flexDirection="row"
              marginTop={4}
            >
              <Text size="small" color="blueText" marginRight={1}>
                *
              </Text>
              <Text size="small" color="blueText">
                The address will be confirmed once the transaction is complete
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
