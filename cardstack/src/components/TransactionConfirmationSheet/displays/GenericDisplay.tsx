import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';

import { useGetAssetBalance } from '@cardstack/hooks';

import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useAccountProfile, useAccountSettings } from '@rainbow-me/hooks';

import { Container, HorizontalDivider, NetworkBadge, Text } from '../..';
import { TransactionConfirmationDisplayProps } from '../TransactionConfirmationSheet';

import { SectionHeaderText } from './components/SectionHeaderText';

export const GenericDisplay = (props: TransactionConfirmationDisplayProps) => {
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
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const balance = useGetAssetBalance({
    asset: {
      decimals: 18,
      symbol: nativeTokenSymbol,
      address: '',
      name: '',
    },
    accountAddress,
    network,
  });

  return (
    <Container marginTop={8} width="100%">
      <SectionHeaderText>FROM</SectionHeaderText>
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
                  {balance.display}
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
}: TransactionConfirmationDisplayProps) => {
  return (
    <Container width="100%">
      <SectionHeaderText>MESSAGE</SectionHeaderText>
      <Container
        paddingHorizontal={3}
        paddingVertical={2}
        marginTop={2}
        borderRadius={10}
        borderColor="borderGray"
        borderWidth={1}
      >
        <Text variant="subText">{messageRequest}</Text>
      </Container>
    </Container>
  );
};
