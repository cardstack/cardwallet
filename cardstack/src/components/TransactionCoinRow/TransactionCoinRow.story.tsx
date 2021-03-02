import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { text, number } from '@storybook/addon-knobs';
import { Container } from '../Container';

import { TransactionCoinRow, TransactionType } from './TransactionCoinRow';

storiesOf('Transaction Coin Row', module).add('Default', () => {
  const transactionAmount = number('Transaction Amount', 600);
  const recipient = text('Recipient', 'BGY Solutions');

  const props = {
    transactionAmount,
    recipient,
  };

  return (
    <Container width="100%" alignItems="center">
      <TransactionCoinRow {...props} type={TransactionType.PAID} />
      <TransactionCoinRow {...props} type={TransactionType.RELOADED} />
      <TransactionCoinRow {...props} type={TransactionType.FAILED} />
    </Container>
  );
});
