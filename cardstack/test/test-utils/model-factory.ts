import Chance from 'chance';

import { TransactionItem, TransactionStatus } from '../../src/types';

const chance = new Chance();

export const createRandomTransactionItem = (
  item: Partial<TransactionItem> = {}
): TransactionItem => ({
  from: chance.guid(),
  nonce: chance.natural(),
  to: chance.guid(),
  balance: {
    amount: chance.natural().toString(),
    display: chance.string(),
  },
  description: chance.string(),
  gasLimit: chance.string(),
  gasPrice: chance.string(),
  hash: chance.string(),
  minedAt: chance.natural(),
  name: chance.string(),
  native: {
    amount: chance.natural().toString(),
    display: chance.string(),
  },
  pending: chance.bool(),
  status: TransactionStatus.sent,
  symbol: 'ETH',
  title: 'Sent',
  ...item,
});
