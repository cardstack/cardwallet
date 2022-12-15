import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';

import { useGetAssetBalance } from '@cardstack/hooks';
import { NetworkType } from '@cardstack/types';

import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useAccountProfile } from '@rainbow-me/hooks';

import { Container, HorizontalDivider, NetworkBadge, Text } from '../..';
import { TransactionConfirmationDisplayProps } from '../TransactionConfirmationSheet';

import { SectionHeaderText } from './components/SectionHeaderText';

export const GenericDisplay = ({
  txNetwork,
  messageRequest,
}: TransactionConfirmationDisplayProps) => (
  <>
    <FromSection txNetwork={txNetwork} />
    <HorizontalDivider />
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
  </>
);

const FromSection = ({
  txNetwork,
}: Pick<TransactionConfirmationDisplayProps, 'txNetwork'>) => {
  const {
    avatarKeyColor,
    accountName,
    accountSymbol,
    accountAddress,
  } = useAccountProfile();

  const nativeTokenSymbol = getConstantByNetwork(
    'nativeTokenSymbol',
    txNetwork || NetworkType.gnosis
  );

  const balance = useGetAssetBalance({
    asset: {
      decimals: 18,
      symbol: nativeTokenSymbol,
      address: '',
    },
    accountAddress,
    network: txNetwork as NetworkType,
  });

  return (
    <Container marginTop={8} width="100%">
      <SectionHeaderText>FROM</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4}>
        <Container flexDirection="row">
          <ContactAvatar
            color={avatarKeyColor}
            size="smaller"
            value={accountSymbol}
          />
          <Container marginLeft={4}>
            <Text weight="extraBold">{accountName}</Text>
            <NetworkBadge marginTop={2} network={txNetwork} />
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
