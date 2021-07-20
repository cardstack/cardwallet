import React from 'react';
import { TransactionBase } from './TransactionBase';
import { CoinIcon, SafeHeader } from '@cardstack/components';
import { DepotBridgedLayer1TransactionType } from '@cardstack/types';

export interface DepotBridgedLayer1TransactionProps {
  item: DepotBridgedLayer1TransactionType;
}

/**
 * A component for displaying a transaction item
 */
export const DepotBridgedLayer1Transaction = ({
  item,
}: DepotBridgedLayer1TransactionProps) => {
  return (
    <TransactionBase
      CoinIcon={
        <CoinIcon address={item.token.address} symbol={item.token.symbol} />
      }
      Header={<SafeHeader address={item.to} small rightText="DEPOT" />}
      primaryText={`- ${item.balance.display}`}
      statusIconName="arrow-up"
      statusText="Withdrawn"
      statusSubText="TO MAINNET"
      subText={item.native.display}
      transactionHash={item.transactionHash}
    />
  );
};
