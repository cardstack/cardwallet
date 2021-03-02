import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';

import daiIcon from '../../assets/dai.png';
import sentIcon from '../../assets/sent.png';
import reloadedIcon from '../../assets/reloaded.png';
import failedIcon from '../../assets/failed.png';
import { Container, Text } from '@cardstack/components';
import { Theme } from '@cardstack/theme';
import { numberWithCommas, getDollarsFromDai } from '@cardstack/utils';

export enum TransactionType {
  PAID = 'paid',
  RELOADED = 'reloaded',
  FAILED = 'failed',
}

interface TransactionCoinRowData {
  actionText: string;
  actionTextColor: keyof Theme['colors'];
  icon: ImageSourcePropType;
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
    icon: sentIcon,
    iconTop: 1,
    recipientText: 'To',
    transactionSymbol: '-',
    transactionTextColor: 'black',
  },
  [TransactionType.RELOADED]: {
    actionText: 'Reloaded',
    actionTextColor: 'blueText',
    icon: reloadedIcon,
    recipientText: 'Via',
    transactionSymbol: '+',
    transactionTextColor: 'green',
  },
  [TransactionType.FAILED]: {
    actionText: 'Failed',
    actionTextColor: 'red',
    icon: failedIcon,
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
        <Container
          height={data.iconSize || 18}
          width={data.iconSize || 18}
          justifyContent="center"
          alignItems="center"
          marginRight={1}
        >
          <Image
            source={data.icon}
            resizeMode="contain"
            style={{
              height: '100%',
              width: '100%',
              top: data.iconTop,
            }}
          />
        </Container>
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
