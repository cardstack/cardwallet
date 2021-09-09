import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};




export type Account = {
  __typename?: 'Account';
  id: Scalars['ID'];
  safes: Array<Maybe<SafeOwner>>;
  depots: Array<Maybe<Depot>>;
  sentBridgedTokens: Array<Maybe<BridgeToLayer1Event>>;
  receivedBridgedTokens: Array<Maybe<BridgeToLayer2Event>>;
  supplierInfoDIDUpdates: Array<Maybe<SupplierInfoDidUpdate>>;
  createdPrepaidCards: Array<Maybe<PrepaidCardCreation>>;
  splitPrepaidCards: Array<Maybe<PrepaidCardSplit>>;
  createdMerchants: Array<Maybe<MerchantCreation>>;
  receivedPrepaidCards: Array<Maybe<PrepaidCardTransfer>>;
  sentPrepaidCards: Array<Maybe<PrepaidCardTransfer>>;
  tokenSwaps: Array<Maybe<TokenSwap>>;
  tokens: Array<Maybe<TokenHolder>>;
  transactions: Array<Maybe<EoaTransaction>>;
};


export type AccountSafesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeOwnerOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeOwnerFilter>;
};


export type AccountDepotsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DepotOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DepotFilter>;
};


export type AccountSentBridgedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer1EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer1EventFilter>;
};


export type AccountReceivedBridgedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer2EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer2EventFilter>;
};


export type AccountSupplierInfoDidUpdatesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SupplierInfoDidUpdateOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SupplierInfoDidUpdateFilter>;
};


export type AccountCreatedPrepaidCardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardCreationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardCreationFilter>;
};


export type AccountSplitPrepaidCardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardSplitOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardSplitFilter>;
};


export type AccountCreatedMerchantsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantCreationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantCreationFilter>;
};


export type AccountReceivedPrepaidCardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardTransferFilter>;
};


export type AccountSentPrepaidCardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardTransferFilter>;
};


export type AccountTokenSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenSwapOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenSwapFilter>;
};


export type AccountTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHolderOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHolderFilter>;
};


export type AccountTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EoaTransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<EoaTransactionFilter>;
};

export type AccountFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
};

export enum AccountOrderBy {
  ID = 'id',
  SAFES = 'safes',
  DEPOTS = 'depots',
  SENTBRIDGEDTOKENS = 'sentBridgedTokens',
  RECEIVEDBRIDGEDTOKENS = 'receivedBridgedTokens',
  SUPPLIERINFODIDUPDATES = 'supplierInfoDIDUpdates',
  CREATEDPREPAIDCARDS = 'createdPrepaidCards',
  SPLITPREPAIDCARDS = 'splitPrepaidCards',
  CREATEDMERCHANTS = 'createdMerchants',
  RECEIVEDPREPAIDCARDS = 'receivedPrepaidCards',
  SENTPREPAIDCARDS = 'sentPrepaidCards',
  TOKENSWAPS = 'tokenSwaps',
  TOKENS = 'tokens',
  TRANSACTIONS = 'transactions'
}



export type BlockHeight = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};

export type BridgeToLayer1Event = {
  __typename?: 'BridgeToLayer1Event';
  id: Scalars['ID'];
  transaction: Transaction;
  safe?: Maybe<Safe>;
  timestamp: Scalars['BigInt'];
  account: Account;
  token: Token;
  amount: Scalars['BigInt'];
};

export type BridgeToLayer1EventFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  safe?: Maybe<Scalars['String']>;
  safe_not?: Maybe<Scalars['String']>;
  safe_gt?: Maybe<Scalars['String']>;
  safe_lt?: Maybe<Scalars['String']>;
  safe_gte?: Maybe<Scalars['String']>;
  safe_lte?: Maybe<Scalars['String']>;
  safe_in?: Maybe<Array<Scalars['String']>>;
  safe_not_in?: Maybe<Array<Scalars['String']>>;
  safe_contains?: Maybe<Scalars['String']>;
  safe_not_contains?: Maybe<Scalars['String']>;
  safe_starts_with?: Maybe<Scalars['String']>;
  safe_not_starts_with?: Maybe<Scalars['String']>;
  safe_ends_with?: Maybe<Scalars['String']>;
  safe_not_ends_with?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum BridgeToLayer1EventOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  SAFE = 'safe',
  TIMESTAMP = 'timestamp',
  ACCOUNT = 'account',
  TOKEN = 'token',
  AMOUNT = 'amount'
}

export type BridgeToLayer2Event = {
  __typename?: 'BridgeToLayer2Event';
  id: Scalars['ID'];
  transaction: Transaction;
  depot: Depot;
  timestamp: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  supplier: Account;
  token: Token;
  amount: Scalars['BigInt'];
};

export type BridgeToLayer2EventFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  depot?: Maybe<Scalars['String']>;
  depot_not?: Maybe<Scalars['String']>;
  depot_gt?: Maybe<Scalars['String']>;
  depot_lt?: Maybe<Scalars['String']>;
  depot_gte?: Maybe<Scalars['String']>;
  depot_lte?: Maybe<Scalars['String']>;
  depot_in?: Maybe<Array<Scalars['String']>>;
  depot_not_in?: Maybe<Array<Scalars['String']>>;
  depot_contains?: Maybe<Scalars['String']>;
  depot_not_contains?: Maybe<Scalars['String']>;
  depot_starts_with?: Maybe<Scalars['String']>;
  depot_not_starts_with?: Maybe<Scalars['String']>;
  depot_ends_with?: Maybe<Scalars['String']>;
  depot_not_ends_with?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  supplier?: Maybe<Scalars['String']>;
  supplier_not?: Maybe<Scalars['String']>;
  supplier_gt?: Maybe<Scalars['String']>;
  supplier_lt?: Maybe<Scalars['String']>;
  supplier_gte?: Maybe<Scalars['String']>;
  supplier_lte?: Maybe<Scalars['String']>;
  supplier_in?: Maybe<Array<Scalars['String']>>;
  supplier_not_in?: Maybe<Array<Scalars['String']>>;
  supplier_contains?: Maybe<Scalars['String']>;
  supplier_not_contains?: Maybe<Scalars['String']>;
  supplier_starts_with?: Maybe<Scalars['String']>;
  supplier_not_starts_with?: Maybe<Scalars['String']>;
  supplier_ends_with?: Maybe<Scalars['String']>;
  supplier_not_ends_with?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum BridgeToLayer2EventOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  DEPOT = 'depot',
  TIMESTAMP = 'timestamp',
  BLOCKNUMBER = 'blockNumber',
  SUPPLIER = 'supplier',
  TOKEN = 'token',
  AMOUNT = 'amount'
}


export type Depot = {
  __typename?: 'Depot';
  id: Scalars['ID'];
  safe: Safe;
  createdAt: Scalars['BigInt'];
  supplier: Account;
  infoDid?: Maybe<Scalars['String']>;
  receivedBridgedTokens: Array<Maybe<BridgeToLayer2Event>>;
};


export type DepotReceivedBridgedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer2EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer2EventFilter>;
};

export type DepotFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  safe?: Maybe<Scalars['String']>;
  safe_not?: Maybe<Scalars['String']>;
  safe_gt?: Maybe<Scalars['String']>;
  safe_lt?: Maybe<Scalars['String']>;
  safe_gte?: Maybe<Scalars['String']>;
  safe_lte?: Maybe<Scalars['String']>;
  safe_in?: Maybe<Array<Scalars['String']>>;
  safe_not_in?: Maybe<Array<Scalars['String']>>;
  safe_contains?: Maybe<Scalars['String']>;
  safe_not_contains?: Maybe<Scalars['String']>;
  safe_starts_with?: Maybe<Scalars['String']>;
  safe_not_starts_with?: Maybe<Scalars['String']>;
  safe_ends_with?: Maybe<Scalars['String']>;
  safe_not_ends_with?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  supplier?: Maybe<Scalars['String']>;
  supplier_not?: Maybe<Scalars['String']>;
  supplier_gt?: Maybe<Scalars['String']>;
  supplier_lt?: Maybe<Scalars['String']>;
  supplier_gte?: Maybe<Scalars['String']>;
  supplier_lte?: Maybe<Scalars['String']>;
  supplier_in?: Maybe<Array<Scalars['String']>>;
  supplier_not_in?: Maybe<Array<Scalars['String']>>;
  supplier_contains?: Maybe<Scalars['String']>;
  supplier_not_contains?: Maybe<Scalars['String']>;
  supplier_starts_with?: Maybe<Scalars['String']>;
  supplier_not_starts_with?: Maybe<Scalars['String']>;
  supplier_ends_with?: Maybe<Scalars['String']>;
  supplier_not_ends_with?: Maybe<Scalars['String']>;
  infoDid?: Maybe<Scalars['String']>;
  infoDid_not?: Maybe<Scalars['String']>;
  infoDid_gt?: Maybe<Scalars['String']>;
  infoDid_lt?: Maybe<Scalars['String']>;
  infoDid_gte?: Maybe<Scalars['String']>;
  infoDid_lte?: Maybe<Scalars['String']>;
  infoDid_in?: Maybe<Array<Scalars['String']>>;
  infoDid_not_in?: Maybe<Array<Scalars['String']>>;
  infoDid_contains?: Maybe<Scalars['String']>;
  infoDid_not_contains?: Maybe<Scalars['String']>;
  infoDid_starts_with?: Maybe<Scalars['String']>;
  infoDid_not_starts_with?: Maybe<Scalars['String']>;
  infoDid_ends_with?: Maybe<Scalars['String']>;
  infoDid_not_ends_with?: Maybe<Scalars['String']>;
};

export enum DepotOrderBy {
  ID = 'id',
  SAFE = 'safe',
  CREATEDAT = 'createdAt',
  SUPPLIER = 'supplier',
  INFODID = 'infoDid',
  RECEIVEDBRIDGEDTOKENS = 'receivedBridgedTokens'
}

export type EoaTransaction = {
  __typename?: 'EOATransaction';
  id: Scalars['ID'];
  account: Account;
  timestamp: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  transaction: Transaction;
};

export type EoaTransactionFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
};

export enum EoaTransactionOrderBy {
  ID = 'id',
  ACCOUNT = 'account',
  TIMESTAMP = 'timestamp',
  BLOCKNUMBER = 'blockNumber',
  TRANSACTION = 'transaction'
}

export type MerchantClaim = {
  __typename?: 'MerchantClaim';
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  merchantSafe: MerchantSafe;
  token: Token;
  amount: Scalars['BigInt'];
};

export type MerchantClaimFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  merchantSafe?: Maybe<Scalars['String']>;
  merchantSafe_not?: Maybe<Scalars['String']>;
  merchantSafe_gt?: Maybe<Scalars['String']>;
  merchantSafe_lt?: Maybe<Scalars['String']>;
  merchantSafe_gte?: Maybe<Scalars['String']>;
  merchantSafe_lte?: Maybe<Scalars['String']>;
  merchantSafe_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_not_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_contains?: Maybe<Scalars['String']>;
  merchantSafe_not_contains?: Maybe<Scalars['String']>;
  merchantSafe_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_not_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_ends_with?: Maybe<Scalars['String']>;
  merchantSafe_not_ends_with?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum MerchantClaimOrderBy {
  ID = 'id',
  TIMESTAMP = 'timestamp',
  TRANSACTION = 'transaction',
  MERCHANTSAFE = 'merchantSafe',
  TOKEN = 'token',
  AMOUNT = 'amount'
}

export type MerchantCreation = {
  __typename?: 'MerchantCreation';
  id: Scalars['ID'];
  transaction: Transaction;
  createdAt: Scalars['BigInt'];
  merchantSafe: MerchantSafe;
  merchant: Account;
};

export type MerchantCreationFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  merchantSafe?: Maybe<Scalars['String']>;
  merchantSafe_not?: Maybe<Scalars['String']>;
  merchantSafe_gt?: Maybe<Scalars['String']>;
  merchantSafe_lt?: Maybe<Scalars['String']>;
  merchantSafe_gte?: Maybe<Scalars['String']>;
  merchantSafe_lte?: Maybe<Scalars['String']>;
  merchantSafe_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_not_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_contains?: Maybe<Scalars['String']>;
  merchantSafe_not_contains?: Maybe<Scalars['String']>;
  merchantSafe_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_not_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_ends_with?: Maybe<Scalars['String']>;
  merchantSafe_not_ends_with?: Maybe<Scalars['String']>;
  merchant?: Maybe<Scalars['String']>;
  merchant_not?: Maybe<Scalars['String']>;
  merchant_gt?: Maybe<Scalars['String']>;
  merchant_lt?: Maybe<Scalars['String']>;
  merchant_gte?: Maybe<Scalars['String']>;
  merchant_lte?: Maybe<Scalars['String']>;
  merchant_in?: Maybe<Array<Scalars['String']>>;
  merchant_not_in?: Maybe<Array<Scalars['String']>>;
  merchant_contains?: Maybe<Scalars['String']>;
  merchant_not_contains?: Maybe<Scalars['String']>;
  merchant_starts_with?: Maybe<Scalars['String']>;
  merchant_not_starts_with?: Maybe<Scalars['String']>;
  merchant_ends_with?: Maybe<Scalars['String']>;
  merchant_not_ends_with?: Maybe<Scalars['String']>;
};

export enum MerchantCreationOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  CREATEDAT = 'createdAt',
  MERCHANTSAFE = 'merchantSafe',
  MERCHANT = 'merchant'
}

export type MerchantFeePayment = {
  __typename?: 'MerchantFeePayment';
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  prepaidCard: PrepaidCard;
  merchantSafe: MerchantSafe;
  issuingToken: Token;
  feeCollected: Scalars['BigInt'];
};

export type MerchantFeePaymentFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  prepaidCard?: Maybe<Scalars['String']>;
  prepaidCard_not?: Maybe<Scalars['String']>;
  prepaidCard_gt?: Maybe<Scalars['String']>;
  prepaidCard_lt?: Maybe<Scalars['String']>;
  prepaidCard_gte?: Maybe<Scalars['String']>;
  prepaidCard_lte?: Maybe<Scalars['String']>;
  prepaidCard_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_not_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_contains?: Maybe<Scalars['String']>;
  prepaidCard_not_contains?: Maybe<Scalars['String']>;
  prepaidCard_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_not_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_ends_with?: Maybe<Scalars['String']>;
  prepaidCard_not_ends_with?: Maybe<Scalars['String']>;
  merchantSafe?: Maybe<Scalars['String']>;
  merchantSafe_not?: Maybe<Scalars['String']>;
  merchantSafe_gt?: Maybe<Scalars['String']>;
  merchantSafe_lt?: Maybe<Scalars['String']>;
  merchantSafe_gte?: Maybe<Scalars['String']>;
  merchantSafe_lte?: Maybe<Scalars['String']>;
  merchantSafe_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_not_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_contains?: Maybe<Scalars['String']>;
  merchantSafe_not_contains?: Maybe<Scalars['String']>;
  merchantSafe_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_not_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_ends_with?: Maybe<Scalars['String']>;
  merchantSafe_not_ends_with?: Maybe<Scalars['String']>;
  issuingToken?: Maybe<Scalars['String']>;
  issuingToken_not?: Maybe<Scalars['String']>;
  issuingToken_gt?: Maybe<Scalars['String']>;
  issuingToken_lt?: Maybe<Scalars['String']>;
  issuingToken_gte?: Maybe<Scalars['String']>;
  issuingToken_lte?: Maybe<Scalars['String']>;
  issuingToken_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_not_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_contains?: Maybe<Scalars['String']>;
  issuingToken_not_contains?: Maybe<Scalars['String']>;
  issuingToken_starts_with?: Maybe<Scalars['String']>;
  issuingToken_not_starts_with?: Maybe<Scalars['String']>;
  issuingToken_ends_with?: Maybe<Scalars['String']>;
  issuingToken_not_ends_with?: Maybe<Scalars['String']>;
  feeCollected?: Maybe<Scalars['BigInt']>;
  feeCollected_not?: Maybe<Scalars['BigInt']>;
  feeCollected_gt?: Maybe<Scalars['BigInt']>;
  feeCollected_lt?: Maybe<Scalars['BigInt']>;
  feeCollected_gte?: Maybe<Scalars['BigInt']>;
  feeCollected_lte?: Maybe<Scalars['BigInt']>;
  feeCollected_in?: Maybe<Array<Scalars['BigInt']>>;
  feeCollected_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum MerchantFeePaymentOrderBy {
  ID = 'id',
  TIMESTAMP = 'timestamp',
  TRANSACTION = 'transaction',
  PREPAIDCARD = 'prepaidCard',
  MERCHANTSAFE = 'merchantSafe',
  ISSUINGTOKEN = 'issuingToken',
  FEECOLLECTED = 'feeCollected'
}

export type MerchantRegistrationPayment = {
  __typename?: 'MerchantRegistrationPayment';
  id: Scalars['ID'];
  transaction: Transaction;
  createdAt: Scalars['BigInt'];
  paidWith: PrepaidCard;
  prepaidCardPayment: PrepaidCardPayment;
  issuingToken: Token;
  issuingTokenAmount: Scalars['BigInt'];
  spendAmount: Scalars['BigInt'];
};

export type MerchantRegistrationPaymentFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  paidWith?: Maybe<Scalars['String']>;
  paidWith_not?: Maybe<Scalars['String']>;
  paidWith_gt?: Maybe<Scalars['String']>;
  paidWith_lt?: Maybe<Scalars['String']>;
  paidWith_gte?: Maybe<Scalars['String']>;
  paidWith_lte?: Maybe<Scalars['String']>;
  paidWith_in?: Maybe<Array<Scalars['String']>>;
  paidWith_not_in?: Maybe<Array<Scalars['String']>>;
  paidWith_contains?: Maybe<Scalars['String']>;
  paidWith_not_contains?: Maybe<Scalars['String']>;
  paidWith_starts_with?: Maybe<Scalars['String']>;
  paidWith_not_starts_with?: Maybe<Scalars['String']>;
  paidWith_ends_with?: Maybe<Scalars['String']>;
  paidWith_not_ends_with?: Maybe<Scalars['String']>;
  prepaidCardPayment?: Maybe<Scalars['String']>;
  prepaidCardPayment_not?: Maybe<Scalars['String']>;
  prepaidCardPayment_gt?: Maybe<Scalars['String']>;
  prepaidCardPayment_lt?: Maybe<Scalars['String']>;
  prepaidCardPayment_gte?: Maybe<Scalars['String']>;
  prepaidCardPayment_lte?: Maybe<Scalars['String']>;
  prepaidCardPayment_in?: Maybe<Array<Scalars['String']>>;
  prepaidCardPayment_not_in?: Maybe<Array<Scalars['String']>>;
  prepaidCardPayment_contains?: Maybe<Scalars['String']>;
  prepaidCardPayment_not_contains?: Maybe<Scalars['String']>;
  prepaidCardPayment_starts_with?: Maybe<Scalars['String']>;
  prepaidCardPayment_not_starts_with?: Maybe<Scalars['String']>;
  prepaidCardPayment_ends_with?: Maybe<Scalars['String']>;
  prepaidCardPayment_not_ends_with?: Maybe<Scalars['String']>;
  issuingToken?: Maybe<Scalars['String']>;
  issuingToken_not?: Maybe<Scalars['String']>;
  issuingToken_gt?: Maybe<Scalars['String']>;
  issuingToken_lt?: Maybe<Scalars['String']>;
  issuingToken_gte?: Maybe<Scalars['String']>;
  issuingToken_lte?: Maybe<Scalars['String']>;
  issuingToken_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_not_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_contains?: Maybe<Scalars['String']>;
  issuingToken_not_contains?: Maybe<Scalars['String']>;
  issuingToken_starts_with?: Maybe<Scalars['String']>;
  issuingToken_not_starts_with?: Maybe<Scalars['String']>;
  issuingToken_ends_with?: Maybe<Scalars['String']>;
  issuingToken_not_ends_with?: Maybe<Scalars['String']>;
  issuingTokenAmount?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_not?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_gt?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_lt?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_gte?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_lte?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  spendAmount?: Maybe<Scalars['BigInt']>;
  spendAmount_not?: Maybe<Scalars['BigInt']>;
  spendAmount_gt?: Maybe<Scalars['BigInt']>;
  spendAmount_lt?: Maybe<Scalars['BigInt']>;
  spendAmount_gte?: Maybe<Scalars['BigInt']>;
  spendAmount_lte?: Maybe<Scalars['BigInt']>;
  spendAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  spendAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum MerchantRegistrationPaymentOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  CREATEDAT = 'createdAt',
  PAIDWITH = 'paidWith',
  PREPAIDCARDPAYMENT = 'prepaidCardPayment',
  ISSUINGTOKEN = 'issuingToken',
  ISSUINGTOKENAMOUNT = 'issuingTokenAmount',
  SPENDAMOUNT = 'spendAmount'
}

export type MerchantRevenue = {
  __typename?: 'MerchantRevenue';
  id: Scalars['ID'];
  token: Token;
  merchantSafe: MerchantSafe;
  lifetimeAccumulation: Scalars['BigInt'];
  unclaimedBalance: Scalars['BigInt'];
  revenueEvents: Array<Maybe<MerchantRevenueEvent>>;
  earningsByDay: Array<Maybe<RevenueEarningsByDay>>;
};


export type MerchantRevenueRevenueEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRevenueEventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRevenueEventFilter>;
};


export type MerchantRevenueEarningsByDayArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RevenueEarningsByDayOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RevenueEarningsByDayFilter>;
};

export type MerchantRevenueEvent = {
  __typename?: 'MerchantRevenueEvent';
  id: Scalars['ID'];
  transaction: Transaction;
  timestamp: Scalars['BigInt'];
  historicLifetimeAccumulation: Scalars['BigInt'];
  historicUnclaimedBalance: Scalars['BigInt'];
  merchantRevenue: MerchantRevenue;
  prepaidCardPayment?: Maybe<PrepaidCardPayment>;
  merchantClaim?: Maybe<MerchantClaim>;
};

export type MerchantRevenueEventFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  historicLifetimeAccumulation?: Maybe<Scalars['BigInt']>;
  historicLifetimeAccumulation_not?: Maybe<Scalars['BigInt']>;
  historicLifetimeAccumulation_gt?: Maybe<Scalars['BigInt']>;
  historicLifetimeAccumulation_lt?: Maybe<Scalars['BigInt']>;
  historicLifetimeAccumulation_gte?: Maybe<Scalars['BigInt']>;
  historicLifetimeAccumulation_lte?: Maybe<Scalars['BigInt']>;
  historicLifetimeAccumulation_in?: Maybe<Array<Scalars['BigInt']>>;
  historicLifetimeAccumulation_not_in?: Maybe<Array<Scalars['BigInt']>>;
  historicUnclaimedBalance?: Maybe<Scalars['BigInt']>;
  historicUnclaimedBalance_not?: Maybe<Scalars['BigInt']>;
  historicUnclaimedBalance_gt?: Maybe<Scalars['BigInt']>;
  historicUnclaimedBalance_lt?: Maybe<Scalars['BigInt']>;
  historicUnclaimedBalance_gte?: Maybe<Scalars['BigInt']>;
  historicUnclaimedBalance_lte?: Maybe<Scalars['BigInt']>;
  historicUnclaimedBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  historicUnclaimedBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  merchantRevenue?: Maybe<Scalars['String']>;
  merchantRevenue_not?: Maybe<Scalars['String']>;
  merchantRevenue_gt?: Maybe<Scalars['String']>;
  merchantRevenue_lt?: Maybe<Scalars['String']>;
  merchantRevenue_gte?: Maybe<Scalars['String']>;
  merchantRevenue_lte?: Maybe<Scalars['String']>;
  merchantRevenue_in?: Maybe<Array<Scalars['String']>>;
  merchantRevenue_not_in?: Maybe<Array<Scalars['String']>>;
  merchantRevenue_contains?: Maybe<Scalars['String']>;
  merchantRevenue_not_contains?: Maybe<Scalars['String']>;
  merchantRevenue_starts_with?: Maybe<Scalars['String']>;
  merchantRevenue_not_starts_with?: Maybe<Scalars['String']>;
  merchantRevenue_ends_with?: Maybe<Scalars['String']>;
  merchantRevenue_not_ends_with?: Maybe<Scalars['String']>;
  prepaidCardPayment?: Maybe<Scalars['String']>;
  prepaidCardPayment_not?: Maybe<Scalars['String']>;
  prepaidCardPayment_gt?: Maybe<Scalars['String']>;
  prepaidCardPayment_lt?: Maybe<Scalars['String']>;
  prepaidCardPayment_gte?: Maybe<Scalars['String']>;
  prepaidCardPayment_lte?: Maybe<Scalars['String']>;
  prepaidCardPayment_in?: Maybe<Array<Scalars['String']>>;
  prepaidCardPayment_not_in?: Maybe<Array<Scalars['String']>>;
  prepaidCardPayment_contains?: Maybe<Scalars['String']>;
  prepaidCardPayment_not_contains?: Maybe<Scalars['String']>;
  prepaidCardPayment_starts_with?: Maybe<Scalars['String']>;
  prepaidCardPayment_not_starts_with?: Maybe<Scalars['String']>;
  prepaidCardPayment_ends_with?: Maybe<Scalars['String']>;
  prepaidCardPayment_not_ends_with?: Maybe<Scalars['String']>;
  merchantClaim?: Maybe<Scalars['String']>;
  merchantClaim_not?: Maybe<Scalars['String']>;
  merchantClaim_gt?: Maybe<Scalars['String']>;
  merchantClaim_lt?: Maybe<Scalars['String']>;
  merchantClaim_gte?: Maybe<Scalars['String']>;
  merchantClaim_lte?: Maybe<Scalars['String']>;
  merchantClaim_in?: Maybe<Array<Scalars['String']>>;
  merchantClaim_not_in?: Maybe<Array<Scalars['String']>>;
  merchantClaim_contains?: Maybe<Scalars['String']>;
  merchantClaim_not_contains?: Maybe<Scalars['String']>;
  merchantClaim_starts_with?: Maybe<Scalars['String']>;
  merchantClaim_not_starts_with?: Maybe<Scalars['String']>;
  merchantClaim_ends_with?: Maybe<Scalars['String']>;
  merchantClaim_not_ends_with?: Maybe<Scalars['String']>;
};

export enum MerchantRevenueEventOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  TIMESTAMP = 'timestamp',
  HISTORICLIFETIMEACCUMULATION = 'historicLifetimeAccumulation',
  HISTORICUNCLAIMEDBALANCE = 'historicUnclaimedBalance',
  MERCHANTREVENUE = 'merchantRevenue',
  PREPAIDCARDPAYMENT = 'prepaidCardPayment',
  MERCHANTCLAIM = 'merchantClaim'
}

export type MerchantRevenueFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  merchantSafe?: Maybe<Scalars['String']>;
  merchantSafe_not?: Maybe<Scalars['String']>;
  merchantSafe_gt?: Maybe<Scalars['String']>;
  merchantSafe_lt?: Maybe<Scalars['String']>;
  merchantSafe_gte?: Maybe<Scalars['String']>;
  merchantSafe_lte?: Maybe<Scalars['String']>;
  merchantSafe_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_not_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_contains?: Maybe<Scalars['String']>;
  merchantSafe_not_contains?: Maybe<Scalars['String']>;
  merchantSafe_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_not_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_ends_with?: Maybe<Scalars['String']>;
  merchantSafe_not_ends_with?: Maybe<Scalars['String']>;
  lifetimeAccumulation?: Maybe<Scalars['BigInt']>;
  lifetimeAccumulation_not?: Maybe<Scalars['BigInt']>;
  lifetimeAccumulation_gt?: Maybe<Scalars['BigInt']>;
  lifetimeAccumulation_lt?: Maybe<Scalars['BigInt']>;
  lifetimeAccumulation_gte?: Maybe<Scalars['BigInt']>;
  lifetimeAccumulation_lte?: Maybe<Scalars['BigInt']>;
  lifetimeAccumulation_in?: Maybe<Array<Scalars['BigInt']>>;
  lifetimeAccumulation_not_in?: Maybe<Array<Scalars['BigInt']>>;
  unclaimedBalance?: Maybe<Scalars['BigInt']>;
  unclaimedBalance_not?: Maybe<Scalars['BigInt']>;
  unclaimedBalance_gt?: Maybe<Scalars['BigInt']>;
  unclaimedBalance_lt?: Maybe<Scalars['BigInt']>;
  unclaimedBalance_gte?: Maybe<Scalars['BigInt']>;
  unclaimedBalance_lte?: Maybe<Scalars['BigInt']>;
  unclaimedBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  unclaimedBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum MerchantRevenueOrderBy {
  ID = 'id',
  TOKEN = 'token',
  MERCHANTSAFE = 'merchantSafe',
  LIFETIMEACCUMULATION = 'lifetimeAccumulation',
  UNCLAIMEDBALANCE = 'unclaimedBalance',
  REVENUEEVENTS = 'revenueEvents',
  EARNINGSBYDAY = 'earningsByDay'
}

export type MerchantSafe = {
  __typename?: 'MerchantSafe';
  id: Scalars['ID'];
  safe: Safe;
  merchant: Account;
  spendBalance: Scalars['BigInt'];
  infoDid?: Maybe<Scalars['String']>;
  creation?: Maybe<MerchantCreation>;
  spendAccumulations: Array<Maybe<SpendAccumulation>>;
  receivedPayments: Array<Maybe<PrepaidCardPayment>>;
  merchantFees: Array<Maybe<MerchantFeePayment>>;
  merchantRevenue: Array<Maybe<MerchantRevenue>>;
};


export type MerchantSafeSpendAccumulationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SpendAccumulationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SpendAccumulationFilter>;
};


export type MerchantSafeReceivedPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardPaymentFilter>;
};


export type MerchantSafeMerchantFeesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantFeePaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantFeePaymentFilter>;
};


export type MerchantSafeMerchantRevenueArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRevenueOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRevenueFilter>;
};

export type MerchantSafeFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  safe?: Maybe<Scalars['String']>;
  safe_not?: Maybe<Scalars['String']>;
  safe_gt?: Maybe<Scalars['String']>;
  safe_lt?: Maybe<Scalars['String']>;
  safe_gte?: Maybe<Scalars['String']>;
  safe_lte?: Maybe<Scalars['String']>;
  safe_in?: Maybe<Array<Scalars['String']>>;
  safe_not_in?: Maybe<Array<Scalars['String']>>;
  safe_contains?: Maybe<Scalars['String']>;
  safe_not_contains?: Maybe<Scalars['String']>;
  safe_starts_with?: Maybe<Scalars['String']>;
  safe_not_starts_with?: Maybe<Scalars['String']>;
  safe_ends_with?: Maybe<Scalars['String']>;
  safe_not_ends_with?: Maybe<Scalars['String']>;
  merchant?: Maybe<Scalars['String']>;
  merchant_not?: Maybe<Scalars['String']>;
  merchant_gt?: Maybe<Scalars['String']>;
  merchant_lt?: Maybe<Scalars['String']>;
  merchant_gte?: Maybe<Scalars['String']>;
  merchant_lte?: Maybe<Scalars['String']>;
  merchant_in?: Maybe<Array<Scalars['String']>>;
  merchant_not_in?: Maybe<Array<Scalars['String']>>;
  merchant_contains?: Maybe<Scalars['String']>;
  merchant_not_contains?: Maybe<Scalars['String']>;
  merchant_starts_with?: Maybe<Scalars['String']>;
  merchant_not_starts_with?: Maybe<Scalars['String']>;
  merchant_ends_with?: Maybe<Scalars['String']>;
  merchant_not_ends_with?: Maybe<Scalars['String']>;
  spendBalance?: Maybe<Scalars['BigInt']>;
  spendBalance_not?: Maybe<Scalars['BigInt']>;
  spendBalance_gt?: Maybe<Scalars['BigInt']>;
  spendBalance_lt?: Maybe<Scalars['BigInt']>;
  spendBalance_gte?: Maybe<Scalars['BigInt']>;
  spendBalance_lte?: Maybe<Scalars['BigInt']>;
  spendBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  spendBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  infoDid?: Maybe<Scalars['String']>;
  infoDid_not?: Maybe<Scalars['String']>;
  infoDid_gt?: Maybe<Scalars['String']>;
  infoDid_lt?: Maybe<Scalars['String']>;
  infoDid_gte?: Maybe<Scalars['String']>;
  infoDid_lte?: Maybe<Scalars['String']>;
  infoDid_in?: Maybe<Array<Scalars['String']>>;
  infoDid_not_in?: Maybe<Array<Scalars['String']>>;
  infoDid_contains?: Maybe<Scalars['String']>;
  infoDid_not_contains?: Maybe<Scalars['String']>;
  infoDid_starts_with?: Maybe<Scalars['String']>;
  infoDid_not_starts_with?: Maybe<Scalars['String']>;
  infoDid_ends_with?: Maybe<Scalars['String']>;
  infoDid_not_ends_with?: Maybe<Scalars['String']>;
};

export enum MerchantSafeOrderBy {
  ID = 'id',
  SAFE = 'safe',
  MERCHANT = 'merchant',
  SPENDBALANCE = 'spendBalance',
  INFODID = 'infoDid',
  CREATION = 'creation',
  SPENDACCUMULATIONS = 'spendAccumulations',
  RECEIVEDPAYMENTS = 'receivedPayments',
  MERCHANTFEES = 'merchantFees',
  MERCHANTREVENUE = 'merchantRevenue'
}

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type PrepaidCard = {
  __typename?: 'PrepaidCard';
  id: Scalars['ID'];
  safe: Safe;
  customizationDID?: Maybe<Scalars['String']>;
  issuingToken: Token;
  issuer: Account;
  owner: Account;
  reloadable: Scalars['Boolean'];
  faceValue: Scalars['BigInt'];
  issuingTokenBalance: Scalars['BigInt'];
  creation?: Maybe<PrepaidCardCreation>;
  payments: Array<Maybe<PrepaidCardPayment>>;
  splits: Array<Maybe<PrepaidCardSplit>>;
  transfers: Array<Maybe<PrepaidCardTransfer>>;
};


export type PrepaidCardPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardPaymentFilter>;
};


export type PrepaidCardSplitsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardSplitOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardSplitFilter>;
};


export type PrepaidCardTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardTransferFilter>;
};

export type PrepaidCardCreation = {
  __typename?: 'PrepaidCardCreation';
  id: Scalars['ID'];
  transaction: Transaction;
  createdAt: Scalars['BigInt'];
  prepaidCard: PrepaidCard;
  depot?: Maybe<Depot>;
  createdFromAddress: Scalars['String'];
  issuer: Account;
  issuingToken: Token;
  issuingTokenAmount: Scalars['BigInt'];
  spendAmount: Scalars['BigInt'];
  creationGasFeeCollected: Scalars['BigInt'];
};

export type PrepaidCardCreationFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  prepaidCard?: Maybe<Scalars['String']>;
  prepaidCard_not?: Maybe<Scalars['String']>;
  prepaidCard_gt?: Maybe<Scalars['String']>;
  prepaidCard_lt?: Maybe<Scalars['String']>;
  prepaidCard_gte?: Maybe<Scalars['String']>;
  prepaidCard_lte?: Maybe<Scalars['String']>;
  prepaidCard_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_not_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_contains?: Maybe<Scalars['String']>;
  prepaidCard_not_contains?: Maybe<Scalars['String']>;
  prepaidCard_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_not_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_ends_with?: Maybe<Scalars['String']>;
  prepaidCard_not_ends_with?: Maybe<Scalars['String']>;
  depot?: Maybe<Scalars['String']>;
  depot_not?: Maybe<Scalars['String']>;
  depot_gt?: Maybe<Scalars['String']>;
  depot_lt?: Maybe<Scalars['String']>;
  depot_gte?: Maybe<Scalars['String']>;
  depot_lte?: Maybe<Scalars['String']>;
  depot_in?: Maybe<Array<Scalars['String']>>;
  depot_not_in?: Maybe<Array<Scalars['String']>>;
  depot_contains?: Maybe<Scalars['String']>;
  depot_not_contains?: Maybe<Scalars['String']>;
  depot_starts_with?: Maybe<Scalars['String']>;
  depot_not_starts_with?: Maybe<Scalars['String']>;
  depot_ends_with?: Maybe<Scalars['String']>;
  depot_not_ends_with?: Maybe<Scalars['String']>;
  createdFromAddress?: Maybe<Scalars['String']>;
  createdFromAddress_not?: Maybe<Scalars['String']>;
  createdFromAddress_gt?: Maybe<Scalars['String']>;
  createdFromAddress_lt?: Maybe<Scalars['String']>;
  createdFromAddress_gte?: Maybe<Scalars['String']>;
  createdFromAddress_lte?: Maybe<Scalars['String']>;
  createdFromAddress_in?: Maybe<Array<Scalars['String']>>;
  createdFromAddress_not_in?: Maybe<Array<Scalars['String']>>;
  createdFromAddress_contains?: Maybe<Scalars['String']>;
  createdFromAddress_not_contains?: Maybe<Scalars['String']>;
  createdFromAddress_starts_with?: Maybe<Scalars['String']>;
  createdFromAddress_not_starts_with?: Maybe<Scalars['String']>;
  createdFromAddress_ends_with?: Maybe<Scalars['String']>;
  createdFromAddress_not_ends_with?: Maybe<Scalars['String']>;
  issuer?: Maybe<Scalars['String']>;
  issuer_not?: Maybe<Scalars['String']>;
  issuer_gt?: Maybe<Scalars['String']>;
  issuer_lt?: Maybe<Scalars['String']>;
  issuer_gte?: Maybe<Scalars['String']>;
  issuer_lte?: Maybe<Scalars['String']>;
  issuer_in?: Maybe<Array<Scalars['String']>>;
  issuer_not_in?: Maybe<Array<Scalars['String']>>;
  issuer_contains?: Maybe<Scalars['String']>;
  issuer_not_contains?: Maybe<Scalars['String']>;
  issuer_starts_with?: Maybe<Scalars['String']>;
  issuer_not_starts_with?: Maybe<Scalars['String']>;
  issuer_ends_with?: Maybe<Scalars['String']>;
  issuer_not_ends_with?: Maybe<Scalars['String']>;
  issuingToken?: Maybe<Scalars['String']>;
  issuingToken_not?: Maybe<Scalars['String']>;
  issuingToken_gt?: Maybe<Scalars['String']>;
  issuingToken_lt?: Maybe<Scalars['String']>;
  issuingToken_gte?: Maybe<Scalars['String']>;
  issuingToken_lte?: Maybe<Scalars['String']>;
  issuingToken_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_not_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_contains?: Maybe<Scalars['String']>;
  issuingToken_not_contains?: Maybe<Scalars['String']>;
  issuingToken_starts_with?: Maybe<Scalars['String']>;
  issuingToken_not_starts_with?: Maybe<Scalars['String']>;
  issuingToken_ends_with?: Maybe<Scalars['String']>;
  issuingToken_not_ends_with?: Maybe<Scalars['String']>;
  issuingTokenAmount?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_not?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_gt?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_lt?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_gte?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_lte?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  spendAmount?: Maybe<Scalars['BigInt']>;
  spendAmount_not?: Maybe<Scalars['BigInt']>;
  spendAmount_gt?: Maybe<Scalars['BigInt']>;
  spendAmount_lt?: Maybe<Scalars['BigInt']>;
  spendAmount_gte?: Maybe<Scalars['BigInt']>;
  spendAmount_lte?: Maybe<Scalars['BigInt']>;
  spendAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  spendAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  creationGasFeeCollected?: Maybe<Scalars['BigInt']>;
  creationGasFeeCollected_not?: Maybe<Scalars['BigInt']>;
  creationGasFeeCollected_gt?: Maybe<Scalars['BigInt']>;
  creationGasFeeCollected_lt?: Maybe<Scalars['BigInt']>;
  creationGasFeeCollected_gte?: Maybe<Scalars['BigInt']>;
  creationGasFeeCollected_lte?: Maybe<Scalars['BigInt']>;
  creationGasFeeCollected_in?: Maybe<Array<Scalars['BigInt']>>;
  creationGasFeeCollected_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum PrepaidCardCreationOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  CREATEDAT = 'createdAt',
  PREPAIDCARD = 'prepaidCard',
  DEPOT = 'depot',
  CREATEDFROMADDRESS = 'createdFromAddress',
  ISSUER = 'issuer',
  ISSUINGTOKEN = 'issuingToken',
  ISSUINGTOKENAMOUNT = 'issuingTokenAmount',
  SPENDAMOUNT = 'spendAmount',
  CREATIONGASFEECOLLECTED = 'creationGasFeeCollected'
}

export type PrepaidCardPayment = {
  __typename?: 'PrepaidCardPayment';
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  prepaidCard: PrepaidCard;
  prepaidCardOwner: Account;
  merchantSafe?: Maybe<MerchantSafe>;
  merchant?: Maybe<Account>;
  issuingToken: Token;
  issuingTokenAmount: Scalars['BigInt'];
  spendAmount: Scalars['BigInt'];
  issuingTokenUSDPrice: Scalars['BigDecimal'];
  historicPrepaidCardFaceValue: Scalars['BigInt'];
  historicPrepaidCardIssuingTokenBalance: Scalars['BigInt'];
  merchantRegistrationPayments: Array<Maybe<MerchantRegistrationPayment>>;
};


export type PrepaidCardPaymentMerchantRegistrationPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRegistrationPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRegistrationPaymentFilter>;
};

export type PrepaidCardPaymentFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  prepaidCard?: Maybe<Scalars['String']>;
  prepaidCard_not?: Maybe<Scalars['String']>;
  prepaidCard_gt?: Maybe<Scalars['String']>;
  prepaidCard_lt?: Maybe<Scalars['String']>;
  prepaidCard_gte?: Maybe<Scalars['String']>;
  prepaidCard_lte?: Maybe<Scalars['String']>;
  prepaidCard_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_not_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_contains?: Maybe<Scalars['String']>;
  prepaidCard_not_contains?: Maybe<Scalars['String']>;
  prepaidCard_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_not_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_ends_with?: Maybe<Scalars['String']>;
  prepaidCard_not_ends_with?: Maybe<Scalars['String']>;
  prepaidCardOwner?: Maybe<Scalars['String']>;
  prepaidCardOwner_not?: Maybe<Scalars['String']>;
  prepaidCardOwner_gt?: Maybe<Scalars['String']>;
  prepaidCardOwner_lt?: Maybe<Scalars['String']>;
  prepaidCardOwner_gte?: Maybe<Scalars['String']>;
  prepaidCardOwner_lte?: Maybe<Scalars['String']>;
  prepaidCardOwner_in?: Maybe<Array<Scalars['String']>>;
  prepaidCardOwner_not_in?: Maybe<Array<Scalars['String']>>;
  prepaidCardOwner_contains?: Maybe<Scalars['String']>;
  prepaidCardOwner_not_contains?: Maybe<Scalars['String']>;
  prepaidCardOwner_starts_with?: Maybe<Scalars['String']>;
  prepaidCardOwner_not_starts_with?: Maybe<Scalars['String']>;
  prepaidCardOwner_ends_with?: Maybe<Scalars['String']>;
  prepaidCardOwner_not_ends_with?: Maybe<Scalars['String']>;
  merchantSafe?: Maybe<Scalars['String']>;
  merchantSafe_not?: Maybe<Scalars['String']>;
  merchantSafe_gt?: Maybe<Scalars['String']>;
  merchantSafe_lt?: Maybe<Scalars['String']>;
  merchantSafe_gte?: Maybe<Scalars['String']>;
  merchantSafe_lte?: Maybe<Scalars['String']>;
  merchantSafe_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_not_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_contains?: Maybe<Scalars['String']>;
  merchantSafe_not_contains?: Maybe<Scalars['String']>;
  merchantSafe_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_not_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_ends_with?: Maybe<Scalars['String']>;
  merchantSafe_not_ends_with?: Maybe<Scalars['String']>;
  merchant?: Maybe<Scalars['String']>;
  merchant_not?: Maybe<Scalars['String']>;
  merchant_gt?: Maybe<Scalars['String']>;
  merchant_lt?: Maybe<Scalars['String']>;
  merchant_gte?: Maybe<Scalars['String']>;
  merchant_lte?: Maybe<Scalars['String']>;
  merchant_in?: Maybe<Array<Scalars['String']>>;
  merchant_not_in?: Maybe<Array<Scalars['String']>>;
  merchant_contains?: Maybe<Scalars['String']>;
  merchant_not_contains?: Maybe<Scalars['String']>;
  merchant_starts_with?: Maybe<Scalars['String']>;
  merchant_not_starts_with?: Maybe<Scalars['String']>;
  merchant_ends_with?: Maybe<Scalars['String']>;
  merchant_not_ends_with?: Maybe<Scalars['String']>;
  issuingToken?: Maybe<Scalars['String']>;
  issuingToken_not?: Maybe<Scalars['String']>;
  issuingToken_gt?: Maybe<Scalars['String']>;
  issuingToken_lt?: Maybe<Scalars['String']>;
  issuingToken_gte?: Maybe<Scalars['String']>;
  issuingToken_lte?: Maybe<Scalars['String']>;
  issuingToken_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_not_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_contains?: Maybe<Scalars['String']>;
  issuingToken_not_contains?: Maybe<Scalars['String']>;
  issuingToken_starts_with?: Maybe<Scalars['String']>;
  issuingToken_not_starts_with?: Maybe<Scalars['String']>;
  issuingToken_ends_with?: Maybe<Scalars['String']>;
  issuingToken_not_ends_with?: Maybe<Scalars['String']>;
  issuingTokenAmount?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_not?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_gt?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_lt?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_gte?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_lte?: Maybe<Scalars['BigInt']>;
  issuingTokenAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  spendAmount?: Maybe<Scalars['BigInt']>;
  spendAmount_not?: Maybe<Scalars['BigInt']>;
  spendAmount_gt?: Maybe<Scalars['BigInt']>;
  spendAmount_lt?: Maybe<Scalars['BigInt']>;
  spendAmount_gte?: Maybe<Scalars['BigInt']>;
  spendAmount_lte?: Maybe<Scalars['BigInt']>;
  spendAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  spendAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenUSDPrice?: Maybe<Scalars['BigDecimal']>;
  issuingTokenUSDPrice_not?: Maybe<Scalars['BigDecimal']>;
  issuingTokenUSDPrice_gt?: Maybe<Scalars['BigDecimal']>;
  issuingTokenUSDPrice_lt?: Maybe<Scalars['BigDecimal']>;
  issuingTokenUSDPrice_gte?: Maybe<Scalars['BigDecimal']>;
  issuingTokenUSDPrice_lte?: Maybe<Scalars['BigDecimal']>;
  issuingTokenUSDPrice_in?: Maybe<Array<Scalars['BigDecimal']>>;
  issuingTokenUSDPrice_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  historicPrepaidCardFaceValue?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardFaceValue_not?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardFaceValue_gt?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardFaceValue_lt?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardFaceValue_gte?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardFaceValue_lte?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardFaceValue_in?: Maybe<Array<Scalars['BigInt']>>;
  historicPrepaidCardFaceValue_not_in?: Maybe<Array<Scalars['BigInt']>>;
  historicPrepaidCardIssuingTokenBalance?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardIssuingTokenBalance_not?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardIssuingTokenBalance_gt?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardIssuingTokenBalance_lt?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardIssuingTokenBalance_gte?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardIssuingTokenBalance_lte?: Maybe<Scalars['BigInt']>;
  historicPrepaidCardIssuingTokenBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  historicPrepaidCardIssuingTokenBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum PrepaidCardPaymentOrderBy {
  ID = 'id',
  TIMESTAMP = 'timestamp',
  TRANSACTION = 'transaction',
  PREPAIDCARD = 'prepaidCard',
  PREPAIDCARDOWNER = 'prepaidCardOwner',
  MERCHANTSAFE = 'merchantSafe',
  MERCHANT = 'merchant',
  ISSUINGTOKEN = 'issuingToken',
  ISSUINGTOKENAMOUNT = 'issuingTokenAmount',
  SPENDAMOUNT = 'spendAmount',
  ISSUINGTOKENUSDPRICE = 'issuingTokenUSDPrice',
  HISTORICPREPAIDCARDFACEVALUE = 'historicPrepaidCardFaceValue',
  HISTORICPREPAIDCARDISSUINGTOKENBALANCE = 'historicPrepaidCardIssuingTokenBalance',
  MERCHANTREGISTRATIONPAYMENTS = 'merchantRegistrationPayments'
}

export type PrepaidCardSplit = {
  __typename?: 'PrepaidCardSplit';
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  prepaidCard: PrepaidCard;
  issuer: Account;
  faceValues: Array<Scalars['BigInt']>;
  issuingTokenAmounts: Array<Scalars['BigInt']>;
  customizationDID?: Maybe<Scalars['String']>;
};

export type PrepaidCardSplitFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  prepaidCard?: Maybe<Scalars['String']>;
  prepaidCard_not?: Maybe<Scalars['String']>;
  prepaidCard_gt?: Maybe<Scalars['String']>;
  prepaidCard_lt?: Maybe<Scalars['String']>;
  prepaidCard_gte?: Maybe<Scalars['String']>;
  prepaidCard_lte?: Maybe<Scalars['String']>;
  prepaidCard_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_not_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_contains?: Maybe<Scalars['String']>;
  prepaidCard_not_contains?: Maybe<Scalars['String']>;
  prepaidCard_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_not_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_ends_with?: Maybe<Scalars['String']>;
  prepaidCard_not_ends_with?: Maybe<Scalars['String']>;
  issuer?: Maybe<Scalars['String']>;
  issuer_not?: Maybe<Scalars['String']>;
  issuer_gt?: Maybe<Scalars['String']>;
  issuer_lt?: Maybe<Scalars['String']>;
  issuer_gte?: Maybe<Scalars['String']>;
  issuer_lte?: Maybe<Scalars['String']>;
  issuer_in?: Maybe<Array<Scalars['String']>>;
  issuer_not_in?: Maybe<Array<Scalars['String']>>;
  issuer_contains?: Maybe<Scalars['String']>;
  issuer_not_contains?: Maybe<Scalars['String']>;
  issuer_starts_with?: Maybe<Scalars['String']>;
  issuer_not_starts_with?: Maybe<Scalars['String']>;
  issuer_ends_with?: Maybe<Scalars['String']>;
  issuer_not_ends_with?: Maybe<Scalars['String']>;
  faceValues?: Maybe<Array<Scalars['BigInt']>>;
  faceValues_not?: Maybe<Array<Scalars['BigInt']>>;
  faceValues_contains?: Maybe<Array<Scalars['BigInt']>>;
  faceValues_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAmounts?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAmounts_not?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAmounts_contains?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAmounts_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  customizationDID?: Maybe<Scalars['String']>;
  customizationDID_not?: Maybe<Scalars['String']>;
  customizationDID_gt?: Maybe<Scalars['String']>;
  customizationDID_lt?: Maybe<Scalars['String']>;
  customizationDID_gte?: Maybe<Scalars['String']>;
  customizationDID_lte?: Maybe<Scalars['String']>;
  customizationDID_in?: Maybe<Array<Scalars['String']>>;
  customizationDID_not_in?: Maybe<Array<Scalars['String']>>;
  customizationDID_contains?: Maybe<Scalars['String']>;
  customizationDID_not_contains?: Maybe<Scalars['String']>;
  customizationDID_starts_with?: Maybe<Scalars['String']>;
  customizationDID_not_starts_with?: Maybe<Scalars['String']>;
  customizationDID_ends_with?: Maybe<Scalars['String']>;
  customizationDID_not_ends_with?: Maybe<Scalars['String']>;
};

export enum PrepaidCardSplitOrderBy {
  ID = 'id',
  TIMESTAMP = 'timestamp',
  TRANSACTION = 'transaction',
  PREPAIDCARD = 'prepaidCard',
  ISSUER = 'issuer',
  FACEVALUES = 'faceValues',
  ISSUINGTOKENAMOUNTS = 'issuingTokenAmounts',
  CUSTOMIZATIONDID = 'customizationDID'
}

export type PrepaidCardTransfer = {
  __typename?: 'PrepaidCardTransfer';
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  prepaidCard: PrepaidCard;
  from: Account;
  to: Account;
};

export type PrepaidCardTransferFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  prepaidCard?: Maybe<Scalars['String']>;
  prepaidCard_not?: Maybe<Scalars['String']>;
  prepaidCard_gt?: Maybe<Scalars['String']>;
  prepaidCard_lt?: Maybe<Scalars['String']>;
  prepaidCard_gte?: Maybe<Scalars['String']>;
  prepaidCard_lte?: Maybe<Scalars['String']>;
  prepaidCard_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_not_in?: Maybe<Array<Scalars['String']>>;
  prepaidCard_contains?: Maybe<Scalars['String']>;
  prepaidCard_not_contains?: Maybe<Scalars['String']>;
  prepaidCard_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_not_starts_with?: Maybe<Scalars['String']>;
  prepaidCard_ends_with?: Maybe<Scalars['String']>;
  prepaidCard_not_ends_with?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  from_not?: Maybe<Scalars['String']>;
  from_gt?: Maybe<Scalars['String']>;
  from_lt?: Maybe<Scalars['String']>;
  from_gte?: Maybe<Scalars['String']>;
  from_lte?: Maybe<Scalars['String']>;
  from_in?: Maybe<Array<Scalars['String']>>;
  from_not_in?: Maybe<Array<Scalars['String']>>;
  from_contains?: Maybe<Scalars['String']>;
  from_not_contains?: Maybe<Scalars['String']>;
  from_starts_with?: Maybe<Scalars['String']>;
  from_not_starts_with?: Maybe<Scalars['String']>;
  from_ends_with?: Maybe<Scalars['String']>;
  from_not_ends_with?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  to_not?: Maybe<Scalars['String']>;
  to_gt?: Maybe<Scalars['String']>;
  to_lt?: Maybe<Scalars['String']>;
  to_gte?: Maybe<Scalars['String']>;
  to_lte?: Maybe<Scalars['String']>;
  to_in?: Maybe<Array<Scalars['String']>>;
  to_not_in?: Maybe<Array<Scalars['String']>>;
  to_contains?: Maybe<Scalars['String']>;
  to_not_contains?: Maybe<Scalars['String']>;
  to_starts_with?: Maybe<Scalars['String']>;
  to_not_starts_with?: Maybe<Scalars['String']>;
  to_ends_with?: Maybe<Scalars['String']>;
  to_not_ends_with?: Maybe<Scalars['String']>;
};

export enum PrepaidCardTransferOrderBy {
  ID = 'id',
  TIMESTAMP = 'timestamp',
  TRANSACTION = 'transaction',
  PREPAIDCARD = 'prepaidCard',
  FROM = 'from',
  TO = 'to'
}

export type PrepaidCardFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  safe?: Maybe<Scalars['String']>;
  safe_not?: Maybe<Scalars['String']>;
  safe_gt?: Maybe<Scalars['String']>;
  safe_lt?: Maybe<Scalars['String']>;
  safe_gte?: Maybe<Scalars['String']>;
  safe_lte?: Maybe<Scalars['String']>;
  safe_in?: Maybe<Array<Scalars['String']>>;
  safe_not_in?: Maybe<Array<Scalars['String']>>;
  safe_contains?: Maybe<Scalars['String']>;
  safe_not_contains?: Maybe<Scalars['String']>;
  safe_starts_with?: Maybe<Scalars['String']>;
  safe_not_starts_with?: Maybe<Scalars['String']>;
  safe_ends_with?: Maybe<Scalars['String']>;
  safe_not_ends_with?: Maybe<Scalars['String']>;
  customizationDID?: Maybe<Scalars['String']>;
  customizationDID_not?: Maybe<Scalars['String']>;
  customizationDID_gt?: Maybe<Scalars['String']>;
  customizationDID_lt?: Maybe<Scalars['String']>;
  customizationDID_gte?: Maybe<Scalars['String']>;
  customizationDID_lte?: Maybe<Scalars['String']>;
  customizationDID_in?: Maybe<Array<Scalars['String']>>;
  customizationDID_not_in?: Maybe<Array<Scalars['String']>>;
  customizationDID_contains?: Maybe<Scalars['String']>;
  customizationDID_not_contains?: Maybe<Scalars['String']>;
  customizationDID_starts_with?: Maybe<Scalars['String']>;
  customizationDID_not_starts_with?: Maybe<Scalars['String']>;
  customizationDID_ends_with?: Maybe<Scalars['String']>;
  customizationDID_not_ends_with?: Maybe<Scalars['String']>;
  issuingToken?: Maybe<Scalars['String']>;
  issuingToken_not?: Maybe<Scalars['String']>;
  issuingToken_gt?: Maybe<Scalars['String']>;
  issuingToken_lt?: Maybe<Scalars['String']>;
  issuingToken_gte?: Maybe<Scalars['String']>;
  issuingToken_lte?: Maybe<Scalars['String']>;
  issuingToken_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_not_in?: Maybe<Array<Scalars['String']>>;
  issuingToken_contains?: Maybe<Scalars['String']>;
  issuingToken_not_contains?: Maybe<Scalars['String']>;
  issuingToken_starts_with?: Maybe<Scalars['String']>;
  issuingToken_not_starts_with?: Maybe<Scalars['String']>;
  issuingToken_ends_with?: Maybe<Scalars['String']>;
  issuingToken_not_ends_with?: Maybe<Scalars['String']>;
  issuer?: Maybe<Scalars['String']>;
  issuer_not?: Maybe<Scalars['String']>;
  issuer_gt?: Maybe<Scalars['String']>;
  issuer_lt?: Maybe<Scalars['String']>;
  issuer_gte?: Maybe<Scalars['String']>;
  issuer_lte?: Maybe<Scalars['String']>;
  issuer_in?: Maybe<Array<Scalars['String']>>;
  issuer_not_in?: Maybe<Array<Scalars['String']>>;
  issuer_contains?: Maybe<Scalars['String']>;
  issuer_not_contains?: Maybe<Scalars['String']>;
  issuer_starts_with?: Maybe<Scalars['String']>;
  issuer_not_starts_with?: Maybe<Scalars['String']>;
  issuer_ends_with?: Maybe<Scalars['String']>;
  issuer_not_ends_with?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  owner_not?: Maybe<Scalars['String']>;
  owner_gt?: Maybe<Scalars['String']>;
  owner_lt?: Maybe<Scalars['String']>;
  owner_gte?: Maybe<Scalars['String']>;
  owner_lte?: Maybe<Scalars['String']>;
  owner_in?: Maybe<Array<Scalars['String']>>;
  owner_not_in?: Maybe<Array<Scalars['String']>>;
  owner_contains?: Maybe<Scalars['String']>;
  owner_not_contains?: Maybe<Scalars['String']>;
  owner_starts_with?: Maybe<Scalars['String']>;
  owner_not_starts_with?: Maybe<Scalars['String']>;
  owner_ends_with?: Maybe<Scalars['String']>;
  owner_not_ends_with?: Maybe<Scalars['String']>;
  reloadable?: Maybe<Scalars['Boolean']>;
  reloadable_not?: Maybe<Scalars['Boolean']>;
  reloadable_in?: Maybe<Array<Scalars['Boolean']>>;
  reloadable_not_in?: Maybe<Array<Scalars['Boolean']>>;
  faceValue?: Maybe<Scalars['BigInt']>;
  faceValue_not?: Maybe<Scalars['BigInt']>;
  faceValue_gt?: Maybe<Scalars['BigInt']>;
  faceValue_lt?: Maybe<Scalars['BigInt']>;
  faceValue_gte?: Maybe<Scalars['BigInt']>;
  faceValue_lte?: Maybe<Scalars['BigInt']>;
  faceValue_in?: Maybe<Array<Scalars['BigInt']>>;
  faceValue_not_in?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenBalance?: Maybe<Scalars['BigInt']>;
  issuingTokenBalance_not?: Maybe<Scalars['BigInt']>;
  issuingTokenBalance_gt?: Maybe<Scalars['BigInt']>;
  issuingTokenBalance_lt?: Maybe<Scalars['BigInt']>;
  issuingTokenBalance_gte?: Maybe<Scalars['BigInt']>;
  issuingTokenBalance_lte?: Maybe<Scalars['BigInt']>;
  issuingTokenBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum PrepaidCardOrderBy {
  ID = 'id',
  SAFE = 'safe',
  CUSTOMIZATIONDID = 'customizationDID',
  ISSUINGTOKEN = 'issuingToken',
  ISSUER = 'issuer',
  OWNER = 'owner',
  RELOADABLE = 'reloadable',
  FACEVALUE = 'faceValue',
  ISSUINGTOKENBALANCE = 'issuingTokenBalance',
  CREATION = 'creation',
  PAYMENTS = 'payments',
  SPLITS = 'splits',
  TRANSFERS = 'transfers'
}

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accounts: Array<Account>;
  depot?: Maybe<Depot>;
  depots: Array<Depot>;
  prepaidCard?: Maybe<PrepaidCard>;
  prepaidCards: Array<PrepaidCard>;
  merchantSafe?: Maybe<MerchantSafe>;
  merchantSafes: Array<MerchantSafe>;
  bridgeToLayer1Event?: Maybe<BridgeToLayer1Event>;
  bridgeToLayer1Events: Array<BridgeToLayer1Event>;
  bridgeToLayer2Event?: Maybe<BridgeToLayer2Event>;
  bridgeToLayer2Events: Array<BridgeToLayer2Event>;
  supplierInfoDIDUpdate?: Maybe<SupplierInfoDidUpdate>;
  supplierInfoDIDUpdates: Array<SupplierInfoDidUpdate>;
  prepaidCardPayment?: Maybe<PrepaidCardPayment>;
  prepaidCardPayments: Array<PrepaidCardPayment>;
  prepaidCardSplit?: Maybe<PrepaidCardSplit>;
  prepaidCardSplits: Array<PrepaidCardSplit>;
  prepaidCardTransfer?: Maybe<PrepaidCardTransfer>;
  prepaidCardTransfers: Array<PrepaidCardTransfer>;
  merchantRevenue?: Maybe<MerchantRevenue>;
  merchantRevenues: Array<MerchantRevenue>;
  revenueEarningsByDay?: Maybe<RevenueEarningsByDay>;
  revenueEarningsByDays: Array<RevenueEarningsByDay>;
  merchantClaim?: Maybe<MerchantClaim>;
  merchantClaims: Array<MerchantClaim>;
  merchantRevenueEvent?: Maybe<MerchantRevenueEvent>;
  merchantRevenueEvents: Array<MerchantRevenueEvent>;
  spendAccumulation?: Maybe<SpendAccumulation>;
  spendAccumulations: Array<SpendAccumulation>;
  merchantFeePayment?: Maybe<MerchantFeePayment>;
  merchantFeePayments: Array<MerchantFeePayment>;
  prepaidCardCreation?: Maybe<PrepaidCardCreation>;
  prepaidCardCreations: Array<PrepaidCardCreation>;
  merchantCreation?: Maybe<MerchantCreation>;
  merchantCreations: Array<MerchantCreation>;
  merchantRegistrationPayment?: Maybe<MerchantRegistrationPayment>;
  merchantRegistrationPayments: Array<MerchantRegistrationPayment>;
  tokenSwap?: Maybe<TokenSwap>;
  tokenSwaps: Array<TokenSwap>;
  safe?: Maybe<Safe>;
  safes: Array<Safe>;
  safeTransaction?: Maybe<SafeTransaction>;
  safeTransactions: Array<SafeTransaction>;
  eoatransaction?: Maybe<EoaTransaction>;
  eoatransactions: Array<EoaTransaction>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  safeOwner?: Maybe<SafeOwner>;
  safeOwners: Array<SafeOwner>;
  tokenTransfer?: Maybe<TokenTransfer>;
  tokenTransfers: Array<TokenTransfer>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolders: Array<TokenHolder>;
  tokenHistory?: Maybe<TokenHistory>;
  tokenHistories: Array<TokenHistory>;
  tokenPair?: Maybe<TokenPair>;
  tokenPairs: Array<TokenPair>;
  /** Access to subgraph metadata */
  _meta?: Maybe<Meta>;
};


export type QueryAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryDepotArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryDepotsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DepotOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DepotFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantSafeArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantSafesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantSafeOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantSafeFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryBridgeToLayer1EventArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryBridgeToLayer1EventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer1EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer1EventFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryBridgeToLayer2EventArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryBridgeToLayer2EventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer2EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer2EventFilter>;
  block?: Maybe<BlockHeight>;
};


export type QuerySupplierInfoDidUpdateArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QuerySupplierInfoDidUpdatesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SupplierInfoDidUpdateOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SupplierInfoDidUpdateFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardPaymentArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardPaymentFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardSplitArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardSplitsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardSplitOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardSplitFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardTransferFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantRevenueArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantRevenuesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRevenueOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRevenueFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryRevenueEarningsByDayArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryRevenueEarningsByDaysArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RevenueEarningsByDayOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RevenueEarningsByDayFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantClaimArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantClaimOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantClaimFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantRevenueEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantRevenueEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRevenueEventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRevenueEventFilter>;
  block?: Maybe<BlockHeight>;
};


export type QuerySpendAccumulationArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QuerySpendAccumulationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SpendAccumulationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SpendAccumulationFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantFeePaymentArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantFeePaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantFeePaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantFeePaymentFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardCreationArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryPrepaidCardCreationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardCreationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardCreationFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantCreationArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantCreationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantCreationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantCreationFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantRegistrationPaymentArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryMerchantRegistrationPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRegistrationPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRegistrationPaymentFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryTokenSwapArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryTokenSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenSwapOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenSwapFilter>;
  block?: Maybe<BlockHeight>;
};


export type QuerySafeArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QuerySafesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeFilter>;
  block?: Maybe<BlockHeight>;
};


export type QuerySafeTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QuerySafeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeTransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeTransactionFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryEoatransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryEoatransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EoaTransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<EoaTransactionFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransactionFilter>;
  block?: Maybe<BlockHeight>;
};


export type QuerySafeOwnerArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QuerySafeOwnersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeOwnerOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeOwnerFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryTokenTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryTokenTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenTransferFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryTokenHolderArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryTokenHoldersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHolderOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHolderFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryTokenHistoryArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryTokenHistoriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHistoryOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHistoryFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryTokenPairArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type QueryTokenPairsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenPairOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenPairFilter>;
  block?: Maybe<BlockHeight>;
};


export type QueryMetaArgs = {
  block?: Maybe<BlockHeight>;
};

export type RevenueEarningsByDay = {
  __typename?: 'RevenueEarningsByDay';
  id: Scalars['ID'];
  date: Scalars['String'];
  merchantRevenue: MerchantRevenue;
  spendAccumulation: Scalars['BigInt'];
  issuingTokenAccumulation: Scalars['BigInt'];
};

export type RevenueEarningsByDayFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  date?: Maybe<Scalars['String']>;
  date_not?: Maybe<Scalars['String']>;
  date_gt?: Maybe<Scalars['String']>;
  date_lt?: Maybe<Scalars['String']>;
  date_gte?: Maybe<Scalars['String']>;
  date_lte?: Maybe<Scalars['String']>;
  date_in?: Maybe<Array<Scalars['String']>>;
  date_not_in?: Maybe<Array<Scalars['String']>>;
  date_contains?: Maybe<Scalars['String']>;
  date_not_contains?: Maybe<Scalars['String']>;
  date_starts_with?: Maybe<Scalars['String']>;
  date_not_starts_with?: Maybe<Scalars['String']>;
  date_ends_with?: Maybe<Scalars['String']>;
  date_not_ends_with?: Maybe<Scalars['String']>;
  merchantRevenue?: Maybe<Scalars['String']>;
  merchantRevenue_not?: Maybe<Scalars['String']>;
  merchantRevenue_gt?: Maybe<Scalars['String']>;
  merchantRevenue_lt?: Maybe<Scalars['String']>;
  merchantRevenue_gte?: Maybe<Scalars['String']>;
  merchantRevenue_lte?: Maybe<Scalars['String']>;
  merchantRevenue_in?: Maybe<Array<Scalars['String']>>;
  merchantRevenue_not_in?: Maybe<Array<Scalars['String']>>;
  merchantRevenue_contains?: Maybe<Scalars['String']>;
  merchantRevenue_not_contains?: Maybe<Scalars['String']>;
  merchantRevenue_starts_with?: Maybe<Scalars['String']>;
  merchantRevenue_not_starts_with?: Maybe<Scalars['String']>;
  merchantRevenue_ends_with?: Maybe<Scalars['String']>;
  merchantRevenue_not_ends_with?: Maybe<Scalars['String']>;
  spendAccumulation?: Maybe<Scalars['BigInt']>;
  spendAccumulation_not?: Maybe<Scalars['BigInt']>;
  spendAccumulation_gt?: Maybe<Scalars['BigInt']>;
  spendAccumulation_lt?: Maybe<Scalars['BigInt']>;
  spendAccumulation_gte?: Maybe<Scalars['BigInt']>;
  spendAccumulation_lte?: Maybe<Scalars['BigInt']>;
  spendAccumulation_in?: Maybe<Array<Scalars['BigInt']>>;
  spendAccumulation_not_in?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAccumulation?: Maybe<Scalars['BigInt']>;
  issuingTokenAccumulation_not?: Maybe<Scalars['BigInt']>;
  issuingTokenAccumulation_gt?: Maybe<Scalars['BigInt']>;
  issuingTokenAccumulation_lt?: Maybe<Scalars['BigInt']>;
  issuingTokenAccumulation_gte?: Maybe<Scalars['BigInt']>;
  issuingTokenAccumulation_lte?: Maybe<Scalars['BigInt']>;
  issuingTokenAccumulation_in?: Maybe<Array<Scalars['BigInt']>>;
  issuingTokenAccumulation_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum RevenueEarningsByDayOrderBy {
  ID = 'id',
  DATE = 'date',
  MERCHANTREVENUE = 'merchantRevenue',
  SPENDACCUMULATION = 'spendAccumulation',
  ISSUINGTOKENACCUMULATION = 'issuingTokenAccumulation'
}

export type Safe = {
  __typename?: 'Safe';
  id: Scalars['ID'];
  createdAt: Scalars['BigInt'];
  owners: Array<Maybe<SafeOwner>>;
  safeTxns: Array<Maybe<SafeTransaction>>;
  depot?: Maybe<Depot>;
  merchant?: Maybe<MerchantSafe>;
  prepaidCard?: Maybe<PrepaidCard>;
  tokens: Array<Maybe<TokenHolder>>;
  sentBridgedTokens: Array<Maybe<BridgeToLayer1Event>>;
};


export type SafeOwnersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeOwnerOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeOwnerFilter>;
};


export type SafeSafeTxnsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeTransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeTransactionFilter>;
};


export type SafeTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHolderOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHolderFilter>;
};


export type SafeSentBridgedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer1EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer1EventFilter>;
};

export type SafeOwner = {
  __typename?: 'SafeOwner';
  id: Scalars['ID'];
  owner: Account;
  safe: Safe;
  createdAt: Scalars['BigInt'];
};

export type SafeOwnerFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  owner?: Maybe<Scalars['String']>;
  owner_not?: Maybe<Scalars['String']>;
  owner_gt?: Maybe<Scalars['String']>;
  owner_lt?: Maybe<Scalars['String']>;
  owner_gte?: Maybe<Scalars['String']>;
  owner_lte?: Maybe<Scalars['String']>;
  owner_in?: Maybe<Array<Scalars['String']>>;
  owner_not_in?: Maybe<Array<Scalars['String']>>;
  owner_contains?: Maybe<Scalars['String']>;
  owner_not_contains?: Maybe<Scalars['String']>;
  owner_starts_with?: Maybe<Scalars['String']>;
  owner_not_starts_with?: Maybe<Scalars['String']>;
  owner_ends_with?: Maybe<Scalars['String']>;
  owner_not_ends_with?: Maybe<Scalars['String']>;
  safe?: Maybe<Scalars['String']>;
  safe_not?: Maybe<Scalars['String']>;
  safe_gt?: Maybe<Scalars['String']>;
  safe_lt?: Maybe<Scalars['String']>;
  safe_gte?: Maybe<Scalars['String']>;
  safe_lte?: Maybe<Scalars['String']>;
  safe_in?: Maybe<Array<Scalars['String']>>;
  safe_not_in?: Maybe<Array<Scalars['String']>>;
  safe_contains?: Maybe<Scalars['String']>;
  safe_not_contains?: Maybe<Scalars['String']>;
  safe_starts_with?: Maybe<Scalars['String']>;
  safe_not_starts_with?: Maybe<Scalars['String']>;
  safe_ends_with?: Maybe<Scalars['String']>;
  safe_not_ends_with?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum SafeOwnerOrderBy {
  ID = 'id',
  OWNER = 'owner',
  SAFE = 'safe',
  CREATEDAT = 'createdAt'
}

export type SafeTransaction = {
  __typename?: 'SafeTransaction';
  id: Scalars['ID'];
  transaction: Transaction;
  timestamp: Scalars['BigInt'];
  safe: Safe;
  to: Scalars['String'];
  value: Scalars['BigInt'];
  data: Scalars['Bytes'];
  operation: Scalars['BigInt'];
  safeTxGas: Scalars['BigInt'];
  baseGas: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
  gasToken?: Maybe<Token>;
  refundReceiver: Scalars['String'];
  signatures: Scalars['Bytes'];
};

export type SafeTransactionFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  safe?: Maybe<Scalars['String']>;
  safe_not?: Maybe<Scalars['String']>;
  safe_gt?: Maybe<Scalars['String']>;
  safe_lt?: Maybe<Scalars['String']>;
  safe_gte?: Maybe<Scalars['String']>;
  safe_lte?: Maybe<Scalars['String']>;
  safe_in?: Maybe<Array<Scalars['String']>>;
  safe_not_in?: Maybe<Array<Scalars['String']>>;
  safe_contains?: Maybe<Scalars['String']>;
  safe_not_contains?: Maybe<Scalars['String']>;
  safe_starts_with?: Maybe<Scalars['String']>;
  safe_not_starts_with?: Maybe<Scalars['String']>;
  safe_ends_with?: Maybe<Scalars['String']>;
  safe_not_ends_with?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  to_not?: Maybe<Scalars['String']>;
  to_gt?: Maybe<Scalars['String']>;
  to_lt?: Maybe<Scalars['String']>;
  to_gte?: Maybe<Scalars['String']>;
  to_lte?: Maybe<Scalars['String']>;
  to_in?: Maybe<Array<Scalars['String']>>;
  to_not_in?: Maybe<Array<Scalars['String']>>;
  to_contains?: Maybe<Scalars['String']>;
  to_not_contains?: Maybe<Scalars['String']>;
  to_starts_with?: Maybe<Scalars['String']>;
  to_not_starts_with?: Maybe<Scalars['String']>;
  to_ends_with?: Maybe<Scalars['String']>;
  to_not_ends_with?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
  value_not?: Maybe<Scalars['BigInt']>;
  value_gt?: Maybe<Scalars['BigInt']>;
  value_lt?: Maybe<Scalars['BigInt']>;
  value_gte?: Maybe<Scalars['BigInt']>;
  value_lte?: Maybe<Scalars['BigInt']>;
  value_in?: Maybe<Array<Scalars['BigInt']>>;
  value_not_in?: Maybe<Array<Scalars['BigInt']>>;
  data?: Maybe<Scalars['Bytes']>;
  data_not?: Maybe<Scalars['Bytes']>;
  data_in?: Maybe<Array<Scalars['Bytes']>>;
  data_not_in?: Maybe<Array<Scalars['Bytes']>>;
  data_contains?: Maybe<Scalars['Bytes']>;
  data_not_contains?: Maybe<Scalars['Bytes']>;
  operation?: Maybe<Scalars['BigInt']>;
  operation_not?: Maybe<Scalars['BigInt']>;
  operation_gt?: Maybe<Scalars['BigInt']>;
  operation_lt?: Maybe<Scalars['BigInt']>;
  operation_gte?: Maybe<Scalars['BigInt']>;
  operation_lte?: Maybe<Scalars['BigInt']>;
  operation_in?: Maybe<Array<Scalars['BigInt']>>;
  operation_not_in?: Maybe<Array<Scalars['BigInt']>>;
  safeTxGas?: Maybe<Scalars['BigInt']>;
  safeTxGas_not?: Maybe<Scalars['BigInt']>;
  safeTxGas_gt?: Maybe<Scalars['BigInt']>;
  safeTxGas_lt?: Maybe<Scalars['BigInt']>;
  safeTxGas_gte?: Maybe<Scalars['BigInt']>;
  safeTxGas_lte?: Maybe<Scalars['BigInt']>;
  safeTxGas_in?: Maybe<Array<Scalars['BigInt']>>;
  safeTxGas_not_in?: Maybe<Array<Scalars['BigInt']>>;
  baseGas?: Maybe<Scalars['BigInt']>;
  baseGas_not?: Maybe<Scalars['BigInt']>;
  baseGas_gt?: Maybe<Scalars['BigInt']>;
  baseGas_lt?: Maybe<Scalars['BigInt']>;
  baseGas_gte?: Maybe<Scalars['BigInt']>;
  baseGas_lte?: Maybe<Scalars['BigInt']>;
  baseGas_in?: Maybe<Array<Scalars['BigInt']>>;
  baseGas_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasPrice_not?: Maybe<Scalars['BigInt']>;
  gasPrice_gt?: Maybe<Scalars['BigInt']>;
  gasPrice_lt?: Maybe<Scalars['BigInt']>;
  gasPrice_gte?: Maybe<Scalars['BigInt']>;
  gasPrice_lte?: Maybe<Scalars['BigInt']>;
  gasPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasToken?: Maybe<Scalars['String']>;
  gasToken_not?: Maybe<Scalars['String']>;
  gasToken_gt?: Maybe<Scalars['String']>;
  gasToken_lt?: Maybe<Scalars['String']>;
  gasToken_gte?: Maybe<Scalars['String']>;
  gasToken_lte?: Maybe<Scalars['String']>;
  gasToken_in?: Maybe<Array<Scalars['String']>>;
  gasToken_not_in?: Maybe<Array<Scalars['String']>>;
  gasToken_contains?: Maybe<Scalars['String']>;
  gasToken_not_contains?: Maybe<Scalars['String']>;
  gasToken_starts_with?: Maybe<Scalars['String']>;
  gasToken_not_starts_with?: Maybe<Scalars['String']>;
  gasToken_ends_with?: Maybe<Scalars['String']>;
  gasToken_not_ends_with?: Maybe<Scalars['String']>;
  refundReceiver?: Maybe<Scalars['String']>;
  refundReceiver_not?: Maybe<Scalars['String']>;
  refundReceiver_gt?: Maybe<Scalars['String']>;
  refundReceiver_lt?: Maybe<Scalars['String']>;
  refundReceiver_gte?: Maybe<Scalars['String']>;
  refundReceiver_lte?: Maybe<Scalars['String']>;
  refundReceiver_in?: Maybe<Array<Scalars['String']>>;
  refundReceiver_not_in?: Maybe<Array<Scalars['String']>>;
  refundReceiver_contains?: Maybe<Scalars['String']>;
  refundReceiver_not_contains?: Maybe<Scalars['String']>;
  refundReceiver_starts_with?: Maybe<Scalars['String']>;
  refundReceiver_not_starts_with?: Maybe<Scalars['String']>;
  refundReceiver_ends_with?: Maybe<Scalars['String']>;
  refundReceiver_not_ends_with?: Maybe<Scalars['String']>;
  signatures?: Maybe<Scalars['Bytes']>;
  signatures_not?: Maybe<Scalars['Bytes']>;
  signatures_in?: Maybe<Array<Scalars['Bytes']>>;
  signatures_not_in?: Maybe<Array<Scalars['Bytes']>>;
  signatures_contains?: Maybe<Scalars['Bytes']>;
  signatures_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum SafeTransactionOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  TIMESTAMP = 'timestamp',
  SAFE = 'safe',
  TO = 'to',
  VALUE = 'value',
  DATA = 'data',
  OPERATION = 'operation',
  SAFETXGAS = 'safeTxGas',
  BASEGAS = 'baseGas',
  GASPRICE = 'gasPrice',
  GASTOKEN = 'gasToken',
  REFUNDRECEIVER = 'refundReceiver',
  SIGNATURES = 'signatures'
}

export type SafeFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum SafeOrderBy {
  ID = 'id',
  CREATEDAT = 'createdAt',
  OWNERS = 'owners',
  SAFETXNS = 'safeTxns',
  DEPOT = 'depot',
  MERCHANT = 'merchant',
  PREPAIDCARD = 'prepaidCard',
  TOKENS = 'tokens',
  SENTBRIDGEDTOKENS = 'sentBridgedTokens'
}

export type SpendAccumulation = {
  __typename?: 'SpendAccumulation';
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  merchantSafe: MerchantSafe;
  amount: Scalars['BigInt'];
  historicSpendBalance: Scalars['BigInt'];
};

export type SpendAccumulationFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  merchantSafe?: Maybe<Scalars['String']>;
  merchantSafe_not?: Maybe<Scalars['String']>;
  merchantSafe_gt?: Maybe<Scalars['String']>;
  merchantSafe_lt?: Maybe<Scalars['String']>;
  merchantSafe_gte?: Maybe<Scalars['String']>;
  merchantSafe_lte?: Maybe<Scalars['String']>;
  merchantSafe_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_not_in?: Maybe<Array<Scalars['String']>>;
  merchantSafe_contains?: Maybe<Scalars['String']>;
  merchantSafe_not_contains?: Maybe<Scalars['String']>;
  merchantSafe_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_not_starts_with?: Maybe<Scalars['String']>;
  merchantSafe_ends_with?: Maybe<Scalars['String']>;
  merchantSafe_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  historicSpendBalance?: Maybe<Scalars['BigInt']>;
  historicSpendBalance_not?: Maybe<Scalars['BigInt']>;
  historicSpendBalance_gt?: Maybe<Scalars['BigInt']>;
  historicSpendBalance_lt?: Maybe<Scalars['BigInt']>;
  historicSpendBalance_gte?: Maybe<Scalars['BigInt']>;
  historicSpendBalance_lte?: Maybe<Scalars['BigInt']>;
  historicSpendBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  historicSpendBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum SpendAccumulationOrderBy {
  ID = 'id',
  TIMESTAMP = 'timestamp',
  TRANSACTION = 'transaction',
  MERCHANTSAFE = 'merchantSafe',
  AMOUNT = 'amount',
  HISTORICSPENDBALANCE = 'historicSpendBalance'
}

export type Subscription = {
  __typename?: 'Subscription';
  account?: Maybe<Account>;
  accounts: Array<Account>;
  depot?: Maybe<Depot>;
  depots: Array<Depot>;
  prepaidCard?: Maybe<PrepaidCard>;
  prepaidCards: Array<PrepaidCard>;
  merchantSafe?: Maybe<MerchantSafe>;
  merchantSafes: Array<MerchantSafe>;
  bridgeToLayer1Event?: Maybe<BridgeToLayer1Event>;
  bridgeToLayer1Events: Array<BridgeToLayer1Event>;
  bridgeToLayer2Event?: Maybe<BridgeToLayer2Event>;
  bridgeToLayer2Events: Array<BridgeToLayer2Event>;
  supplierInfoDIDUpdate?: Maybe<SupplierInfoDidUpdate>;
  supplierInfoDIDUpdates: Array<SupplierInfoDidUpdate>;
  prepaidCardPayment?: Maybe<PrepaidCardPayment>;
  prepaidCardPayments: Array<PrepaidCardPayment>;
  prepaidCardSplit?: Maybe<PrepaidCardSplit>;
  prepaidCardSplits: Array<PrepaidCardSplit>;
  prepaidCardTransfer?: Maybe<PrepaidCardTransfer>;
  prepaidCardTransfers: Array<PrepaidCardTransfer>;
  merchantRevenue?: Maybe<MerchantRevenue>;
  merchantRevenues: Array<MerchantRevenue>;
  revenueEarningsByDay?: Maybe<RevenueEarningsByDay>;
  revenueEarningsByDays: Array<RevenueEarningsByDay>;
  merchantClaim?: Maybe<MerchantClaim>;
  merchantClaims: Array<MerchantClaim>;
  merchantRevenueEvent?: Maybe<MerchantRevenueEvent>;
  merchantRevenueEvents: Array<MerchantRevenueEvent>;
  spendAccumulation?: Maybe<SpendAccumulation>;
  spendAccumulations: Array<SpendAccumulation>;
  merchantFeePayment?: Maybe<MerchantFeePayment>;
  merchantFeePayments: Array<MerchantFeePayment>;
  prepaidCardCreation?: Maybe<PrepaidCardCreation>;
  prepaidCardCreations: Array<PrepaidCardCreation>;
  merchantCreation?: Maybe<MerchantCreation>;
  merchantCreations: Array<MerchantCreation>;
  merchantRegistrationPayment?: Maybe<MerchantRegistrationPayment>;
  merchantRegistrationPayments: Array<MerchantRegistrationPayment>;
  tokenSwap?: Maybe<TokenSwap>;
  tokenSwaps: Array<TokenSwap>;
  safe?: Maybe<Safe>;
  safes: Array<Safe>;
  safeTransaction?: Maybe<SafeTransaction>;
  safeTransactions: Array<SafeTransaction>;
  eoatransaction?: Maybe<EoaTransaction>;
  eoatransactions: Array<EoaTransaction>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  safeOwner?: Maybe<SafeOwner>;
  safeOwners: Array<SafeOwner>;
  tokenTransfer?: Maybe<TokenTransfer>;
  tokenTransfers: Array<TokenTransfer>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolders: Array<TokenHolder>;
  tokenHistory?: Maybe<TokenHistory>;
  tokenHistories: Array<TokenHistory>;
  tokenPair?: Maybe<TokenPair>;
  tokenPairs: Array<TokenPair>;
  /** Access to subgraph metadata */
  _meta?: Maybe<Meta>;
};


export type SubscriptionAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionDepotArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionDepotsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DepotOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DepotFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantSafeArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantSafesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantSafeOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantSafeFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionBridgeToLayer1EventArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionBridgeToLayer1EventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer1EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer1EventFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionBridgeToLayer2EventArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionBridgeToLayer2EventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer2EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer2EventFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSupplierInfoDidUpdateArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSupplierInfoDidUpdatesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SupplierInfoDidUpdateOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SupplierInfoDidUpdateFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardPaymentArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardPaymentFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardSplitArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardSplitsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardSplitOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardSplitFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardTransferFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantRevenueArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantRevenuesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRevenueOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRevenueFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionRevenueEarningsByDayArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionRevenueEarningsByDaysArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RevenueEarningsByDayOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RevenueEarningsByDayFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantClaimArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantClaimOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantClaimFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantRevenueEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantRevenueEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRevenueEventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRevenueEventFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSpendAccumulationArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSpendAccumulationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SpendAccumulationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SpendAccumulationFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantFeePaymentArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantFeePaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantFeePaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantFeePaymentFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardCreationArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionPrepaidCardCreationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardCreationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardCreationFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantCreationArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantCreationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantCreationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantCreationFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantRegistrationPaymentArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMerchantRegistrationPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRegistrationPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRegistrationPaymentFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenSwapArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenSwapOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenSwapFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSafeArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSafesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSafeTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSafeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeTransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeTransactionFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionEoatransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionEoatransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EoaTransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<EoaTransactionFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransactionFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSafeOwnerArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionSafeOwnersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeOwnerOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeOwnerFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenTransferArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenTransferFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenHolderArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenHoldersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHolderOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHolderFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenHistoryArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenHistoriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHistoryOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHistoryFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenPairArgs = {
  id: Scalars['ID'];
  block?: Maybe<BlockHeight>;
};


export type SubscriptionTokenPairsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenPairOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenPairFilter>;
  block?: Maybe<BlockHeight>;
};


export type SubscriptionMetaArgs = {
  block?: Maybe<BlockHeight>;
};

export type SupplierInfoDidUpdate = {
  __typename?: 'SupplierInfoDIDUpdate';
  id: Scalars['ID'];
  transaction: Transaction;
  infoDID: Scalars['String'];
  timestamp: Scalars['BigInt'];
  supplier: Account;
};

export type SupplierInfoDidUpdateFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  infoDID?: Maybe<Scalars['String']>;
  infoDID_not?: Maybe<Scalars['String']>;
  infoDID_gt?: Maybe<Scalars['String']>;
  infoDID_lt?: Maybe<Scalars['String']>;
  infoDID_gte?: Maybe<Scalars['String']>;
  infoDID_lte?: Maybe<Scalars['String']>;
  infoDID_in?: Maybe<Array<Scalars['String']>>;
  infoDID_not_in?: Maybe<Array<Scalars['String']>>;
  infoDID_contains?: Maybe<Scalars['String']>;
  infoDID_not_contains?: Maybe<Scalars['String']>;
  infoDID_starts_with?: Maybe<Scalars['String']>;
  infoDID_not_starts_with?: Maybe<Scalars['String']>;
  infoDID_ends_with?: Maybe<Scalars['String']>;
  infoDID_not_ends_with?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  supplier?: Maybe<Scalars['String']>;
  supplier_not?: Maybe<Scalars['String']>;
  supplier_gt?: Maybe<Scalars['String']>;
  supplier_lt?: Maybe<Scalars['String']>;
  supplier_gte?: Maybe<Scalars['String']>;
  supplier_lte?: Maybe<Scalars['String']>;
  supplier_in?: Maybe<Array<Scalars['String']>>;
  supplier_not_in?: Maybe<Array<Scalars['String']>>;
  supplier_contains?: Maybe<Scalars['String']>;
  supplier_not_contains?: Maybe<Scalars['String']>;
  supplier_starts_with?: Maybe<Scalars['String']>;
  supplier_not_starts_with?: Maybe<Scalars['String']>;
  supplier_ends_with?: Maybe<Scalars['String']>;
  supplier_not_ends_with?: Maybe<Scalars['String']>;
};

export enum SupplierInfoDidUpdateOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  INFODID = 'infoDID',
  TIMESTAMP = 'timestamp',
  SUPPLIER = 'supplier'
}

export type Token = {
  __typename?: 'Token';
  id: Scalars['ID'];
  symbol?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  decimals?: Maybe<Scalars['BigInt']>;
  transfers: Array<Maybe<TokenTransfer>>;
};


export type TokenTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenTransferFilter>;
};

export type TokenHistory = {
  __typename?: 'TokenHistory';
  id: Scalars['ID'];
  transaction: Transaction;
  sent?: Maybe<TokenTransfer>;
  received?: Maybe<TokenTransfer>;
  timestamp: Scalars['BigInt'];
  tokenHolder: TokenHolder;
};

export type TokenHistoryFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  sent?: Maybe<Scalars['String']>;
  sent_not?: Maybe<Scalars['String']>;
  sent_gt?: Maybe<Scalars['String']>;
  sent_lt?: Maybe<Scalars['String']>;
  sent_gte?: Maybe<Scalars['String']>;
  sent_lte?: Maybe<Scalars['String']>;
  sent_in?: Maybe<Array<Scalars['String']>>;
  sent_not_in?: Maybe<Array<Scalars['String']>>;
  sent_contains?: Maybe<Scalars['String']>;
  sent_not_contains?: Maybe<Scalars['String']>;
  sent_starts_with?: Maybe<Scalars['String']>;
  sent_not_starts_with?: Maybe<Scalars['String']>;
  sent_ends_with?: Maybe<Scalars['String']>;
  sent_not_ends_with?: Maybe<Scalars['String']>;
  received?: Maybe<Scalars['String']>;
  received_not?: Maybe<Scalars['String']>;
  received_gt?: Maybe<Scalars['String']>;
  received_lt?: Maybe<Scalars['String']>;
  received_gte?: Maybe<Scalars['String']>;
  received_lte?: Maybe<Scalars['String']>;
  received_in?: Maybe<Array<Scalars['String']>>;
  received_not_in?: Maybe<Array<Scalars['String']>>;
  received_contains?: Maybe<Scalars['String']>;
  received_not_contains?: Maybe<Scalars['String']>;
  received_starts_with?: Maybe<Scalars['String']>;
  received_not_starts_with?: Maybe<Scalars['String']>;
  received_ends_with?: Maybe<Scalars['String']>;
  received_not_ends_with?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenHolder?: Maybe<Scalars['String']>;
  tokenHolder_not?: Maybe<Scalars['String']>;
  tokenHolder_gt?: Maybe<Scalars['String']>;
  tokenHolder_lt?: Maybe<Scalars['String']>;
  tokenHolder_gte?: Maybe<Scalars['String']>;
  tokenHolder_lte?: Maybe<Scalars['String']>;
  tokenHolder_in?: Maybe<Array<Scalars['String']>>;
  tokenHolder_not_in?: Maybe<Array<Scalars['String']>>;
  tokenHolder_contains?: Maybe<Scalars['String']>;
  tokenHolder_not_contains?: Maybe<Scalars['String']>;
  tokenHolder_starts_with?: Maybe<Scalars['String']>;
  tokenHolder_not_starts_with?: Maybe<Scalars['String']>;
  tokenHolder_ends_with?: Maybe<Scalars['String']>;
  tokenHolder_not_ends_with?: Maybe<Scalars['String']>;
};

export enum TokenHistoryOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  SENT = 'sent',
  RECEIVED = 'received',
  TIMESTAMP = 'timestamp',
  TOKENHOLDER = 'tokenHolder'
}

export type TokenHolder = {
  __typename?: 'TokenHolder';
  id: Scalars['ID'];
  token: Token;
  account?: Maybe<Account>;
  safe?: Maybe<Safe>;
  balance: Scalars['BigInt'];
  sentTokens: Array<Maybe<TokenTransfer>>;
  receivedTokens: Array<Maybe<TokenTransfer>>;
  history: Array<Maybe<TokenHistory>>;
};


export type TokenHolderSentTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenTransferFilter>;
};


export type TokenHolderReceivedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenTransferFilter>;
};


export type TokenHolderHistoryArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHistoryOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenHistoryFilter>;
};

export type TokenHolderFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  safe?: Maybe<Scalars['String']>;
  safe_not?: Maybe<Scalars['String']>;
  safe_gt?: Maybe<Scalars['String']>;
  safe_lt?: Maybe<Scalars['String']>;
  safe_gte?: Maybe<Scalars['String']>;
  safe_lte?: Maybe<Scalars['String']>;
  safe_in?: Maybe<Array<Scalars['String']>>;
  safe_not_in?: Maybe<Array<Scalars['String']>>;
  safe_contains?: Maybe<Scalars['String']>;
  safe_not_contains?: Maybe<Scalars['String']>;
  safe_starts_with?: Maybe<Scalars['String']>;
  safe_not_starts_with?: Maybe<Scalars['String']>;
  safe_ends_with?: Maybe<Scalars['String']>;
  safe_not_ends_with?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['BigInt']>;
  balance_not?: Maybe<Scalars['BigInt']>;
  balance_gt?: Maybe<Scalars['BigInt']>;
  balance_lt?: Maybe<Scalars['BigInt']>;
  balance_gte?: Maybe<Scalars['BigInt']>;
  balance_lte?: Maybe<Scalars['BigInt']>;
  balance_in?: Maybe<Array<Scalars['BigInt']>>;
  balance_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum TokenHolderOrderBy {
  ID = 'id',
  TOKEN = 'token',
  ACCOUNT = 'account',
  SAFE = 'safe',
  BALANCE = 'balance',
  SENTTOKENS = 'sentTokens',
  RECEIVEDTOKENS = 'receivedTokens',
  HISTORY = 'history'
}

export type TokenPair = {
  __typename?: 'TokenPair';
  id: Scalars['ID'];
  token0: Token;
  token1: Token;
  swaps: Array<Maybe<TokenSwap>>;
};


export type TokenPairSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenSwapOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenSwapFilter>;
};

export type TokenPairFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  token0?: Maybe<Scalars['String']>;
  token0_not?: Maybe<Scalars['String']>;
  token0_gt?: Maybe<Scalars['String']>;
  token0_lt?: Maybe<Scalars['String']>;
  token0_gte?: Maybe<Scalars['String']>;
  token0_lte?: Maybe<Scalars['String']>;
  token0_in?: Maybe<Array<Scalars['String']>>;
  token0_not_in?: Maybe<Array<Scalars['String']>>;
  token0_contains?: Maybe<Scalars['String']>;
  token0_not_contains?: Maybe<Scalars['String']>;
  token0_starts_with?: Maybe<Scalars['String']>;
  token0_not_starts_with?: Maybe<Scalars['String']>;
  token0_ends_with?: Maybe<Scalars['String']>;
  token0_not_ends_with?: Maybe<Scalars['String']>;
  token1?: Maybe<Scalars['String']>;
  token1_not?: Maybe<Scalars['String']>;
  token1_gt?: Maybe<Scalars['String']>;
  token1_lt?: Maybe<Scalars['String']>;
  token1_gte?: Maybe<Scalars['String']>;
  token1_lte?: Maybe<Scalars['String']>;
  token1_in?: Maybe<Array<Scalars['String']>>;
  token1_not_in?: Maybe<Array<Scalars['String']>>;
  token1_contains?: Maybe<Scalars['String']>;
  token1_not_contains?: Maybe<Scalars['String']>;
  token1_starts_with?: Maybe<Scalars['String']>;
  token1_not_starts_with?: Maybe<Scalars['String']>;
  token1_ends_with?: Maybe<Scalars['String']>;
  token1_not_ends_with?: Maybe<Scalars['String']>;
};

export enum TokenPairOrderBy {
  ID = 'id',
  TOKEN0 = 'token0',
  TOKEN1 = 'token1',
  SWAPS = 'swaps'
}

export type TokenSwap = {
  __typename?: 'TokenSwap';
  id: Scalars['ID'];
  transaction: Transaction;
  timestamp: Scalars['BigInt'];
  tokenPair: TokenPair;
  to: Account;
  token0AmountIn: Scalars['BigInt'];
  token0AmountOut: Scalars['BigInt'];
  token1AmountIn: Scalars['BigInt'];
  token1AmountOut: Scalars['BigInt'];
};

export type TokenSwapFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenPair?: Maybe<Scalars['String']>;
  tokenPair_not?: Maybe<Scalars['String']>;
  tokenPair_gt?: Maybe<Scalars['String']>;
  tokenPair_lt?: Maybe<Scalars['String']>;
  tokenPair_gte?: Maybe<Scalars['String']>;
  tokenPair_lte?: Maybe<Scalars['String']>;
  tokenPair_in?: Maybe<Array<Scalars['String']>>;
  tokenPair_not_in?: Maybe<Array<Scalars['String']>>;
  tokenPair_contains?: Maybe<Scalars['String']>;
  tokenPair_not_contains?: Maybe<Scalars['String']>;
  tokenPair_starts_with?: Maybe<Scalars['String']>;
  tokenPair_not_starts_with?: Maybe<Scalars['String']>;
  tokenPair_ends_with?: Maybe<Scalars['String']>;
  tokenPair_not_ends_with?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  to_not?: Maybe<Scalars['String']>;
  to_gt?: Maybe<Scalars['String']>;
  to_lt?: Maybe<Scalars['String']>;
  to_gte?: Maybe<Scalars['String']>;
  to_lte?: Maybe<Scalars['String']>;
  to_in?: Maybe<Array<Scalars['String']>>;
  to_not_in?: Maybe<Array<Scalars['String']>>;
  to_contains?: Maybe<Scalars['String']>;
  to_not_contains?: Maybe<Scalars['String']>;
  to_starts_with?: Maybe<Scalars['String']>;
  to_not_starts_with?: Maybe<Scalars['String']>;
  to_ends_with?: Maybe<Scalars['String']>;
  to_not_ends_with?: Maybe<Scalars['String']>;
  token0AmountIn?: Maybe<Scalars['BigInt']>;
  token0AmountIn_not?: Maybe<Scalars['BigInt']>;
  token0AmountIn_gt?: Maybe<Scalars['BigInt']>;
  token0AmountIn_lt?: Maybe<Scalars['BigInt']>;
  token0AmountIn_gte?: Maybe<Scalars['BigInt']>;
  token0AmountIn_lte?: Maybe<Scalars['BigInt']>;
  token0AmountIn_in?: Maybe<Array<Scalars['BigInt']>>;
  token0AmountIn_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token0AmountOut?: Maybe<Scalars['BigInt']>;
  token0AmountOut_not?: Maybe<Scalars['BigInt']>;
  token0AmountOut_gt?: Maybe<Scalars['BigInt']>;
  token0AmountOut_lt?: Maybe<Scalars['BigInt']>;
  token0AmountOut_gte?: Maybe<Scalars['BigInt']>;
  token0AmountOut_lte?: Maybe<Scalars['BigInt']>;
  token0AmountOut_in?: Maybe<Array<Scalars['BigInt']>>;
  token0AmountOut_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token1AmountIn?: Maybe<Scalars['BigInt']>;
  token1AmountIn_not?: Maybe<Scalars['BigInt']>;
  token1AmountIn_gt?: Maybe<Scalars['BigInt']>;
  token1AmountIn_lt?: Maybe<Scalars['BigInt']>;
  token1AmountIn_gte?: Maybe<Scalars['BigInt']>;
  token1AmountIn_lte?: Maybe<Scalars['BigInt']>;
  token1AmountIn_in?: Maybe<Array<Scalars['BigInt']>>;
  token1AmountIn_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token1AmountOut?: Maybe<Scalars['BigInt']>;
  token1AmountOut_not?: Maybe<Scalars['BigInt']>;
  token1AmountOut_gt?: Maybe<Scalars['BigInt']>;
  token1AmountOut_lt?: Maybe<Scalars['BigInt']>;
  token1AmountOut_gte?: Maybe<Scalars['BigInt']>;
  token1AmountOut_lte?: Maybe<Scalars['BigInt']>;
  token1AmountOut_in?: Maybe<Array<Scalars['BigInt']>>;
  token1AmountOut_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum TokenSwapOrderBy {
  ID = 'id',
  TRANSACTION = 'transaction',
  TIMESTAMP = 'timestamp',
  TOKENPAIR = 'tokenPair',
  TO = 'to',
  TOKEN0AMOUNTIN = 'token0AmountIn',
  TOKEN0AMOUNTOUT = 'token0AmountOut',
  TOKEN1AMOUNTIN = 'token1AmountIn',
  TOKEN1AMOUNTOUT = 'token1AmountOut'
}

export type TokenTransfer = {
  __typename?: 'TokenTransfer';
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  token: Token;
  amount: Scalars['BigInt'];
  fromTokenHolder?: Maybe<TokenHolder>;
  toTokenHolder?: Maybe<TokenHolder>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
};

export type TokenTransferFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  fromTokenHolder?: Maybe<Scalars['String']>;
  fromTokenHolder_not?: Maybe<Scalars['String']>;
  fromTokenHolder_gt?: Maybe<Scalars['String']>;
  fromTokenHolder_lt?: Maybe<Scalars['String']>;
  fromTokenHolder_gte?: Maybe<Scalars['String']>;
  fromTokenHolder_lte?: Maybe<Scalars['String']>;
  fromTokenHolder_in?: Maybe<Array<Scalars['String']>>;
  fromTokenHolder_not_in?: Maybe<Array<Scalars['String']>>;
  fromTokenHolder_contains?: Maybe<Scalars['String']>;
  fromTokenHolder_not_contains?: Maybe<Scalars['String']>;
  fromTokenHolder_starts_with?: Maybe<Scalars['String']>;
  fromTokenHolder_not_starts_with?: Maybe<Scalars['String']>;
  fromTokenHolder_ends_with?: Maybe<Scalars['String']>;
  fromTokenHolder_not_ends_with?: Maybe<Scalars['String']>;
  toTokenHolder?: Maybe<Scalars['String']>;
  toTokenHolder_not?: Maybe<Scalars['String']>;
  toTokenHolder_gt?: Maybe<Scalars['String']>;
  toTokenHolder_lt?: Maybe<Scalars['String']>;
  toTokenHolder_gte?: Maybe<Scalars['String']>;
  toTokenHolder_lte?: Maybe<Scalars['String']>;
  toTokenHolder_in?: Maybe<Array<Scalars['String']>>;
  toTokenHolder_not_in?: Maybe<Array<Scalars['String']>>;
  toTokenHolder_contains?: Maybe<Scalars['String']>;
  toTokenHolder_not_contains?: Maybe<Scalars['String']>;
  toTokenHolder_starts_with?: Maybe<Scalars['String']>;
  toTokenHolder_not_starts_with?: Maybe<Scalars['String']>;
  toTokenHolder_ends_with?: Maybe<Scalars['String']>;
  toTokenHolder_not_ends_with?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  from_not?: Maybe<Scalars['String']>;
  from_gt?: Maybe<Scalars['String']>;
  from_lt?: Maybe<Scalars['String']>;
  from_gte?: Maybe<Scalars['String']>;
  from_lte?: Maybe<Scalars['String']>;
  from_in?: Maybe<Array<Scalars['String']>>;
  from_not_in?: Maybe<Array<Scalars['String']>>;
  from_contains?: Maybe<Scalars['String']>;
  from_not_contains?: Maybe<Scalars['String']>;
  from_starts_with?: Maybe<Scalars['String']>;
  from_not_starts_with?: Maybe<Scalars['String']>;
  from_ends_with?: Maybe<Scalars['String']>;
  from_not_ends_with?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  to_not?: Maybe<Scalars['String']>;
  to_gt?: Maybe<Scalars['String']>;
  to_lt?: Maybe<Scalars['String']>;
  to_gte?: Maybe<Scalars['String']>;
  to_lte?: Maybe<Scalars['String']>;
  to_in?: Maybe<Array<Scalars['String']>>;
  to_not_in?: Maybe<Array<Scalars['String']>>;
  to_contains?: Maybe<Scalars['String']>;
  to_not_contains?: Maybe<Scalars['String']>;
  to_starts_with?: Maybe<Scalars['String']>;
  to_not_starts_with?: Maybe<Scalars['String']>;
  to_ends_with?: Maybe<Scalars['String']>;
  to_not_ends_with?: Maybe<Scalars['String']>;
};

export enum TokenTransferOrderBy {
  ID = 'id',
  TIMESTAMP = 'timestamp',
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  AMOUNT = 'amount',
  FROMTOKENHOLDER = 'fromTokenHolder',
  TOTOKENHOLDER = 'toTokenHolder',
  FROM = 'from',
  TO = 'to'
}

export type TokenFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  symbol?: Maybe<Scalars['String']>;
  symbol_not?: Maybe<Scalars['String']>;
  symbol_gt?: Maybe<Scalars['String']>;
  symbol_lt?: Maybe<Scalars['String']>;
  symbol_gte?: Maybe<Scalars['String']>;
  symbol_lte?: Maybe<Scalars['String']>;
  symbol_in?: Maybe<Array<Scalars['String']>>;
  symbol_not_in?: Maybe<Array<Scalars['String']>>;
  symbol_contains?: Maybe<Scalars['String']>;
  symbol_not_contains?: Maybe<Scalars['String']>;
  symbol_starts_with?: Maybe<Scalars['String']>;
  symbol_not_starts_with?: Maybe<Scalars['String']>;
  symbol_ends_with?: Maybe<Scalars['String']>;
  symbol_not_ends_with?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  decimals?: Maybe<Scalars['BigInt']>;
  decimals_not?: Maybe<Scalars['BigInt']>;
  decimals_gt?: Maybe<Scalars['BigInt']>;
  decimals_lt?: Maybe<Scalars['BigInt']>;
  decimals_gte?: Maybe<Scalars['BigInt']>;
  decimals_lte?: Maybe<Scalars['BigInt']>;
  decimals_in?: Maybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum TokenOrderBy {
  ID = 'id',
  SYMBOL = 'symbol',
  NAME = 'name',
  DECIMALS = 'decimals',
  TRANSFERS = 'transfers'
}

export type Transaction = {
  __typename?: 'Transaction';
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  safeTxns: Array<Maybe<SafeTransaction>>;
  bridgeToLayer1Events: Array<Maybe<BridgeToLayer1Event>>;
  bridgeToLayer2Events: Array<Maybe<BridgeToLayer2Event>>;
  supplierInfoDIDUpdates: Array<Maybe<SupplierInfoDidUpdate>>;
  prepaidCardCreations: Array<Maybe<PrepaidCardCreation>>;
  prepaidCardTransfers: Array<Maybe<PrepaidCardTransfer>>;
  tokenTransfers: Array<Maybe<TokenTransfer>>;
  merchantCreations: Array<Maybe<MerchantCreation>>;
  merchantRegistrationPayments: Array<Maybe<MerchantRegistrationPayment>>;
  prepaidCardPayments: Array<Maybe<PrepaidCardPayment>>;
  prepaidCardSplits: Array<Maybe<PrepaidCardSplit>>;
  spendAccumulations: Array<Maybe<SpendAccumulation>>;
  merchantFeePayments: Array<Maybe<MerchantFeePayment>>;
  merchantClaims: Array<Maybe<MerchantClaim>>;
  merchantRevenueEvents: Array<Maybe<MerchantRevenueEvent>>;
  tokenSwaps: Array<Maybe<TokenSwap>>;
};


export type TransactionSafeTxnsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SafeTransactionOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SafeTransactionFilter>;
};


export type TransactionBridgeToLayer1EventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer1EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer1EventFilter>;
};


export type TransactionBridgeToLayer2EventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BridgeToLayer2EventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BridgeToLayer2EventFilter>;
};


export type TransactionSupplierInfoDidUpdatesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SupplierInfoDidUpdateOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SupplierInfoDidUpdateFilter>;
};


export type TransactionPrepaidCardCreationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardCreationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardCreationFilter>;
};


export type TransactionPrepaidCardTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardTransferFilter>;
};


export type TransactionTokenTransfersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenTransferOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenTransferFilter>;
};


export type TransactionMerchantCreationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantCreationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantCreationFilter>;
};


export type TransactionMerchantRegistrationPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRegistrationPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRegistrationPaymentFilter>;
};


export type TransactionPrepaidCardPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardPaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardPaymentFilter>;
};


export type TransactionPrepaidCardSplitsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PrepaidCardSplitOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PrepaidCardSplitFilter>;
};


export type TransactionSpendAccumulationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SpendAccumulationOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SpendAccumulationFilter>;
};


export type TransactionMerchantFeePaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantFeePaymentOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantFeePaymentFilter>;
};


export type TransactionMerchantClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantClaimOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantClaimFilter>;
};


export type TransactionMerchantRevenueEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerchantRevenueEventOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerchantRevenueEventFilter>;
};


export type TransactionTokenSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenSwapOrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenSwapFilter>;
};

export type TransactionFilter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum TransactionOrderBy {
  ID = 'id',
  TIMESTAMP = 'timestamp',
  BLOCKNUMBER = 'blockNumber',
  SAFETXNS = 'safeTxns',
  BRIDGETOLAYER1EVENTS = 'bridgeToLayer1Events',
  BRIDGETOLAYER2EVENTS = 'bridgeToLayer2Events',
  SUPPLIERINFODIDUPDATES = 'supplierInfoDIDUpdates',
  PREPAIDCARDCREATIONS = 'prepaidCardCreations',
  PREPAIDCARDTRANSFERS = 'prepaidCardTransfers',
  TOKENTRANSFERS = 'tokenTransfers',
  MERCHANTCREATIONS = 'merchantCreations',
  MERCHANTREGISTRATIONPAYMENTS = 'merchantRegistrationPayments',
  PREPAIDCARDPAYMENTS = 'prepaidCardPayments',
  PREPAIDCARDSPLITS = 'prepaidCardSplits',
  SPENDACCUMULATIONS = 'spendAccumulations',
  MERCHANTFEEPAYMENTS = 'merchantFeePayments',
  MERCHANTCLAIMS = 'merchantClaims',
  MERCHANTREVENUEEVENTS = 'merchantRevenueEvents',
  TOKENSWAPS = 'tokenSwaps'
}

export type Block = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type Meta = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: Block;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum SubgraphErrorPolicy {
  /** Data will be returned even if the subgraph has indexing errors */
  ALLOW = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  DENY = 'deny'
}

export type PrepaidCardCreationFragment = (
  { __typename?: 'PrepaidCardCreation' }
  & Pick<PrepaidCardCreation, 'id' | 'createdAt' | 'issuingTokenAmount' | 'spendAmount' | 'createdFromAddress'>
  & { issuingToken: (
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name'>
  ), issuer: (
    { __typename?: 'Account' }
    & Pick<Account, 'id'>
  ), prepaidCard: (
    { __typename?: 'PrepaidCard' }
    & Pick<PrepaidCard, 'id' | 'customizationDID'>
  ) }
);

export type PrepaidCardPaymentFragment = (
  { __typename?: 'PrepaidCardPayment' }
  & Pick<PrepaidCardPayment, 'id' | 'timestamp' | 'spendAmount' | 'issuingTokenAmount' | 'issuingTokenUSDPrice'>
  & { issuingToken: (
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name'>
  ), prepaidCard: (
    { __typename?: 'PrepaidCard' }
    & Pick<PrepaidCard, 'id' | 'customizationDID'>
  ), merchantSafe?: Maybe<(
    { __typename?: 'MerchantSafe' }
    & Pick<MerchantSafe, 'id' | 'infoDid'>
  )>, transaction: (
    { __typename?: 'Transaction' }
    & { merchantFeePayments: Array<Maybe<(
      { __typename?: 'MerchantFeePayment' }
      & Pick<MerchantFeePayment, 'feeCollected'>
      & { issuingToken: (
        { __typename?: 'Token' }
        & Pick<Token, 'symbol'>
      ) }
    )>> }
  ) }
);

export type BridgeToLayer1EventFragment = (
  { __typename?: 'BridgeToLayer1Event' }
  & Pick<BridgeToLayer1Event, 'amount' | 'timestamp'>
  & { token: (
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name'>
  ), account: (
    { __typename?: 'Account' }
    & Pick<Account, 'id'>
  ) }
);

export type BridgeToLayer2EventFragment = (
  { __typename?: 'BridgeToLayer2Event' }
  & Pick<BridgeToLayer2Event, 'amount' | 'timestamp'>
  & { token: (
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name'>
  ), depot: (
    { __typename?: 'Depot' }
    & Pick<Depot, 'id'>
  ) }
);

export type MerchantCreationFragment = (
  { __typename?: 'MerchantCreation' }
  & Pick<MerchantCreation, 'id' | 'createdAt'>
  & { merchantSafe: (
    { __typename?: 'MerchantSafe' }
    & Pick<MerchantSafe, 'infoDid'>
  ) }
);

export type TokenTransferFragment = (
  { __typename?: 'TokenTransfer' }
  & Pick<TokenTransfer, 'id' | 'timestamp' | 'amount' | 'from' | 'to'>
  & { token: (
    { __typename?: 'Token' }
    & Pick<Token, 'symbol' | 'name' | 'id'>
  ) }
);

export type PrepaidCardSplitFragment = (
  { __typename?: 'PrepaidCardSplit' }
  & Pick<PrepaidCardSplit, 'id' | 'timestamp' | 'faceValues' | 'issuingTokenAmounts'>
  & { prepaidCard: (
    { __typename?: 'PrepaidCard' }
    & Pick<PrepaidCard, 'id' | 'customizationDID'>
  ) }
);

export type PrepaidCardTransferFragment = (
  { __typename?: 'PrepaidCardTransfer' }
  & Pick<PrepaidCardTransfer, 'id' | 'timestamp'>
  & { prepaidCard: (
    { __typename?: 'PrepaidCard' }
    & Pick<PrepaidCard, 'id' | 'customizationDID' | 'faceValue'>
  ), from: (
    { __typename?: 'Account' }
    & Pick<Account, 'id'>
  ), to: (
    { __typename?: 'Account' }
    & Pick<Account, 'id'>
  ) }
);

export type MerchantClaimFragment = (
  { __typename?: 'MerchantClaim' }
  & Pick<MerchantClaim, 'id' | 'timestamp' | 'amount'>
  & { token: (
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
  ), transaction: (
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id'>
    & { tokenTransfers: Array<Maybe<(
      { __typename?: 'TokenTransfer' }
      & Pick<TokenTransfer, 'amount'>
      & { fromTokenHolder?: Maybe<(
        { __typename?: 'TokenHolder' }
        & Pick<TokenHolder, 'id'>
      )>, toTokenHolder?: Maybe<(
        { __typename?: 'TokenHolder' }
        & Pick<TokenHolder, 'id'>
      )>, token: (
        { __typename?: 'Token' }
        & Pick<Token, 'symbol'>
      ) }
    )>> }
  ), merchantSafe: (
    { __typename?: 'MerchantSafe' }
    & Pick<MerchantSafe, 'id' | 'infoDid'>
  ) }
);

export type MerchantRevenueEventFragment = (
  { __typename?: 'MerchantRevenueEvent' }
  & Pick<MerchantRevenueEvent, 'id' | 'timestamp' | 'historicLifetimeAccumulation' | 'historicUnclaimedBalance'>
  & { prepaidCardPayment?: Maybe<(
    { __typename?: 'PrepaidCardPayment' }
    & PrepaidCardPaymentFragment
  )>, merchantClaim?: Maybe<(
    { __typename?: 'MerchantClaim' }
    & MerchantClaimFragment
  )> }
);

export type TransactionFragment = (
  { __typename?: 'Transaction' }
  & Pick<Transaction, 'id' | 'timestamp'>
  & { bridgeToLayer1Events: Array<Maybe<(
    { __typename?: 'BridgeToLayer1Event' }
    & BridgeToLayer1EventFragment
  )>>, bridgeToLayer2Events: Array<Maybe<(
    { __typename?: 'BridgeToLayer2Event' }
    & BridgeToLayer2EventFragment
  )>>, supplierInfoDIDUpdates: Array<Maybe<(
    { __typename?: 'SupplierInfoDIDUpdate' }
    & Pick<SupplierInfoDidUpdate, 'id'>
  )>>, prepaidCardCreations: Array<Maybe<(
    { __typename?: 'PrepaidCardCreation' }
    & PrepaidCardCreationFragment
  )>>, prepaidCardTransfers: Array<Maybe<(
    { __typename?: 'PrepaidCardTransfer' }
    & PrepaidCardTransferFragment
  )>>, prepaidCardSplits: Array<Maybe<(
    { __typename?: 'PrepaidCardSplit' }
    & PrepaidCardSplitFragment
  )>>, tokenTransfers: Array<Maybe<(
    { __typename?: 'TokenTransfer' }
    & TokenTransferFragment
  )>>, merchantCreations: Array<Maybe<(
    { __typename?: 'MerchantCreation' }
    & MerchantCreationFragment
  )>>, merchantRegistrationPayments: Array<Maybe<(
    { __typename?: 'MerchantRegistrationPayment' }
    & Pick<MerchantRegistrationPayment, 'id'>
  )>>, prepaidCardPayments: Array<Maybe<(
    { __typename?: 'PrepaidCardPayment' }
    & PrepaidCardPaymentFragment
  )>>, spendAccumulations: Array<Maybe<(
    { __typename?: 'SpendAccumulation' }
    & Pick<SpendAccumulation, 'id'>
  )>>, merchantFeePayments: Array<Maybe<(
    { __typename?: 'MerchantFeePayment' }
    & Pick<MerchantFeePayment, 'id'>
  )>>, merchantClaims: Array<Maybe<(
    { __typename?: 'MerchantClaim' }
    & MerchantClaimFragment
  )>>, tokenSwaps: Array<Maybe<(
    { __typename?: 'TokenSwap' }
    & Pick<TokenSwap, 'id'>
  )>> }
);

export type GetMerchantSafeQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetMerchantSafeQuery = (
  { __typename?: 'Query' }
  & { merchantSafe?: Maybe<(
    { __typename?: 'MerchantSafe' }
    & Pick<MerchantSafe, 'id'>
    & { merchantRevenue: Array<Maybe<(
      { __typename?: 'MerchantRevenue' }
      & Pick<MerchantRevenue, 'id' | 'lifetimeAccumulation' | 'unclaimedBalance'>
      & { revenueEvents: Array<Maybe<(
        { __typename?: 'MerchantRevenueEvent' }
        & MerchantRevenueEventFragment
      )>> }
    )>> }
  )> }
);

export type GetAccountTransactionHistoryDataQueryVariables = Exact<{
  address: Scalars['ID'];
  skip?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}>;


export type GetAccountTransactionHistoryDataQuery = (
  { __typename?: 'Query' }
  & { account?: Maybe<(
    { __typename?: 'Account' }
    & Pick<Account, 'id'>
    & { transactions: Array<Maybe<(
      { __typename?: 'EOATransaction' }
      & Pick<EoaTransaction, 'timestamp'>
      & { transaction: (
        { __typename?: 'Transaction' }
        & TransactionFragment
      ) }
    )>> }
  )> }
);

export type GetDepotTransactionHistoryDataQueryVariables = Exact<{
  address: Scalars['ID'];
  skip?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}>;


export type GetDepotTransactionHistoryDataQuery = (
  { __typename?: 'Query' }
  & { safe?: Maybe<(
    { __typename?: 'Safe' }
    & Pick<Safe, 'id'>
    & { safeTxns: Array<Maybe<(
      { __typename?: 'SafeTransaction' }
      & Pick<SafeTransaction, 'timestamp'>
      & { transaction: (
        { __typename?: 'Transaction' }
        & TransactionFragment
      ) }
    )>> }
  )> }
);

export type GetMerchantTransactionHistoryDataQueryVariables = Exact<{
  address: Scalars['ID'];
  skip?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}>;


export type GetMerchantTransactionHistoryDataQuery = (
  { __typename?: 'Query' }
  & { merchantSafe?: Maybe<(
    { __typename?: 'MerchantSafe' }
    & Pick<MerchantSafe, 'id'>
    & { merchantRevenue: Array<Maybe<(
      { __typename?: 'MerchantRevenue' }
      & Pick<MerchantRevenue, 'id'>
      & { revenueEvents: Array<Maybe<(
        { __typename?: 'MerchantRevenueEvent' }
        & MerchantRevenueEventFragment
      )>> }
    )>> }
  )> }
);

export type GetPrepaidCardHistoryDataQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetPrepaidCardHistoryDataQuery = (
  { __typename?: 'Query' }
  & { safe?: Maybe<(
    { __typename?: 'Safe' }
    & { prepaidCard?: Maybe<(
      { __typename?: 'PrepaidCard' }
      & { payments: Array<Maybe<(
        { __typename?: 'PrepaidCardPayment' }
        & { transaction: (
          { __typename?: 'Transaction' }
          & TransactionFragment
        ) }
      )>>, splits: Array<Maybe<(
        { __typename?: 'PrepaidCardSplit' }
        & { transaction: (
          { __typename?: 'Transaction' }
          & TransactionFragment
        ) }
      )>>, transfers: Array<Maybe<(
        { __typename?: 'PrepaidCardTransfer' }
        & { transaction: (
          { __typename?: 'Transaction' }
          & TransactionFragment
        ) }
      )>>, creation?: Maybe<(
        { __typename?: 'PrepaidCardCreation' }
        & { transaction: (
          { __typename?: 'Transaction' }
          & TransactionFragment
        ) }
      )> }
    )> }
  )> }
);

export type GetLifetimeEarningsAccumulationsQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetLifetimeEarningsAccumulationsQuery = (
  { __typename?: 'Query' }
  & { merchantSafe?: Maybe<(
    { __typename?: 'MerchantSafe' }
    & Pick<MerchantSafe, 'id'>
    & { spendAccumulations: Array<Maybe<(
      { __typename?: 'SpendAccumulation' }
      & Pick<SpendAccumulation, 'timestamp' | 'amount' | 'historicSpendBalance'>
    )>> }
  )> }
);

export const PrepaidCardPaymentFragmentDoc = gql`
    fragment PrepaidCardPayment on PrepaidCardPayment {
  id
  timestamp
  spendAmount
  issuingTokenAmount
  issuingTokenUSDPrice
  issuingToken {
    id
    symbol
    name
  }
  prepaidCard {
    id
    customizationDID
  }
  merchantSafe {
    id
    infoDid
  }
  transaction {
    merchantFeePayments {
      feeCollected
      issuingToken {
        symbol
      }
    }
  }
}
    `;
export const MerchantClaimFragmentDoc = gql`
    fragment MerchantClaim on MerchantClaim {
  id
  timestamp
  token {
    id
    symbol
    name
    decimals
  }
  amount
  transaction {
    id
    tokenTransfers {
      amount
      fromTokenHolder {
        id
      }
      toTokenHolder {
        id
      }
      token {
        symbol
      }
    }
  }
  merchantSafe {
    id
    infoDid
  }
}
    `;
export const MerchantRevenueEventFragmentDoc = gql`
    fragment MerchantRevenueEvent on MerchantRevenueEvent {
  id
  timestamp
  historicLifetimeAccumulation
  historicUnclaimedBalance
  prepaidCardPayment {
    ...PrepaidCardPayment
  }
  merchantClaim {
    ...MerchantClaim
  }
}
    ${PrepaidCardPaymentFragmentDoc}
${MerchantClaimFragmentDoc}`;
export const BridgeToLayer1EventFragmentDoc = gql`
    fragment BridgeToLayer1Event on BridgeToLayer1Event {
  amount
  token {
    id
    symbol
    name
  }
  account {
    id
  }
  timestamp
}
    `;
export const BridgeToLayer2EventFragmentDoc = gql`
    fragment BridgeToLayer2Event on BridgeToLayer2Event {
  amount
  token {
    id
    symbol
    name
  }
  timestamp
  depot {
    id
  }
}
    `;
export const PrepaidCardCreationFragmentDoc = gql`
    fragment PrepaidCardCreation on PrepaidCardCreation {
  id
  createdAt
  issuingToken {
    id
    symbol
    name
  }
  issuingTokenAmount
  spendAmount
  createdFromAddress
  issuer {
    id
  }
  prepaidCard {
    id
    customizationDID
  }
}
    `;
export const PrepaidCardTransferFragmentDoc = gql`
    fragment PrepaidCardTransfer on PrepaidCardTransfer {
  id
  timestamp
  prepaidCard {
    id
    customizationDID
    faceValue
  }
  from {
    id
  }
  to {
    id
  }
}
    `;
export const PrepaidCardSplitFragmentDoc = gql`
    fragment PrepaidCardSplit on PrepaidCardSplit {
  id
  timestamp
  prepaidCard {
    id
    customizationDID
  }
  faceValues
  issuingTokenAmounts
}
    `;
export const TokenTransferFragmentDoc = gql`
    fragment TokenTransfer on TokenTransfer {
  id
  timestamp
  amount
  token {
    symbol
    name
    id
  }
  from
  to
}
    `;
export const MerchantCreationFragmentDoc = gql`
    fragment MerchantCreation on MerchantCreation {
  id
  createdAt
  merchantSafe {
    infoDid
  }
}
    `;
export const TransactionFragmentDoc = gql`
    fragment Transaction on Transaction {
  id
  timestamp
  bridgeToLayer1Events {
    ...BridgeToLayer1Event
  }
  bridgeToLayer2Events {
    ...BridgeToLayer2Event
  }
  supplierInfoDIDUpdates {
    id
  }
  prepaidCardCreations {
    ...PrepaidCardCreation
  }
  prepaidCardTransfers {
    ...PrepaidCardTransfer
  }
  prepaidCardSplits {
    ...PrepaidCardSplit
  }
  tokenTransfers {
    ...TokenTransfer
  }
  merchantCreations {
    ...MerchantCreation
  }
  merchantRegistrationPayments {
    id
  }
  prepaidCardPayments {
    ...PrepaidCardPayment
  }
  spendAccumulations {
    id
  }
  merchantFeePayments {
    id
  }
  merchantClaims {
    ...MerchantClaim
  }
  tokenSwaps {
    id
  }
}
    ${BridgeToLayer1EventFragmentDoc}
${BridgeToLayer2EventFragmentDoc}
${PrepaidCardCreationFragmentDoc}
${PrepaidCardTransferFragmentDoc}
${PrepaidCardSplitFragmentDoc}
${TokenTransferFragmentDoc}
${MerchantCreationFragmentDoc}
${PrepaidCardPaymentFragmentDoc}
${MerchantClaimFragmentDoc}`;
export const GetMerchantSafeDocument = gql`
    query GetMerchantSafe($address: ID!) {
  merchantSafe(id: $address) {
    id
    merchantRevenue {
      id
      lifetimeAccumulation
      unclaimedBalance
      revenueEvents {
        ...MerchantRevenueEvent
      }
    }
  }
}
    ${MerchantRevenueEventFragmentDoc}`;

/**
 * __useGetMerchantSafeQuery__
 *
 * To run a query within a React component, call `useGetMerchantSafeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMerchantSafeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMerchantSafeQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetMerchantSafeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMerchantSafeQuery, GetMerchantSafeQueryVariables>) {
        return ApolloReactHooks.useQuery<GetMerchantSafeQuery, GetMerchantSafeQueryVariables>(GetMerchantSafeDocument, baseOptions);
      }
export function useGetMerchantSafeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMerchantSafeQuery, GetMerchantSafeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetMerchantSafeQuery, GetMerchantSafeQueryVariables>(GetMerchantSafeDocument, baseOptions);
        }
export type GetMerchantSafeQueryHookResult = ReturnType<typeof useGetMerchantSafeQuery>;
export type GetMerchantSafeLazyQueryHookResult = ReturnType<typeof useGetMerchantSafeLazyQuery>;
export type GetMerchantSafeQueryResult = ApolloReactCommon.QueryResult<GetMerchantSafeQuery, GetMerchantSafeQueryVariables>;
export const GetAccountTransactionHistoryDataDocument = gql`
    query GetAccountTransactionHistoryData($address: ID!, $skip: Int = 0, $pageSize: Int = 25) {
  account(id: $address) {
    id
    transactions(first: $pageSize, skip: $skip, orderBy: timestamp, orderDirection: desc) {
      timestamp
      transaction {
        ...Transaction
      }
    }
  }
}
    ${TransactionFragmentDoc}`;

/**
 * __useGetAccountTransactionHistoryDataQuery__
 *
 * To run a query within a React component, call `useGetAccountTransactionHistoryDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountTransactionHistoryDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountTransactionHistoryDataQuery({
 *   variables: {
 *      address: // value for 'address'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useGetAccountTransactionHistoryDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAccountTransactionHistoryDataQuery, GetAccountTransactionHistoryDataQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAccountTransactionHistoryDataQuery, GetAccountTransactionHistoryDataQueryVariables>(GetAccountTransactionHistoryDataDocument, baseOptions);
      }
export function useGetAccountTransactionHistoryDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAccountTransactionHistoryDataQuery, GetAccountTransactionHistoryDataQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAccountTransactionHistoryDataQuery, GetAccountTransactionHistoryDataQueryVariables>(GetAccountTransactionHistoryDataDocument, baseOptions);
        }
export type GetAccountTransactionHistoryDataQueryHookResult = ReturnType<typeof useGetAccountTransactionHistoryDataQuery>;
export type GetAccountTransactionHistoryDataLazyQueryHookResult = ReturnType<typeof useGetAccountTransactionHistoryDataLazyQuery>;
export type GetAccountTransactionHistoryDataQueryResult = ApolloReactCommon.QueryResult<GetAccountTransactionHistoryDataQuery, GetAccountTransactionHistoryDataQueryVariables>;
export const GetDepotTransactionHistoryDataDocument = gql`
    query GetDepotTransactionHistoryData($address: ID!, $skip: Int = 0, $pageSize: Int = 25) {
  safe(id: $address) {
    id
    safeTxns(first: $pageSize, skip: $skip, orderBy: timestamp, orderDirection: desc) {
      timestamp
      transaction {
        ...Transaction
      }
    }
  }
}
    ${TransactionFragmentDoc}`;

/**
 * __useGetDepotTransactionHistoryDataQuery__
 *
 * To run a query within a React component, call `useGetDepotTransactionHistoryDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDepotTransactionHistoryDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDepotTransactionHistoryDataQuery({
 *   variables: {
 *      address: // value for 'address'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useGetDepotTransactionHistoryDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetDepotTransactionHistoryDataQuery, GetDepotTransactionHistoryDataQueryVariables>) {
        return ApolloReactHooks.useQuery<GetDepotTransactionHistoryDataQuery, GetDepotTransactionHistoryDataQueryVariables>(GetDepotTransactionHistoryDataDocument, baseOptions);
      }
export function useGetDepotTransactionHistoryDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDepotTransactionHistoryDataQuery, GetDepotTransactionHistoryDataQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetDepotTransactionHistoryDataQuery, GetDepotTransactionHistoryDataQueryVariables>(GetDepotTransactionHistoryDataDocument, baseOptions);
        }
export type GetDepotTransactionHistoryDataQueryHookResult = ReturnType<typeof useGetDepotTransactionHistoryDataQuery>;
export type GetDepotTransactionHistoryDataLazyQueryHookResult = ReturnType<typeof useGetDepotTransactionHistoryDataLazyQuery>;
export type GetDepotTransactionHistoryDataQueryResult = ApolloReactCommon.QueryResult<GetDepotTransactionHistoryDataQuery, GetDepotTransactionHistoryDataQueryVariables>;
export const GetMerchantTransactionHistoryDataDocument = gql`
    query GetMerchantTransactionHistoryData($address: ID!, $skip: Int = 0, $pageSize: Int = 25) {
  merchantSafe(id: $address) {
    id
    merchantRevenue {
      id
      revenueEvents(first: $pageSize, skip: $skip, orderBy: timestamp, orderDirection: desc) {
        ...MerchantRevenueEvent
      }
    }
  }
}
    ${MerchantRevenueEventFragmentDoc}`;

/**
 * __useGetMerchantTransactionHistoryDataQuery__
 *
 * To run a query within a React component, call `useGetMerchantTransactionHistoryDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMerchantTransactionHistoryDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMerchantTransactionHistoryDataQuery({
 *   variables: {
 *      address: // value for 'address'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useGetMerchantTransactionHistoryDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetMerchantTransactionHistoryDataQuery, GetMerchantTransactionHistoryDataQueryVariables>) {
        return ApolloReactHooks.useQuery<GetMerchantTransactionHistoryDataQuery, GetMerchantTransactionHistoryDataQueryVariables>(GetMerchantTransactionHistoryDataDocument, baseOptions);
      }
export function useGetMerchantTransactionHistoryDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetMerchantTransactionHistoryDataQuery, GetMerchantTransactionHistoryDataQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetMerchantTransactionHistoryDataQuery, GetMerchantTransactionHistoryDataQueryVariables>(GetMerchantTransactionHistoryDataDocument, baseOptions);
        }
export type GetMerchantTransactionHistoryDataQueryHookResult = ReturnType<typeof useGetMerchantTransactionHistoryDataQuery>;
export type GetMerchantTransactionHistoryDataLazyQueryHookResult = ReturnType<typeof useGetMerchantTransactionHistoryDataLazyQuery>;
export type GetMerchantTransactionHistoryDataQueryResult = ApolloReactCommon.QueryResult<GetMerchantTransactionHistoryDataQuery, GetMerchantTransactionHistoryDataQueryVariables>;
export const GetPrepaidCardHistoryDataDocument = gql`
    query GetPrepaidCardHistoryData($address: ID!) {
  safe(id: $address) {
    prepaidCard {
      payments {
        transaction {
          ...Transaction
        }
      }
      splits {
        transaction {
          ...Transaction
        }
      }
      transfers {
        transaction {
          ...Transaction
        }
      }
      creation {
        transaction {
          ...Transaction
        }
      }
    }
  }
}
    ${TransactionFragmentDoc}`;

/**
 * __useGetPrepaidCardHistoryDataQuery__
 *
 * To run a query within a React component, call `useGetPrepaidCardHistoryDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPrepaidCardHistoryDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPrepaidCardHistoryDataQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetPrepaidCardHistoryDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetPrepaidCardHistoryDataQuery, GetPrepaidCardHistoryDataQueryVariables>) {
        return ApolloReactHooks.useQuery<GetPrepaidCardHistoryDataQuery, GetPrepaidCardHistoryDataQueryVariables>(GetPrepaidCardHistoryDataDocument, baseOptions);
      }
export function useGetPrepaidCardHistoryDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPrepaidCardHistoryDataQuery, GetPrepaidCardHistoryDataQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetPrepaidCardHistoryDataQuery, GetPrepaidCardHistoryDataQueryVariables>(GetPrepaidCardHistoryDataDocument, baseOptions);
        }
export type GetPrepaidCardHistoryDataQueryHookResult = ReturnType<typeof useGetPrepaidCardHistoryDataQuery>;
export type GetPrepaidCardHistoryDataLazyQueryHookResult = ReturnType<typeof useGetPrepaidCardHistoryDataLazyQuery>;
export type GetPrepaidCardHistoryDataQueryResult = ApolloReactCommon.QueryResult<GetPrepaidCardHistoryDataQuery, GetPrepaidCardHistoryDataQueryVariables>;
export const GetLifetimeEarningsAccumulationsDocument = gql`
    query GetLifetimeEarningsAccumulations($address: ID!) {
  merchantSafe(id: $address) {
    id
    spendAccumulations(orderBy: timestamp, orderDirection: asc) {
      timestamp
      amount
      historicSpendBalance
    }
  }
}
    `;

/**
 * __useGetLifetimeEarningsAccumulationsQuery__
 *
 * To run a query within a React component, call `useGetLifetimeEarningsAccumulationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLifetimeEarningsAccumulationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLifetimeEarningsAccumulationsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetLifetimeEarningsAccumulationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLifetimeEarningsAccumulationsQuery, GetLifetimeEarningsAccumulationsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetLifetimeEarningsAccumulationsQuery, GetLifetimeEarningsAccumulationsQueryVariables>(GetLifetimeEarningsAccumulationsDocument, baseOptions);
      }
export function useGetLifetimeEarningsAccumulationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLifetimeEarningsAccumulationsQuery, GetLifetimeEarningsAccumulationsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetLifetimeEarningsAccumulationsQuery, GetLifetimeEarningsAccumulationsQueryVariables>(GetLifetimeEarningsAccumulationsDocument, baseOptions);
        }
export type GetLifetimeEarningsAccumulationsQueryHookResult = ReturnType<typeof useGetLifetimeEarningsAccumulationsQuery>;
export type GetLifetimeEarningsAccumulationsLazyQueryHookResult = ReturnType<typeof useGetLifetimeEarningsAccumulationsLazyQuery>;
export type GetLifetimeEarningsAccumulationsQueryResult = ApolloReactCommon.QueryResult<GetLifetimeEarningsAccumulationsQuery, GetLifetimeEarningsAccumulationsQueryVariables>;