import Chance from 'chance';

import { TransactionItemType, TransactionStatus } from '../../src/types';

const chance = new Chance();

export const createRandomTransactionItem = (
  item: Partial<TransactionItemType> = {}
): TransactionItemType => ({
  from: chance.guid(),
  to: chance.guid(),
  balance: {
    amount: chance.natural().toString(),
    display: chance.string(),
  },
  hash: chance.string(),
  minedAt: chance.natural(),
  native: {
    amount: chance.natural().toString(),
    display: chance.string(),
  },
  status: TransactionStatus.sent,
  symbol: 'ETH',
  title: 'Sent',
  ...item,
});
