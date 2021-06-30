import React from 'react';

import { ContactAvatar } from '../../../../src/components/contacts';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import { TransactionConfirmationDisplayProps } from './TransactionConfirmationSheet';
import { useAccountProfile } from '@rainbow-me/hooks';
import { Container, NetworkBadge, Text } from '@cardstack/components';
import { RegisterMerchantDecodedData } from '@cardstack/types';

interface RegisterMerchantDisplayProps
  extends TransactionConfirmationDisplayProps {
  data: RegisterMerchantDecodedData;
}

export const RegisterMerchantDisplay = (
  _props: RegisterMerchantDisplayProps
) => {
  return (
    <>
      <FromSection />
    </>
  );
};

const FromSection = () => {
  const {
    accountColor,
    accountName,
    accountSymbol,
    accountAddress,
  } = useAccountProfile();

  return (
    <Container marginTop={8} width="100%">
      <TransactionConfirmationSectionHeaderText>
        FROM
      </TransactionConfirmationSectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <ContactAvatar
            color={accountColor}
            size="smaller"
            value={accountSymbol}
          />
          <Container marginLeft={4}>
            <Text weight="extraBold">{accountName}</Text>
            <NetworkBadge marginTop={2} />
            <Container maxWidth={180}>
              <Text variant="subAddress" marginTop={1}>
                {accountAddress}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
