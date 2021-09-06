import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { SlackSheet } from '../sheet';
import {
  Button,
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
import { normalizeTxHash } from '@cardstack/utils';
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
        <Text color="blueText" fontSize={13} fontWeight="600">
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
    protocolFeeUsd,
    protocolFee,
    subText,
    spendConversionRate,
  } = data;
  const earnedItems = [
    {
      description: 'CUSTOMER \nSPEND',
      subValue: customerSpend,
      symbol: 'SPEND',
      value: customerSpend + ' SPEND',
    },
    { description: 'REVENUE \nCOLLECTED', value: subText },
    {
      description: 'PROTOCOL FEE \n(0.5%)',
      subValue: protocolFeeUsd,
      value: protocolFee,
    },
  ];
  return (
    <Container>
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
    </Container>
  );
};
const ClaimedTransaction = ({
  grossClaimed,
  gasUsdFee,
  gasFee,
  netClaimed,
}: MerchantClaimTypeTxn) => {
  return (
    <Container>
      <ItemDetail description={'REVENUE \nCLAIMED'} value={grossClaimed} />
      <ItemDetail description="GAS FEE" subValue={gasUsdFee} value={gasFee} />
      <HorizontalDivider />
      <ItemDetail description="NET CLAIMED" value={netClaimed} />
    </Container>
  );
};

const BlockscoutButton = ({
  network,
  transactionHash,
}: {
  network: string;
  transactionHash: string;
}) => {
  const onPress = useCallback(() => {
    const blockExplorer = getConstantByNetwork('blockExplorer', network);
    const normalizedHash = normalizeTxHash(transactionHash);
    Linking.openURL(`${blockExplorer}/tx/${normalizedHash}`);
  }, [network, transactionHash]);
  return (
    <Button
      marginBottom={12}
      onPress={onPress}
      variant="smallWhite"
      width="100%"
    >
      View on Blockscout
    </Button>
  );
};

export default function MerchantTransactionExpandedState(
  props: MerchantTransactionExpandedStateProps
) {
  const transactionData =
    props.asset?.section?.data[props.asset.index]?.transaction;

  const network = useRainbowSelector(state => state.settings.network);
  const earnedTxnData = { ...transactionData, subText: props.asset?.subText };
  return (
    <>
      <SlackSheet bottomInset={42} height="100%" scrollEnabled={false}>
        <Container backgroundColor="white" padding={8}>
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
            <TransactionRow {...props.asset} hasBottomDivider />
            <Container padding={6}>
              {props.asset.statusText === CLAIMED_STATUS ? (
                <ClaimedTransaction {...transactionData} />
              ) : (
                <EarnedTransaction {...earnedTxnData} />
              )}
            </Container>
          </Container>
          <BlockscoutButton
            network={network}
            transactionHash={props.asset.transactionHash}
          />
        </Container>
      </SlackSheet>
    </>
  );
}
