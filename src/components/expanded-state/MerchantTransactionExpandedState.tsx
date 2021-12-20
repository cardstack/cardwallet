import React, { useEffect, useMemo } from 'react';
import { SlackSheet } from '../sheet';
import {
  MerchantPaymentItemDetail,
  MerchantPaymentItemDetailProps,
} from './payment-item-details';
import {
  BlockscoutButton,
  Container,
  HorizontalDivider,
  Text,
} from '@cardstack/components';
import {
  TransactionRow,
  TransactionRowProps,
} from '@cardstack/components/Transactions/TransactionBase';
import {
  MerchantClaimTypeTxn,
  MerchantEarnedRevenueTransactionTypeTxn,
} from '@cardstack/types';
import { ClaimStatuses, ClaimStatusTypes } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

interface MerchantTransactionExpandedStateProps {
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
  claimStatus: ClaimStatusTypes;
}

interface Section {
  data: any[];
  title: string;
}

interface EarnedTransactionProps
  extends MerchantEarnedRevenueTransactionTypeTxn {
  subText: string;
  txRowProps: Asset;
}

interface ClaimedTransactionProps extends MerchantClaimTypeTxn {
  txRowProps: Asset;
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

const EarnedTransaction = (data: EarnedTransactionProps) => {
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
  const earnedItems = [
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
  ];
  return (
    <>
      <TransactionRow {...txRowProps} hasBottomDivider />
      <Container padding={6}>
        <TransactionExchangeRateRow rate={spendConversionRate} />
        {earnedItems.map(
          (item: MerchantPaymentItemDetailProps, index: number) => {
            return (
              <MerchantPaymentItemDetail
                description={item.description}
                key={index}
                subValue={item.subValue}
                symbol={item.symbol}
                value={item.value}
              />
            );
          }
        )}
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
const ClaimedTransaction = ({
  grossClaimed,
  gasNativeFee,
  gasFee,
  netClaimed,
  txRowProps,
}: ClaimedTransactionProps) => {
  return (
    <>
      <TransactionRow {...txRowProps} hasBottomDivider />
      <Container padding={6}>
        <MerchantPaymentItemDetail
          description={'REVENUE \nCLAIMED'}
          value={grossClaimed}
        />
        <MerchantPaymentItemDetail
          description="GAS FEE"
          subValue={gasNativeFee}
          value={gasFee}
        />
        <HorizontalDivider />
        <MerchantPaymentItemDetail
          description="NET CLAIMED"
          value={netClaimed}
        />
      </Container>
    </>
  );
};

const CHART_HEIGHT = 650;

export default function MerchantTransactionExpandedState(
  props: MerchantTransactionExpandedStateProps
) {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);
  const transactionData =
    props.asset?.section?.data[props.asset.index]?.transaction;

  const network = useRainbowSelector(state => state.settings.network);
  const earnedTxnData = {
    ...transactionData,
    subText: transactionData.netEarned.display,
  };

  const rowProps = {
    ...props.asset,
    primaryText: `+ ${transactionData.netEarned}`,
    subText: transactionData.netEarnedNativeDisplay,
  };

  return useMemo(
    () => (
      <SlackSheet flex={1} scrollEnabled>
        <Container backgroundColor="white" marginBottom={32} padding={8}>
          <Text marginBottom={10} size="medium">
            Transaction details
          </Text>
          <Container
            backgroundColor="white"
            borderColor="borderGray"
            borderRadius={10}
            borderWidth={1}
            marginBottom={8}
            overflow="scroll"
            paddingHorizontal={2}
          >
            {Object.values<string>(ClaimStatuses).includes(
              props.asset.claimStatus
            ) ? (
              <ClaimedTransaction
                {...transactionData}
                txRowProps={props.asset}
              />
            ) : (
              <EarnedTransaction {...earnedTxnData} txRowProps={rowProps} />
            )}
          </Container>
          <BlockscoutButton
            network={network}
            transactionHash={props.asset.transactionHash}
          />
        </Container>
      </SlackSheet>
    ),
    [earnedTxnData, network, props.asset, rowProps, transactionData]
  );
}
