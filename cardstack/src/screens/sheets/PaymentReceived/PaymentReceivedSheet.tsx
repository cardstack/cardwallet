import { useRoute } from '@react-navigation/native';
import React, { memo, useMemo } from 'react';

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
import { RouteType } from '@cardstack/navigation/types';
import { MerchantEarnedSpendAndRevenueTransactionType } from '@cardstack/types';
import { dateFormatter, getAddressPreview } from '@cardstack/utils';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';

import { strings } from './strings';

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
    fromAddress,
    nativeBalanceDisplay,
    timestamp,
    transactionHash,
    transaction: transactionData,
    token,
    Header,
  } = transaction;

  const network = useRainbowSelector(state => state.settings.network);

  const rowProps = useMemo(
    () => ({
      ...transaction,
      CoinIcon: <CoinIcon size={30} symbol={token.symbol} />,
      primaryText: `+ ${transactionData.netEarned.display}`,
      subText: transactionData.netEarnedNativeDisplay,
      symbol: token.symbol || undefined,
    }),
    [token.symbol, transaction, transactionData]
  );

  return (
    <Sheet isFullScreen scrollEnabled>
      <Container backgroundColor="white" marginBottom={16} padding={8}>
        <Text marginBottom={2} size="medium">
          {strings.paymentReceived}
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
            <Text color="black" weight="bold" marginTop={2} size="xs">
              {getAddressPreview(address)}
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
          {Header}
          <EarnedTransaction {...transactionData} txRowProps={rowProps} />
          <PaymentDetailsItem
            info={fromAddress}
            isPrepaidCard
            title={strings.from}
          />
          <PaymentDetailsItem info={transactionHash} title={strings.txnHash} />
          <PaymentDetailsItem
            info={timestamp}
            infoColor="black"
            isTimestamp
            title={strings.localTitle}
          />
        </Container>
        <BlockscoutButton network={network} transactionHash={transactionHash} />
      </Container>
    </Sheet>
  );
};

export default memo(PaymentReceivedSheet);
