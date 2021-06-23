import React, { useEffect, useState } from 'react';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { ContactAvatar } from '../../../../src/components/contacts';

import { Container, HorizontalDivider, NetworkBadge, Text } from '../';
import { TransactionConfirmationSectionHeaderText } from './TransactionConfirmationSectionHeaderText';
import { TransactionConfirmationSheetProps } from './TransactionConfirmationSheet';

import {
  useAccountProfile,
  useAccountSettings,
  useWalletBalances,
  useWallets,
} from '@rainbow-me/hooks';

export const GenericDisplay = (props: TransactionConfirmationSheetProps) => {
  return (
    <>
      <FromSection />
      <HorizontalDivider />
      <MessageSection {...props} />
    </>
  );
};

const FromSection = () => {
  const {
    accountAddress,
    accountColor,
    accountName,
    accountSymbol,
  } = useAccountProfile();

  const { network } = useAccountSettings();
  const { wallets } = useWallets();
  const balances = useWalletBalances(wallets) as any;
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

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
            <Container flexDirection="row" marginTop={2}>
              <Container backgroundColor="black" width={2} height="100%" />
              <Container marginLeft={4}>
                <Text size="xxs" weight="bold">
                  BALANCE
                </Text>
                <Text fontSize={15} weight="extraBold">
                  {`${balances[accountAddress]} ${nativeTokenSymbol}`}
                </Text>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const MessageSection = ({
  messageRequest,
}: TransactionConfirmationSheetProps) => {
  const [parsedMessage, setParsedMessage] = useState('');

  useEffect(() => {
    let msg = messageRequest;

    try {
      msg = JSON.parse(messageRequest);
    } catch (e) {}

    msg = JSON.stringify(msg, null, 4);

    setParsedMessage(msg);
  }, [messageRequest]);

  console.log({ parsedMessage });

  return (
    <Container width="100%">
      <TransactionConfirmationSectionHeaderText>
        MESSAGE
      </TransactionConfirmationSectionHeaderText>
      <Container
        paddingHorizontal={3}
        paddingVertical={2}
        marginTop={2}
        borderRadius={10}
        borderColor="borderGray"
        borderWidth={1}
      >
        <Text variant="subText">{parsedMessage}</Text>
      </Container>
    </Container>
  );
};
