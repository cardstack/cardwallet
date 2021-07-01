export enum TransactionStatus {
  approved = 'approved',
  approving = 'approving',
  cancelled = 'cancelled',
  cancelling = 'cancelling',
  deposited = 'deposited',
  depositing = 'depositing',
  failed = 'failed',
  purchased = 'purchased',
  purchasing = 'purchasing',
  received = 'received',
  receiving = 'receiving',
  self = 'self',
  sending = 'sending',
  sent = 'sent',
  // eslint-disable-next-line @typescript-eslint/camelcase
  speeding_up = 'speeding up',
  swapped = 'swapped',
  swapping = 'swapping',
  unknown = 'unknown status',
  withdrawing = 'withdrawing',
  withdrew = 'withdrew',
}

export interface TransactionItemType {
  from: string;
  to: string;
  balance: {
    amount: string;
    display: string;
  };
  hash: string;
  minedAt: number;
  native: {
    amount: string;
    display: string;
  };
  status: TransactionStatus;
  title: string;
  swappedFor?: any;
}
