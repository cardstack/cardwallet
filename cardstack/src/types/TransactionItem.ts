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

export interface TransactionItem {
  /** ex: '0xAa262652e7459693fdA194b33d288b487908E520' */
  from: string;
  /** ex: 0 */
  nonce: number;
  /** ex: '0xf7FBF7200F2D98979858127baF22FB85c94f3592' */
  to: string;
  balance: {
    /** ex: '5' */
    amount: string;
    /** ex: '5.00 ETH' */
    display: string;
  };
  /** ex: 'Ethereum' */
  description: string;
  /** ex: '21000' */
  gasLimit: string;
  /** ex: '142029000000' */
  gasPrice: string;
  /** ex: '0x57d91b5b7e5259c009e21f8d8e2ea06e7ea437ff4a2e5391fdc47de573cef3fd-0' */
  hash: string;
  /** ex: 1615326853 */
  minedAt: number;
  /** ex: 'Ethereum' */
  name: string;
  native: {
    /** ex: '5' */
    amount: string;
    /** ex: '$5.00' */
    display: string;
  };
  pending: boolean;
  /** ex: 'sent' */
  status: TransactionStatus;
  /** ex: 'ETH' */
  symbol: string;
  /** ex: 'Sent' */
  title: string;
  swappedFor?: any;
}
