import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Container } from '../Container';
import { ERC20Transaction } from './ERC20Transaction';
import { TransactionStatus, TransactionTypes } from '@cardstack/types';

storiesOf('Transaction Coin Row', module).add('Default', () => {
  return (
    <Container width="100%" alignItems="center">
      <ERC20Transaction
        item={{
          from: '0xAa262652e7459693fdA194b33d288b487908E520',
          to: '0xf7FBF7200F2D98979858127baF22FB85c94f3592',
          balance: {
            amount: '5',
            display: '5.00 ETH',
          },
          hash: '0x57d91b5b7e5259c009e21f8d8e2ea06e7ea437ff4a2e5391fdc47de573cef3fd-0',
          minedAt: 1615326853,
          native: {
            amount: '5',
            display: '$5.00',
          },
          status: TransactionStatus.sent,
          symbol: 'ETH',
          title: 'Sent',
          type: TransactionTypes.ERC_20,
        }}
      />
    </Container>
  );
});
