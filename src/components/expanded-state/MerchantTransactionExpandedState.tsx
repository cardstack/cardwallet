import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';
import { Linking } from 'react-native';
import { SlackSheet } from '../sheet';
import {
  Button,
  CoinIcon,
  Container,
  HorizontalDivider,
  Text,
} from '@cardstack/components';
import { TransactionRow } from '@cardstack/components/Transactions/TransactionBase';
import { normalizeTxHash } from '@cardstack/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

interface ItemDetail {
  description?: string;
  value?: string;
  subValue?: string;
  symbol?: string;
}

const CLAIMED_STATUS = 'Claimed';

export default function MerchantTransactionExpandedState(props: any) {
  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);
  const normalizedHash = normalizeTxHash(props.asset?.transactionHash);

  const transactionData =
    props.asset?.section?.data[props.asset.index]?.transaction;

  const ItemDetail = ({
    description,
    value,
    subValue = '',
    symbol = 'DAI',
  }: ItemDetail) => {
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

  const TransactionExchangeRateRow = () => {
    return (
      <>
        <Text color="blueText" fontSize={13} marginBottom={1} weight="bold">
          TRANSACTION EXCHANGE RATE
        </Text>
        <Text fontSize={16} marginBottom={8} weight="extraBold">
          1 SPEND = 0.99 DAI
        </Text>
      </>
    );
  };

  const EarnedTransaction = () => {
    return (
      <Container>
        <TransactionExchangeRateRow />
        <ItemDetail
          description={'CUSTOMER \nSPEND'}
          subValue={props.asset.subText}
          symbol="SPEND"
          value="$2000 SPEND"
        />
        <ItemDetail
          description={'REVENUE \nCLAIMED'}
          value={props.asset.primaryText}
        />
        <ItemDetail
          description="GAS FEE"
          subValue="$20.00 USD"
          value="$2000 SPEND"
        />
        <ItemDetail
          description={'PROTOCOL FEE \n(0.5%)'}
          subValue="$20.00 USD"
          value="$2000 SPEND"
        />
      </Container>
    );
  };
  const ClaimedTransaction = () => {
    return (
      <Container>
        <ItemDetail
          description={'REVENUE \nCLAIMED'}
          value={transactionData?.grossClaimed}
        />
        <ItemDetail
          description="GAS FEE"
          subValue={transactionData?.gasUsdFee}
          value={transactionData?.gasFee}
        />
        <HorizontalDivider />
        <ItemDetail
          description="NET CLAIMED"
          value={transactionData?.netClaimed}
        />
      </Container>
    );
  };

  const BlockscoutButton = () => {
    return (
      <Button
        marginBottom={12}
        onPress={() => Linking.openURL(`${blockExplorer}/tx/${normalizedHash}`)}
        variant="smallWhite"
        width="100%"
      >
        View on Blockscout
      </Button>
    );
  };

  return (
    <>
      {/* @ts-ignore */}
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
                <ClaimedTransaction />
              ) : (
                <EarnedTransaction />
              )}
            </Container>
          </Container>
          <BlockscoutButton />
        </Container>
      </SlackSheet>
    </>
  );
}
