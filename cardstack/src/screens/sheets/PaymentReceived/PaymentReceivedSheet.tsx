import React, { memo } from 'react';
import { useRoute } from '@react-navigation/core';
import {
  BlockscoutButton,
  CoinIcon,
  Container,
  EarnedTransaction,
  Icon,
  PaymentDetailsItem,
  Sheet,
  Text,
} from '@cardstack/components';
import MerchantSectionCard, {
  USER_ICON_SIZE,
} from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import { TransactionBaseProps } from '@cardstack/components/Transactions/TransactionBase';
import { MerchantEarnedSpendAndRevenueTransactionType } from '@cardstack/types';
import { dateFormatter, getAddressPreview } from '@cardstack/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { RouteType } from '@cardstack/navigation/types';

interface Params {
  transaction: TransactionBaseProps &
    MerchantEarnedSpendAndRevenueTransactionType;
}

const PaymentReceivedSheet = () => {
  const {
    params: { transaction },
  } = useRoute<RouteType<Params>>();

  const {
    address,
    spendBalanceDisplay,
    nativeBalanceDisplay,
    timestamp,
    transactionHash,
    transaction: transactionData,
    token,
  } = transaction;

  const network = useRainbowSelector(state => state.settings.network);

  const earnedTxnData = {
    ...transactionData,
    subText: transactionData.netEarned.display,
  };

  const rowProps = {
    ...transaction,
    CoinIcon: <CoinIcon size={30} symbol={token.symbol} />,
    primaryText: `+ ${transactionData.netEarned.display}`,
    subText: transactionData.netEarnedNativeDisplay,
    symbol: token.symbol || undefined,
  };

  return (
    <Sheet isFullScreen scrollEnabled>
      <Container backgroundColor="white" marginBottom={16} padding={8}>
        <Text marginBottom={2} size="medium">
          Payment Received
        </Text>
        <MerchantSectionCard
          customIcon={
            <Icon
              name="check-circle"
              size={USER_ICON_SIZE}
              stroke="blueLightBorder"
              color="blueOcean"
            />
          }
        >
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
          {transaction.Header}
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
          transactionHash={transaction.transactionHash}
        />
      </Container>
    </Sheet>
  );
};

export default memo(PaymentReceivedSheet);
