import React, { memo } from 'react';
import { useRoute } from '@react-navigation/core';
import { strings } from './strings';
import {
  BlockscoutButton,
  Container,
  Icon,
  PaymentDetailsItem,
  Sheet,
  Text,
} from '@cardstack/components';
import { dateFormatter } from '@cardstack/utils';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import { TransactionRow } from '@cardstack/components/Transactions/TransactionBase';
import { PrepaidCardTransactionHeader } from '@cardstack/components/Transactions/PrepaidCard/PrepaidCardTransactionHeader';
import { RouteType } from '@cardstack/navigation/types';
import { PrepaidCardPaymentTransactionType } from '@cardstack/types';
import { useAccountSettings } from '@rainbow-me/hooks';

const PaymentConfirmationSheet = () => {
  const {
    params: {
      merchantInfo,
      nativeBalanceDisplay = '',
      timestamp,
      transactionHash,
      merchantSafeAddress,
      address,
      cardCustomization,
    },
  } = useRoute<RouteType<PrepaidCardPaymentTransactionType>>();

  const { network } = useAccountSettings();

  return (
    <Sheet isFullScreen scrollEnabled>
      <Container backgroundColor="white" padding={6}>
        <Text marginBottom={10} size="medium">
          {strings.title}
        </Text>
        <MerchantSectionCard merchantInfoDID={merchantInfo} paddingBottom={5}>
          <Container alignItems="center">
            <Text fontSize={34} weight="extraBold">
              {nativeBalanceDisplay}
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
          borderColor="borderGray"
          borderRadius={10}
          borderWidth={1}
          marginBottom={8}
          overflow="scroll"
        >
          <PrepaidCardTransactionHeader
            address={address}
            cardCustomization={cardCustomization}
          />
          <TransactionRow
            CoinIcon={<Icon name="spend" />}
            statusIconName="arrow-up"
            statusText={strings.paid}
            primaryText={nativeBalanceDisplay}
            hasBottomDivider
          />
          <PaymentDetailsItem
            title={strings.to}
            {...merchantInfo}
            info={merchantSafeAddress}
          />
          <PaymentDetailsItem info={transactionHash} title={strings.txHash} />
          <PaymentDetailsItem
            info={timestamp}
            infoColor="black"
            isTimestamp
            title={strings.localTime}
          />
        </Container>
        <BlockscoutButton network={network} transactionHash={transactionHash} />
      </Container>
    </Sheet>
  );
};

export default memo(PaymentConfirmationSheet);
