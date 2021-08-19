import { TokenType } from '@cardstack/types';

export const sortByTime = (a: any, b: any) => {
  const timeA = Number(a.timestamp || a.minedAt || a.createdAt);
  const timeB = Number(b.timestamp || b.minedAt || b.createdAt);

  return timeB - timeA;
};

export const sortedByTokenBalanceAmount = (tokenItems: any): TokenType[] =>
  [...tokenItems].sort((a: any, b: any) => {
    return b.native?.balance?.amount - a.native?.balance?.amount;
  }) || [];
