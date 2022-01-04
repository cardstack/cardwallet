import React, { useMemo } from 'react';
import {
  Container,
  HorizontalDivider,
  MerchantPaymentItemDetail,
  MerchantPaymentItemDetailProps,
  Text,
} from '@cardstack/components';
import {
  TransactionRow,
  TransactionRowProps,
} from '@cardstack/components/Transactions/TransactionBase';
import { MerchantEarnedRevenueTransactionTypeTxn } from '@cardstack/types';

interface EarnedTransactionProps
  extends MerchantEarnedRevenueTransactionTypeTxn {
  subText: string;
  txRowProps: TransactionRowProps;
}

const TransactionExchangeRateRow = ({ rate }: { rate: string }) => {
  return (
    <>
      <Text color="blueText" fontSize={13} marginBottom={1} weight="bold">
        TRANSACTION EXCHANGE RATE
      </Text>
      <Text fontSize={16} marginBottom={8} weight="extraBold">
        1 SPEND = {rate}
      </Text>
    </>
  );
};

export const EarnedTransaction = (data: EarnedTransactionProps) => {
  const {
    customerSpend,
    customerSpendNative,
    protocolFee,
    revenueCollected,
    spendConversionRate,
    netEarned,
    netEarnedNativeDisplay,
    txRowProps,
  } = data;

  const MerchantPaymentItemDetails = useMemo(
    () =>
      [
        {
          description: 'CUSTOMER \nSPEND',
          subValue: customerSpendNative,
          symbol: 'SPEND',
          value: customerSpend + ' SPEND',
        },
        { description: 'REVENUE \nCOLLECTED', value: revenueCollected },
        {
          description: 'PROTOCOL FEE \n(0.5%)',
          value: protocolFee,
        },
      ].map((item: MerchantPaymentItemDetailProps, index: number) => (
        <MerchantPaymentItemDetail
          description={item.description}
          key={index}
          subValue={item.subValue}
          symbol={item.symbol}
          value={item.value}
        />
      )),
    [customerSpend, customerSpendNative, protocolFee, revenueCollected]
  );

  return (
    <>
      <TransactionRow {...txRowProps} hasBottomDivider />
      <Container padding={6}>
        <TransactionExchangeRateRow rate={spendConversionRate} />
        {MerchantPaymentItemDetails}
        <HorizontalDivider />
        <MerchantPaymentItemDetail
          description="NET EARNED"
          subValue={netEarnedNativeDisplay}
          value={`+ ${netEarned.display}`}
        />
      </Container>
    </>
  );
};
