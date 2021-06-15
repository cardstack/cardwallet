import React from 'react';

import { NetworkBadge } from '../NetworkBadge';
import { getDisplayDataByStatus } from './statusToDisplayData';
import { TransactionItem, TransactionStatus } from '@cardstack/types';
import {
  CoinIcon,
  Container,
  ContainerProps,
  HorizontalDivider,
  Icon,
  Text,
  Touchable,
} from '@cardstack/components';
import { getHumanReadableDate } from '@rainbow-me/helpers/transactions';
import TransactionActions from '@rainbow-me/helpers/transactionActions';
import { ethereumUtils, showActionSheetWithOptions } from '@rainbow-me/utils';
import { getAddressPreview } from '@cardstack/utils';

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
  const onPressTransaction = () => {
    const { hash, minedAt, status, to, from } = item;

    const date = getHumanReadableDate(minedAt);

    const isSent =
      status === TransactionStatus.sending || status === TransactionStatus.sent;

    const contactAddress = isSent ? to : from;

    const headerInfo = {
      address: getAddressPreview(contactAddress),
      divider: isSent ? 'to' : 'from',
      type: status.charAt(0).toUpperCase() + status.slice(1),
    };

    if (hash) {
      const buttons = [
        TransactionActions.viewOnEtherscan,
        TransactionActions.close,
      ];

      showActionSheetWithOptions(
        {
          cancelButtonIndex: buttons.length - 1,
          options: buttons,
          title: `${headerInfo.type} ${date} ${headerInfo.divider} ${headerInfo.address}`,
        },
        (buttonIndex: number) => {
          const action = buttons[buttonIndex];

          if (action === TransactionActions.viewOnEtherscan) {
            ethereumUtils.openTransactionEtherscanURL(hash);
          }
        }
      );
    }
  };

  if (!item) {
    return null;
  }

  return (
    <Touchable
      width="100%"
      alignItems="center"
      testID="transaction-coin-row"
      paddingHorizontal={5}
      onPress={onPressTransaction}
      {...props}
    >
      <Container
        width="100%"
        padding={4}
        backgroundColor="white"
        borderRadius={10}
        borderColor="borderGray"
        borderWidth={1}
        margin={2}
      >
        <NetworkBadge marginBottom={4} />
        {item.swappedFor && (
          <>
            <TransactionRow {...item.swappedFor} />
            <HorizontalDivider />
          </>
        )}
        <TransactionRow {...item} />
      </Container>
    </Touchable>
  );
};

const TransactionRow = (item: TransactionItem) => (
  <Container
    alignItems="center"
    justifyContent="space-between"
    flexDirection="row"
    width="100%"
  >
    <Left {...item} />
    <Right {...item} />
  </Container>
);

const Left = (item: TransactionItem) => {
  const displayData = getDisplayDataByStatus(item.status);

  return (
    <Container flexDirection="row" alignItems="center">
      <CoinIcon size={40} {...item} />
      <Container flexDirection="row" alignItems="center" marginLeft={2}>
        <Icon
          color="backgroundBlue"
          {...displayData.iconProps}
          marginRight={1}
        />
        <Text fontSize={13} color="blueText" weight="bold">
          {item.title}
        </Text>
      </Container>
    </Container>
  );
};

const Right = (item: TransactionItem) => {
  const displayData = getDisplayDataByStatus(item.status);

  return (
    <Container>
      <Container alignItems="flex-end">
        <Text weight="extraBold">{`${displayData.transactionSymbol} ${item.balance.display}`}</Text>
        <Text variant="subText">{`${item.native.display}`}</Text>
      </Container>
    </Container>
  );
};
