import React, { useMemo } from 'react';
import { strings } from './strings';
import {
  Container,
  HorizontalDivider,
  MerchantPaymentItemDetail,
  MerchantPaymentItemDetailProps,
} from '@cardstack/components';
import {
  TransactionRow,
  TransactionRowProps,
} from '@cardstack/components/Transactions/TransactionBase';
import { MerchantEarnedRevenueTransactionTypeTxn } from '@cardstack/types';

interface EarnedTransactionProps
  extends MerchantEarnedRevenueTransactionTypeTxn {
  txRowProps: TransactionRowProps;
}

export const EarnedTransaction = (data: EarnedTransactionProps) => {
  const {
    protocolFee,
    revenueCollected,
    netEarned,
    netEarnedNativeDisplay,
    txRowProps,
  } = data;

  const MerchantPaymentItemDetails = useMemo(
    () =>
      [
        { description: strings.payment, value: revenueCollected },
        {
          description: strings.protocolFee,
          value: protocolFee,
        },
      ].map((item: MerchantPaymentItemDetailProps, index: number) => (
        <MerchantPaymentItemDetail
          description={item.description}
          key={index}
          subValue={item.subValue}
          symbol={item.symbol || txRowProps.symbol}
          value={item.value}
        />
      )),
    [protocolFee, revenueCollected, txRowProps.symbol]
  );

  return (
    <>
      <TransactionRow {...txRowProps} hasBottomDivider />
      <Container padding={6}>
        {MerchantPaymentItemDetails}
        <HorizontalDivider />
        <MerchantPaymentItemDetail
          description={strings.netReceived}
          subValue={netEarnedNativeDisplay}
          value={`+ ${netEarned.display}`}
          symbol={txRowProps.symbol}
        />
      </Container>
    </>
  );
};
