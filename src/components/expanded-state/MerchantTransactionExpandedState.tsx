import React, { useEffect, useMemo } from 'react';
import { SlackSheet } from '../sheet';
import {
  BlockscoutButton,
  CoinIcon,
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
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

interface ItemDetailProps {
  description: string;
  value?: string;
  subValue?: string;
  symbol?: string;
}

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

const CLAIMED_STATUS = 'Claimed';

const ItemDetail = ({
  description,
  value,
  subValue = '',
  symbol = 'DAI',
}: ItemDetailProps) => {
  return (
    <Container
      flexDirection="row"
      justifyContent="space-between"
      marginBottom={10}
    >
      <Container flex={1}>
        <Text color="blueText" fontSize={13} fontWeight="600" marginTop={1}>
          {description}
        </Text>
      </Container>
      <Container flex={1} flexDirection="row">
        <Container marginRight={3} marginTop={1}>
          <CoinIcon size={20} symbol={symbol} />
        </Container>
        <Container>
          <Text weight="extraBold">{value}</Text>
          <Text color="blueText" fontSize={13}>
            {subValue}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

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
    customerSpendUsd,
    protocolFee,
    revenueCollected,
    spendConversionRate,
    netEarned,
    netEarnedNative,
    txRowProps,
  } = data;
  const earnedItems = [
    {
      description: 'CUSTOMER \nSPEND',
      subValue: customerSpendUsd,
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
        {earnedItems.map((item: ItemDetailProps, index: number) => {
          return (
            <ItemDetail
              description={item.description}
              key={index}
              subValue={item.subValue}
              symbol={item.symbol}
              value={item.value}
            />
          );
        })}
        <HorizontalDivider />
        <ItemDetail
          description="NET EARNED"
          subValue={netEarnedNative}
          value={`+ ${netEarned}`}
        />
      </Container>
    </>
  );
};
const ClaimedTransaction = ({
  grossClaimed,
  gasUsdFee,
  gasFee,
  netClaimed,
  txRowProps,
}: ClaimedTransactionProps) => {
  return (
    <>
      <TransactionRow {...txRowProps} hasBottomDivider />
      <Container padding={6}>
        <ItemDetail description={'REVENUE \nCLAIMED'} value={grossClaimed} />
        <ItemDetail description="GAS FEE" subValue={gasUsdFee} value={gasFee} />
        <HorizontalDivider />
        <ItemDetail description="NET CLAIMED" value={netClaimed} />
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
    subText: transactionData.netEarned,
  };

  const rowProps = {
    ...props.asset,
    primaryText: `+ ${transactionData.netEarned}`,
    subText: transactionData.netEarnedNative,
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
            {props.asset.statusText === CLAIMED_STATUS ? (
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
