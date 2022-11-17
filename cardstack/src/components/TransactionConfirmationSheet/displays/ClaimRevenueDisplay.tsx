import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
  getAddressByNetwork,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import React from 'react';

import {
  Container,
  HorizontalDivider,
  Icon,
  NetworkBadge,
  Text,
} from '@cardstack/components';
import { ClaimRevenueDecodedData, NetworkType } from '@cardstack/types';

import { useAccountSettings } from '@rainbow-me/hooks';

import { TransactionConfirmationDisplayProps } from '../TransactionConfirmationSheet';

import { SectionHeaderText } from './components/SectionHeaderText';

interface ClaimRevenueDisplayProps extends TransactionConfirmationDisplayProps {
  data: ClaimRevenueDecodedData;
}

export const ClaimRevenueDisplay = (props: ClaimRevenueDisplayProps) => {
  const { network, nativeCurrency } = useAccountSettings();
  return (
    <>
      <FromSection network={network} />
      <HorizontalDivider />
      <ClaimSection data={{ ...props.data, nativeCurrency }} />
      <HorizontalDivider />
      <ToSection merchantSafe={props.data.merchantSafe} />
    </>
  );
};

const FromSection = ({ network }: { network: NetworkType }) => {
  const revenuePool = getAddressByNetwork('revenuePool', network);

  return (
    <Container marginTop={8} width="100%">
      <SectionHeaderText>FROM</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4} flexDirection="row">
        <Icon name="cardstack" />
        <Container marginLeft={3}>
          <Text weight="extraBold">CARD Protocol Revenue Pool</Text>
          <NetworkBadge marginTop={2} />
          <Container maxWidth={180} marginTop={2}>
            <Text variant="subAddress">{revenuePool}</Text>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const ClaimSection = ({
  data,
}: {
  data: ClaimRevenueDecodedData & { nativeCurrency: NativeCurrency };
}) => {
  const tokenDisplay = convertRawAmountToBalance(data.amount, data.token);

  const nativeDisplay = convertRawAmountToNativeDisplay(
    data.amount,
    data.token.decimals,
    data.price,
    data.nativeCurrency
  );

  return (
    <Container>
      <SectionHeaderText>LOAD THIS AMOUNT</SectionHeaderText>
      <Container marginLeft={12} marginTop={2}>
        <Text size="large" weight="extraBold">
          {tokenDisplay.display}
        </Text>
        <Text variant="subText">{nativeDisplay.display}</Text>
      </Container>
    </Container>
  );
};

const ToSection = ({ merchantSafe }: { merchantSafe: string }) => {
  return (
    <Container>
      <SectionHeaderText>TO</SectionHeaderText>
      <Container paddingHorizontal={3} marginTop={4} flexDirection="column">
        <Text size="xxs" color="blueText" marginLeft={9}>
          BUSINESS SAFE
        </Text>
        <Container flexDirection="row" alignItems="center">
          <Icon name="user-with-background" />
          <Text size="small" weight="extraBold" style={{ marginLeft: 6 }}>
            Business
          </Text>
        </Container>
        <Container maxWidth={180} marginLeft={9}>
          <Text variant="subAddress">{merchantSafe}</Text>
        </Container>
      </Container>
    </Container>
  );
};
