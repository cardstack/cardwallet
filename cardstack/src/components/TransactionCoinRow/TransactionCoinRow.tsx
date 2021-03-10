import React from 'react';
import { Image } from 'react-native';

import daiIcon from '../../assets/dai.png';
import { getDollarsFromDai, numberWithCommas } from '@cardstack/utils';
import { Theme } from '@cardstack/theme';
import { Container, Icon, Text } from '@cardstack/components';

export enum TransactionType {
  PAID = 'paid',
  RELOADED = 'reloaded',
  FAILED = 'failed',
}

interface TransactionCoinRowData {
  actionText: string;
  actionTextColor: keyof Theme['colors'];
  iconName: string;
  iconSize?: number;
  /** top on icon to center it if needed */
  iconTop?: number;
  recipientText: string;
  transactionTextColor: keyof Theme['colors'];
  transactionSymbol: string;
}

const typeToData: {
  [key in TransactionType]: TransactionCoinRowData;
} = {
  [TransactionType.PAID]: {
    actionText: 'Paid',
    actionTextColor: 'blueText',
    iconName: 'sent-blue',
    iconTop: 1,
    recipientText: 'To',
    transactionSymbol: '-',
    transactionTextColor: 'black',
  },
  [TransactionType.RELOADED]: {
    actionText: 'Reloaded',
    actionTextColor: 'blueText',
    iconName: 'refresh-cw',
    iconSize: 15,
    recipientText: 'Via',
    transactionSymbol: '+',
    transactionTextColor: 'green',
  },
  [TransactionType.FAILED]: {
    actionText: 'Failed',
    actionTextColor: 'red',
    iconName: 'failed',
    iconSize: 10,
    recipientText: 'To',
    transactionSymbol: '-',
    transactionTextColor: 'red',
  },
};

export interface TransactionCoinRowProps {
  recipient: string;
  transactionAmount: number;
  type: TransactionType;
}

/**
 * A component for displaying a transaction item
 */
export const TransactionCoinRow = ({
  type,
  transactionAmount,
  recipient,
}: TransactionCoinRowProps) => {
  const data = typeToData[type];

  return (
    <Container width="100%" alignItems="center" testID="transaction-coin-row">
      <Container
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        width="100%"
        padding={4}
        backgroundColor="white"
        borderRadius={10}
        borderColor="borderGray"
        borderWidth={1}
        margin={2}
      >
        <Left data={data} />
        <Right
          data={data}
          transactionAmount={transactionAmount}
          recipient={recipient}
        />
      </Container>
    </Container>
  );
};

const Left = ({ data }: { data: TransactionCoinRowData }) => (
  <Container flexDirection="row">
    <Container height={40} width={40} marginRight={3}>
      <Image
        source={daiIcon}
        resizeMode="contain"
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </Container>
    <Container>
      <Container flexDirection="row" alignItems="center">
        <Icon
          name={data.iconName}
          size={data.iconSize || 18}
          marginRight={1}
          color="backgroundBlue"
        />
        <Text fontSize={13} color={data.actionTextColor}>
          {data.actionText}
        </Text>
      </Container>
      <Text fontWeight="700">Spend</Text>
    </Container>
  </Container>
);

interface RightProps {
  data: TransactionCoinRowData;
  transactionAmount: number;
  recipient: string;
}

const Right = ({ data, transactionAmount, recipient }: RightProps) => {
  const formattedDollars = numberWithCommas(
    getDollarsFromDai(transactionAmount).toFixed(2)
  );

  return (
    <Container>
      <Container flexDirection="row">
        <Text color="blueText" fontSize={13} marginRight={1}>
          {data.recipientText}
        </Text>
        <Text color="blueText" fontSize={13} fontWeight="700">
          {` ${recipient}`}
        </Text>
      </Container>
      <Container marginTop={4} alignItems="flex-end">
        <Text color="blueText" fontSize={13} marginRight={1}>
          {`§${numberWithCommas(transactionAmount.toString())} SPEND`}
        </Text>
        <Text fontWeight="700" color={data.transactionTextColor}>
          {`${data.transactionSymbol} $${formattedDollars} USD`}
        </Text>
      </Container>
    </Container>
  );
};
