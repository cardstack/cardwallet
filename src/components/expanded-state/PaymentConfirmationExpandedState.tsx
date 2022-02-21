import React, { useEffect, useMemo } from 'react';
import { SlackSheet } from '../sheet';
import {
  BlockscoutButton,
  Container,
  PaymentDetailsItem,
  Text,
} from '@cardstack/components';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import {
  TransactionRow,
  TransactionRowProps,
} from '@cardstack/components/Transactions/TransactionBase';
import { PrepaidCardPaymentTransactionType } from '@cardstack/types';
import { dateFormatter, screenHeight } from '@cardstack/utils';
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
          <MerchantSectionCard merchantInfoDID={merchantInfo} paddingBottom={5}>
            <Container alignItems="center">
              <Text fontSize={34} weight="extraBold">
                {nativeBalanceDisplay || ''}
              </Text>

              {timestamp ? (
                <Text color="black" marginTop={4} size="medium" weight="bold">
                  {dateFormatter(timestamp, 'MMM dd', 'h:mm a', ', ')}
                </Text>
              ) : null}
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
              title="TO"
              {...merchantInfo}
              info={ownerAddress}
            />
            <PaymentDetailsItem info={transactionHash} title="TXN HASH" />
            <PaymentDetailsItem
              info={timestamp}
              infoColor="black"
              isTimestamp
              title="LOCAL TIME"
            />
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
      timestamp,
      transactionHash,
    ]
  );
}
