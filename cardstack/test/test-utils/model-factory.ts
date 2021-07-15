import Chance from 'chance';

import {
  ERC20TransactionType,
  TransactionStatus,
  TransactionTypes,
} from '../../src/types';

const chance = new Chance();

export const createRandomTransactionItem = (
  item: Partial<ERC20TransactionType> = {}
): ERC20TransactionType => ({
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
  type: TransactionTypes.ERC_20,
  ...item,
});
