import React from 'react';

import { TransactionItem } from '../../types/TransactionItem';
import { Theme } from '@cardstack/theme';
import {
  Container,
  CoinIcon,
  ContainerProps,
  Icon,
  IconProps,
  Text,
} from '@cardstack/components';

interface TransactionCoinRowData {
  actionTextColor: keyof Theme['colors'];
  iconProps: IconProps;
  transactionTextColor: keyof Theme['colors'];
  transactionSymbol: string;
}

// I have no idea what the possible statuses are for this component
const statusToData: {
  [key: string]: TransactionCoinRowData;
} = {
  // self => from https://web3modal.com/
  self: {
    actionTextColor: 'blueText',
    iconProps: {
      name: 'send',
      top: 1,
      size: 17,
    },
    transactionSymbol: '-',
    transactionTextColor: 'black',
  },
  sent: {
    actionTextColor: 'blueText',
    iconProps: {
      name: 'send',
      top: 1,
      size: 17,
    },
    transactionSymbol: '-',
    transactionTextColor: 'black',
  },
  sending: {
    actionTextColor: 'blueText',
    iconProps: {
      name: 'send',
      top: 1,
      size: 17,
    },
    transactionSymbol: '-',
    transactionTextColor: 'black',
  },
  swapping: {
    actionTextColor: 'blueOcean',
    iconProps: {
      name: 'swap',
      top: 1,
      size: 14,
      color: 'blueOcean',
    },
    transactionSymbol: '-',
    transactionTextColor: 'black',
  },
  swapped: {
    actionTextColor: 'blueOcean',
    iconProps: {
      name: 'swap',
      top: 1,
      size: 14,
      color: 'blueOcean',
    },
    transactionSymbol: '-',
    transactionTextColor: 'black',
  },
  received: {
    actionTextColor: 'blueText',
    iconProps: {
      name: 'arrow-down',
      top: 1,
      size: 14,
      color: 'blueText',
    },
    transactionSymbol: '+',
    transactionTextColor: 'black',
  },
};

export interface TransactionCoinRowProps extends ContainerProps {
  item: TransactionItem;
}

/**
 * A component for displaying a transaction item
 */
export const TransactionCoinRow = ({
  item,
  ...props
}: TransactionCoinRowProps) => {
  console.log({ item });

  if (!item) {
    return null;
  }

  return (
    <Container
      width="100%"
      alignItems="center"
      testID="transaction-coin-row"
      paddingHorizontal={5}
      {...props}
    >
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
        <Left item={item} />
        <Right item={item} />
      </Container>
    </Container>
  );
};

const Left = ({ item }: TransactionCoinRowProps) => {
  const data = statusToData[item.status];

  if (!data) {
    return null;
  }

  return (
    <Container flexDirection="row">
      <CoinIcon size={40} {...item} />
      <Container marginLeft={2}>
        <Container flexDirection="row" alignItems="center">
          <Icon color="backgroundBlue" {...data.iconProps} marginRight={1} />
          <Text fontSize={13} color={data.actionTextColor}>
            {item.title}
          </Text>
        </Container>
        <Text fontWeight="700">{item.name}</Text>
      </Container>
    </Container>
  );
};

const Right = ({ item }: TransactionCoinRowProps) => {
  const data = statusToData[item.status];

  if (!item.balance || !item.native || !data) {
    return null;
  }

  return (
    <Container>
      <Container alignItems="flex-end">
        <Text color="blueText" fontSize={13} marginRight={1}>
          {item.balance.display}
        </Text>
        <Text fontWeight="700" color={data.transactionTextColor}>
          {`${data.transactionSymbol} ${item.native.display} USD`}
        </Text>
      </Container>
    </Container>
  );
};
