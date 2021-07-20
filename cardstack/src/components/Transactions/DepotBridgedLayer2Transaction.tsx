import React from 'react';
import { TransactionBase } from './TransactionBase';
import { CoinIcon, SafeHeader } from '@cardstack/components';
import { DepotBridgedLayer2TransactionType } from '@cardstack/types';

export interface DepotBridgedLayer2TransactionProps {
  item: DepotBridgedLayer2TransactionType;
}

/**
 * A component for displaying a transaction item
 */
export const DepotBridgedLayer2Transaction = ({
  item,
}: DepotBridgedLayer2TransactionProps) => {
  return (
    <TransactionBase
      CoinIcon={
        <CoinIcon address={item.token.address} symbol={item.token.symbol} />
      }
      Header={<SafeHeader address={item.to} small rightText="DEPOT" />}
      primaryText={`+ ${item.balance.display}`}
      statusIconName="arrow-down"
      statusText="Received"
      subText={item.native.display}
      transactionHash={item.transactionHash}
    />
  );
};
