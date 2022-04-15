import React from 'react';

import { CoinIcon, SafeHeader } from '@cardstack/components';
import { DepotBridgedLayer1TransactionType } from '@cardstack/types';

import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';

export interface DepotBridgedLayer1TransactionProps
  extends TransactionBaseCustomizationProps {
  item: DepotBridgedLayer1TransactionType;
}

export const DepotBridgedLayer1Transaction = ({
  item,
  ...props
}: DepotBridgedLayer1TransactionProps) => {
  return (
    <TransactionBase
      {...props}
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
