import React from 'react';

import { ContactAvatar } from '../../../../src/components/contacts';
import { GenericDisplay } from './GenericDisplay';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import { TransactionConfirmationSheetProps } from './TransactionConfirmationSheet';
import { useAccountProfile } from '@rainbow-me/hooks';
import { Container, NetworkBadge, Text } from '@cardstack/components';

export const RegisterMerchantDisplay = (
  props: TransactionConfirmationSheetProps
) => {
  const { decodedData } = props;

  if (!decodedData || decodedData.type !== 'registerMerchant') {
    return <GenericDisplay {...props} />;
  }

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
              <Text
                size="small"
                color="blueText"
                fontFamily="RobotoMono-Regular"
                marginTop={1}
              >
                {accountAddress}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
