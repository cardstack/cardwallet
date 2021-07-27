import React from 'react';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { CoinIcon, SafeHeader } from '@cardstack/components';
import { DepotBridgedLayer2TransactionType } from '@cardstack/types';

export interface DepotBridgedLayer2TransactionProps
  extends TransactionBaseCustomizationProps {
  item: DepotBridgedLayer2TransactionType;
}

export const DepotBridgedLayer2Transaction = ({
  item,
  ...props
}: DepotBridgedLayer2TransactionProps) => {
  return (
    <TransactionBase
      {...props}
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
