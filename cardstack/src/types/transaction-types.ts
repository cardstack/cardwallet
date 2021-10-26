import { BalanceType } from './AssetType';

export enum TransactionTypes {
  DEPOT_BRIDGED_LAYER_1 = 'depotBridgedLayer1',
  DEPOT_BRIDGED_LAYER_2 = 'depotBridgedLayer2',
  PREPAID_CARD_CREATED = 'prepaidCardCreated',
  PREPAID_CARD_PAYMENT = 'prepaidCardPayment',
  PREPAID_CARD_SPLIT = 'prepaidCardSplit',
  PREPAID_CARD_TRANSFER = 'prepaidCardTransfer',
  MERCHANT_CLAIM = 'merchantClaim',
  MERCHANT_CREATION = 'merchantCreation',
  MERCHANT_REVENUE_EVENT = 'merchantRevenueEvent',
  MERCHANT_EARNED_SPEND_AND_REVENUE = 'merchantEarnedSpendAndRevenue',
  MERCHANT_EARNED_REVENUE = 'merchantEarnedRevenue',
  MERCHANT_EARNED_SPEND = 'merchantEarnedSpend',
  ERC_20 = 'erc20',
}

export interface DepotBridgedLayer2TransactionType {
  balance: BalanceType;
  native: BalanceType;
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
  balance: BalanceType;
  native: BalanceType;
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

export interface MerchantInformation {
  did: string;
  name: string;
  slug: string;
  color: string;
  textColor: string;
  ownerAddress: string;
}

export interface PrepaidCardCreatedTransactionType {
  address: string;
  cardCustomization?: PrepaidCardCustomization;
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
  infoDid?: string;
  transactionHash: string;
  type: TransactionTypes.MERCHANT_CREATION;
}

export interface MerchantRevenueEventType {
  address: string;
  createdAt: string;
  infoDid?: string | null;
  transactionHash: string;
  type: TransactionTypes.MERCHANT_REVENUE_EVENT;
}

export interface MerchantClaimTypeTxn {
  grossClaimed?: string;
  gasFee?: string;
  gasUsdFee?: string;
  netClaimed?: string;
}

export interface MerchantClaimType {
  address: string;
  createdAt: string;
  transactionHash: string;
  balance: BalanceType;
  native: BalanceType;
  token: {
    address: string;
    name?: string | null;
    symbol?: string | null;
  };
  hideSafeHeader?: boolean;
  type: TransactionTypes.MERCHANT_CLAIM;
  transaction: MerchantClaimTypeTxn;
  infoDid?: string;
}

export interface PrepaidCardPaymentTransactionType {
  address: string;
  cardCustomization?: PrepaidCardCustomization;
  timestamp: number;
  spendAmount: string;
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  type: TransactionTypes.PREPAID_CARD_PAYMENT;
  transactionHash: string;
  merchantInfo?: MerchantInformation;
}

export interface MerchantEarnedRevenueTransactionTypeTxn {
  customerSpend: any;
  customerSpendUsd: string;
  protocolFee: string;
  revenueCollected: string;
  spendConversionRate: string;
  netEarned: string;
  netEarnedNative: string;
}

export interface MerchantEarnedRevenueTransactionType {
  address: string;
  balance: BalanceType;
  native: BalanceType;
  token: {
    address: string;
    name?: string | null;
    symbol?: string | null;
  };
  timestamp: number;
  type: TransactionTypes.MERCHANT_EARNED_REVENUE;
  transactionHash: string;
  transaction: MerchantEarnedRevenueTransactionTypeTxn;
  infoDid?: string;
}

export interface MerchantEarnedSpendTransactionType {
  address: string;
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  timestamp: number;
  type: TransactionTypes.MERCHANT_EARNED_SPEND;
  transactionHash: string;
  infoDid?: string;
}

export interface MerchantEarnedSpendAndRevenueTransactionType {
  address: string;
  balance: BalanceType;
  native: BalanceType;
  token: {
    address: string;
    name?: string | null;
    symbol?: string | null;
  };
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  timestamp: number;
  type: TransactionTypes.MERCHANT_EARNED_SPEND_AND_REVENUE;
  transactionHash: string;
  infoDid?: string;
}

export interface PrepaidCardSplitTransactionType {
  address: string;
  cardCustomization?: PrepaidCardCustomization;
  timestamp: number;
  spendAmount: string;
  spendBalanceDisplay: string;
  transactionHash: string;
  prepaidCardCount: number;
  type: TransactionTypes.PREPAID_CARD_SPLIT;
}

export interface PrepaidCardTransferTransactionType {
  address: string;
  cardCustomization?: PrepaidCardCustomization;
  timestamp: number;
  spendBalanceDisplay: string;
  nativeBalanceDisplay: string;
  transactionHash: string;
  statusText: string;
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
  balance: BalanceType;
  hash: string;
  minedAt: number;
  native: BalanceType;
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
  | PrepaidCardSplitTransactionType
  | MerchantRevenueEventType
  | MerchantClaimType
  | MerchantEarnedSpendAndRevenueTransactionType
  | MerchantEarnedRevenueTransactionType
  | MerchantEarnedSpendTransactionType;
