import React from 'react';

import { NetworkBadge } from '../NetworkBadge';
import { getDisplayDataByStatus } from './statusToDisplayData';
import { TransactionBase, TransactionRow } from './TransactionBase';
import { ERC20TransactionType } from '@cardstack/types';
import { CoinIcon, Container, ContainerProps } from '@cardstack/components';

export interface ERC20TransactionProps extends ContainerProps {
  item: ERC20TransactionType;
}

export const ERC20Transaction = ({ item }: ERC20TransactionProps) => {
  const displayData = getDisplayDataByStatus(item.status);

  const Footer = item.swappedFor ? (
    <TransactionRow
      CoinIcon={<CoinIcon size={40} {...item} />}
      statusIconName={displayData.iconProps.name}
      statusIconProps={displayData.iconProps}
      statusText={item.title}
      primaryText={`${displayData.transactionSymbol} ${item.balance.display}`}
      subText={item.native.display}
    />
  ) : undefined;

  return (
    <TransactionBase
      CoinIcon={<CoinIcon size={40} {...item} />}
      Header={
        <Container paddingTop={4} paddingHorizontal={5}>
          <NetworkBadge />
        </Container>
      }
      Footer={Footer}
      statusIconName={displayData.iconProps.name}
      statusIconProps={displayData.iconProps}
      statusText={item.title}
      primaryText={`${displayData.transactionSymbol} ${item.balance.display}`}
      subText={item.native.display}
      transactionHash={item.hash}
    />
  );
};
