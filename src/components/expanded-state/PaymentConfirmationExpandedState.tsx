import React, { useEffect, useMemo } from 'react';
import { SlackSheet } from '../sheet';
import { BlockscoutButton, Container, Text } from '@cardstack/components';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import {
  TransactionRow,
  TransactionRowProps,
} from '@cardstack/components/Transactions/TransactionBase';
import { PrepaidCardPaymentTransactionType } from '@cardstack/types';
import { dateFormatter, screenHeight } from '@cardstack/utils';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

interface PaymentConfirmationExpandedStateProps {
  asset: Asset;
  type: string;
}

interface Asset extends TransactionRowProps {
  CoinIcon: JSX.Element;
  Header: any;
  includeBorder: boolean;
  index: number;
  isFullWidth: boolean;
  primaryText: string;
  section: Section;
  statusText: string;
  subText: string;
  transactionHash: string;
}

interface Section {
  data: PrepaidCardPaymentTransactionType[];
  title: string;
}

const PaymentDetailsItem = ({
  title,
  color,
  textColor,
  name,
  info,
  isTimestamp = false,
}: {
  title: string;
  color?: string;
  textColor?: string;
  info: any;
  name?: string;
  isTimestamp?: boolean;
}) => {
  return (
    <Container marginBottom={6} paddingHorizontal={6}>
      <Text color="blueText" fontSize={13} marginBottom={2} weight="extraBold">
        {title}
      </Text>
      {name ? (
        <>
          <Container flexDirection="row" marginBottom={1}>
            <Container flex={2} />
            <Container flex={8}>
              <Text color="blueText" fontSize={10} weight="bold">
                MERCHANT
              </Text>
            </Container>
          </Container>
          <Container flexDirection="row">
            <Container alignItems="center" flex={2}>
              <ContactAvatar
                color={color}
                size="smaller"
                textColor={textColor}
                value={name}
              />
            </Container>
            <Container flex={8} marginBottom={1}>
              <Text weight="extraBold">{name}</Text>
            </Container>
          </Container>
        </>
      ) : null}
      <Container flexDirection="row" marginBottom={1}>
        <Container flex={2} />
        <Container flex={8}>
          <Text color="blueText" fontSize={13}>
            {isTimestamp ? dateFormatter(info) : info}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export default function PaymentConfirmationExpandedState(
  props: PaymentConfirmationExpandedStateProps
) {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: screenHeight,
    });
  });
  const {
    merchantInfo,
    spendAmount,
    nativeBalanceDisplay,
    timestamp,
    transactionHash,
  } = props.asset?.section?.data[props.asset.index];
  const { ownerAddress } = merchantInfo || {};

  const network = useRainbowSelector(state => state.settings.network);
  return useMemo(
    () => (
      <SlackSheet flex={1} scrollEnabled>
        <Container backgroundColor="white" marginBottom={16} padding={8}>
          <Text marginBottom={10} size="medium">
            Payment Confirmation
          </Text>
          <MerchantSectionCard merchantInfoDID={merchantInfo}>
            <Container alignItems="center" paddingBottom={3}>
              <Text fontSize={40} fontWeight="700">
                §{spendAmount || ''}
              </Text>
              <Text color="blueText" fontSize={12}>
                {nativeBalanceDisplay || ''}
              </Text>
            </Container>
          </MerchantSectionCard>
          <Container marginBottom={3} />
          <Container
            backgroundColor="white"
            borderColor="borderGray"
            borderRadius={10}
            borderWidth={1}
            marginBottom={8}
            overflow="scroll"
          >
            {props.asset.Header}
            <TransactionRow {...props.asset} hasBottomDivider />
            <PaymentDetailsItem
              title="TO:"
              {...merchantInfo}
              info={ownerAddress}
            />
            <PaymentDetailsItem info={transactionHash} title="TXN HASH:" />
            <PaymentDetailsItem info={timestamp} isTimestamp title="TIME:" />
          </Container>
          <BlockscoutButton
            network={network}
            transactionHash={props.asset.transactionHash}
          />
        </Container>
      </SlackSheet>
    ),
    [
      merchantInfo,
      nativeBalanceDisplay,
      network,
      ownerAddress,
      props.asset,
      spendAmount,
      timestamp,
      transactionHash,
    ]
  );
}
