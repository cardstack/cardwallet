export enum TransactionTypes {
  DEPOT_BRIDGED_LAYER_1 = 'depotBridgedLayer1',
  DEPOT_BRIDGED_LAYER_2 = 'depotBridgedLayer2',
  PREPAID_CARD_CREATED = 'prepaidCardCreated',
  PREPAID_CARD_PAYMENT = 'prepaidCardPayment',
  PREPAID_CARD_SPLIT = 'prepaidCardSplit',
  PREPAID_CARD_TRANSFER = 'prepaidCardTransfer',
  MERCHANT_CREATION = 'merchantCreation',
  ERC_20 = 'erc20',
}

export interface DepotBridgedLayer2TransactionType {
  balance: {
    amount: string;
    display: string;
  };
  native: {
    amount: string;
    display: string;
  };
  transactionHash: string;
  to: string;
  token: {
    address: string;
    name?: string | null;
    symbol?: string | null;
  };
  timestamp: number;
  type: TransactionTypes.DEPOT_BRIDGED_LAYER_2;
}

export interface DepotBridgedLayer1TransactionType {
  balance: {
    amount: string;
    display: string;
  };
  native: {
    amount: string;
    display: string;
  };
  transactionHash: string;
  to: string;
  token: {
    address: string;
    name?: string | null;
    symbol?: string | null;
  };
  timestamp: number;
  type: TransactionTypes.DEPOT_BRIDGED_LAYER_1;
}

export interface PrepaidCardCustomization {
  background: string;
  issuerName: string;
  patternColor: string;
  patternUrl: string | null;
  textColor: string;
}

export interface PrepaidCardCreatedTransactionType {
  address: string;
  createdAt: number;
  createdFromAddress: string;
  spendAmount: number;
  issuingToken: {
    address: string;
    symbol?: string | null;
    name?: string | null;
    balance: {
      amount: string;
      display: string;
    };
    native: {
      amount: string;
      display: string;
    };
  };
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  transactionHash: string;
  type: TransactionTypes.PREPAID_CARD_CREATED;
}

export interface MerchantCreationTransactionType {
  address: string;
  createdAt: string;
  infoDid?: string | null;
  transactionHash: string;
  type: TransactionTypes.MERCHANT_CREATION;
}

export interface PrepaidCardPaymentTransactionType {
  address: string;
  timestamp: number;
  spendAmount: string;
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  type: TransactionTypes.PREPAID_CARD_PAYMENT;
  transactionHash: string;
}

export interface PrepaidCardSplitTransactionType {
  address: string;
  timestamp: number;
  spendAmount: string;
  spendBalanceDisplay: string;
  transactionHash: string;
  prepaidCardCount: number;
  type: TransactionTypes.PREPAID_CARD_SPLIT;
}

export interface PrepaidCardTransferTransactionType {
  address: string;
  timestamp: number;
  spendAmount: string;
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  transactionHash: string;
  type: TransactionTypes.PREPAID_CARD_TRANSFER;
}

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

export interface ERC20TransactionType {
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
  symbol: string;
  swappedFor?: any;
  type: TransactionTypes.ERC_20;
}

export type TransactionType =
  | ERC20TransactionType
  | DepotBridgedLayer1TransactionType
  | DepotBridgedLayer2TransactionType
  | PrepaidCardCreatedTransactionType
  | MerchantCreationTransactionType
  | PrepaidCardPaymentTransactionType
  | PrepaidCardTransferTransactionType
  | PrepaidCardSplitTransactionType;
