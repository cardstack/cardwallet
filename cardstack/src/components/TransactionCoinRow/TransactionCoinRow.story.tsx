import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { TransactionCoinRow } from './TransactionCoinRow';

storiesOf('Transaction Coin Row', module).add('Default', () => (
  <TransactionCoinRow />
));
