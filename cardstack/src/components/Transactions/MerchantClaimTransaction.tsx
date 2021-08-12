import React from 'react';
import {
  TransactionBase,
  TransactionBaseCustomizationProps,
} from './TransactionBase';
import { Container, CoinIcon, Text } from '@cardstack/components';
import { MerchantClaimType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';

export interface MerchantClaimTransactionProps
  extends TransactionBaseCustomizationProps {
  item: MerchantClaimType;
}

export const MerchantClaimTransaction = ({
  item,
  ...props
}: MerchantClaimTransactionProps) => {
  return (
    <TransactionBase
      {...props}
      CoinIcon={
        <CoinIcon address={item.token.address} symbol={item.token.symbol} />
      }
      Header={
        <Container paddingTop={2} paddingHorizontal={5}>
          <Text fontFamily="RobotoMono-Regular" color="blueText" size="xs">
            {`From ${getAddressPreview(item.address)}`}
          </Text>
        </Container>
      }
      primaryText={`- ${item.balance.display}`}
      statusIconName="arrow-down"
      statusText="Earned"
      subText={item.native.display}
      transactionHash={item.transactionHash}
    />
  );
};
