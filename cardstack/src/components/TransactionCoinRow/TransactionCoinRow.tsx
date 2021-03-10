import React from 'react';
import CoinIcon from 'react-coin-icon';

import { TransactionItem } from '../../types/TransactionItem';
import { ContainerProps } from '../Container';
import { Theme } from '@cardstack/theme';
import { Container, Icon, IconProps, Text } from '@cardstack/components';

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
  sent: {
    actionTextColor: 'blueText',
    iconProps: {
      name: 'sent',
      top: 1,
      size: 17,
    },
    transactionSymbol: '-',
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

  return (
    <Container flexDirection="row">
      <CoinIcon size={40} {...item} />
      <Container marginLeft={2}>
        <Container flexDirection="row" alignItems="center">
          <Icon {...data.iconProps} marginRight={1} color="backgroundBlue" />
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
