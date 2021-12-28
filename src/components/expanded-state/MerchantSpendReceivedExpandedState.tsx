import React, { useEffect, useMemo } from 'react';
import { SlackSheet } from '../sheet';
import { EarnedTransaction } from './MerchantTransactionExpandedState';
import { PaymentDetailsItem } from './payment-item-details';
import {
  BlockscoutButton,
  CoinIcon,
  Container,
  Text,
} from '@cardstack/components';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import {
  Asset,
  TransactionRow,
} from '@cardstack/components/Transactions/TransactionBase';
import { MerchantEarnedSpendAndRevenueTransactionType } from '@cardstack/types';
import {
  dateFormatter,
  getAddressPreview,
  removeCPXDTokenSuffix,
  screenHeight,
} from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
interface MerchantSpendReceivedExpandedStateProps {
  asset: Asset;
  type: string;
}

export default function MerchantSpendReceivedExpandedState(
  props: MerchantSpendReceivedExpandedStateProps
) {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: screenHeight,
    });
  });

  const {
    address,
    spendBalanceDisplay,
    nativeBalanceDisplay,
    timestamp,
    transactionHash,
    transaction: transactionData,
    token,
  } = props.asset?.section?.data[
    props.asset.index
  ] as MerchantEarnedSpendAndRevenueTransactionType;

  const network = useRainbowSelector(state => state.settings.network);

  const earnedTxnData = {
    ...transactionData,
    subText: transactionData.netEarned,
  };

  const rowProps = {
    ...props.asset,
    CoinIcon: (
      <CoinIcon size={30} symbol={removeCPXDTokenSuffix(token.symbol || '')} />
    ),
    primaryText: `+ ${transactionData.netEarned}`,
    subText: transactionData.netEarnedNative,
  };

  return useMemo(
    () => (
      <SlackSheet flex={1} scrollEnabled>
        <Container backgroundColor="white" marginBottom={16} padding={8}>
          <Text marginBottom={2} size="medium">
            Payment Received
          </Text>
          <MerchantSectionCard isPaymentReceived>
            <Container alignItems="center">
              <Text color="black" fontWeight="bold" marginTop={2} size="xs">
                {getAddressPreview(address)}
              </Text>
              <Text fontSize={40} fontWeight="700" marginTop={4}>
                {spendBalanceDisplay || ''}
              </Text>
              <Text color="blueText" fontSize={12}>
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
            <EarnedTransaction {...earnedTxnData} txRowProps={rowProps} />
            <PaymentDetailsItem info={address} isPrepaidCard title="FROM" />
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
      address,
      earnedTxnData,
      nativeBalanceDisplay,
      network,
      props.asset,
      rowProps,
      spendBalanceDisplay,
      timestamp,
      transactionHash,
    ]
  );
}
