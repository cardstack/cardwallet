import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Container } from '../Container';
import { TransactionCoinRow } from './TransactionCoinRow';
import { TransactionStatus } from '@cardstack/types';

const exampleTransaction = {
  from: '0xAa262652e7459693fdA194b33d288b487908E520',
  nonce: 0,
  to: '0xf7FBF7200F2D98979858127baF22FB85c94f3592',
  balance: {
    amount: '5',
    display: '5.00 ETH',
  },
  description: 'Ethereum',
  gasLimit: '21000',
  gasPrice: '142029000000',
  hash: '0x57d91b5b7e5259c009e21f8d8e2ea06e7ea437ff4a2e5391fdc47de573cef3fd-0',
  minedAt: 1615326853,
  name: 'Ethereum',
  native: {
    amount: '5',
    display: '$5.00',
  },
  pending: false,
  status: TransactionStatus.sent,
  symbol: 'ETH',
  title: 'Sent',
};

storiesOf('Transaction Coin Row', module).add('Default', () => {
  return (
    <Container width="100%" alignItems="center">
      <TransactionCoinRow item={exampleTransaction} />
    </Container>
  );
});
