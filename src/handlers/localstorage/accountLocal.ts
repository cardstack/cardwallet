import {
  Asset,
  CollectibleType,
  DepotType,
  MerchantSafeType,
  NetworkType,
  PrepaidCardType,
} from '@cardstack/types';

import { getAccountLocal, saveAccountLocal } from './common';

const assetsVersion = '1.0.1';

const prepaidCardsVersion = '0.2.0';
const depotVersion = '0.2.0';
const merchantSafeVersion = '0.2.0';
const transactionsVersion = '0.2.6';
const collectiblesVersion = '0.2.4';

const ACCOUNT_INFO = 'accountInfo';
const ASSETS = 'assets';
const PREPAID_CARDS = 'prepaidCards';
const DEPOTS = 'depots';
const MERCHANT_SAFES = 'merchantSafes';
const TRANSACTIONS = 'transactions';
const COLLECTIBLES = 'collectibles';

export const accountLocalKeys = [
  ACCOUNT_INFO,
  ASSETS,
  TRANSACTIONS,
  COLLECTIBLES,
  DEPOTS,
  MERCHANT_SAFES,
  PREPAID_CARDS,
];

export const getAssets = (
  accountAddress: string,
  network: NetworkType
): Promise<{ latestTxBlockNumber?: number; assets: Asset[] }> =>
  getAccountLocal(
    ASSETS,
    accountAddress,
    network,
    { latestTxBlockNumber: undefined, assets: [] } as any,
    assetsVersion
  );

export const saveAssets = (
  assets: Asset[],
  accountAddress: string,
  network: NetworkType,
  latestTxBlockNumber?: number
) =>
  saveAccountLocal(
    ASSETS,
    { assets, latestTxBlockNumber },
    accountAddress,
    network,
    assetsVersion
  );

export const getPrepaidCards = (
  accountAddress: string,
  network: NetworkType
): Promise<{
  timestamp: string;
  prepaidCards: PrepaidCardType[];
}> =>
  getAccountLocal(
    PREPAID_CARDS,
    accountAddress,
    network,
    { prepaidCards: [], timestamp: '' } as any,
    prepaidCardsVersion
  );

export const savePrepaidCards = (
  prepaidCards: PrepaidCardType[],
  accountAddress: string,
  network: NetworkType,
  timestamp: string
) =>
  saveAccountLocal(
    PREPAID_CARDS,
    { prepaidCards, timestamp },
    accountAddress,
    network,
    prepaidCardsVersion
  );

export const getDepots = (
  accountAddress: string,
  network: NetworkType
): Promise<{ timestamp: string; depots: DepotType[] }> =>
  getAccountLocal(
    DEPOTS,
    accountAddress,
    network,
    { depots: [], timestamp: '' } as any,
    depotVersion
  );

export const saveDepots = (
  depots: DepotType[],
  accountAddress: string,
  network: NetworkType,
  timestamp: string
) =>
  saveAccountLocal(
    DEPOTS,
    { depots, timestamp },
    accountAddress,
    network,
    depotVersion
  );

export const getMerchantSafes = (
  accountAddress: string,
  network: NetworkType
): Promise<{ timestamp: string; merchantSafes: MerchantSafeType[] }> =>
  getAccountLocal(
    MERCHANT_SAFES,
    accountAddress,
    network,
    { merchantSafes: [], timestamp: '' } as any,
    merchantSafeVersion
  );

export const saveMerchantSafes = (
  merchantSafes: MerchantSafeType[],
  accountAddress: string,
  network: NetworkType,
  timestamp: string
) =>
  saveAccountLocal(
    MERCHANT_SAFES,
    { merchantSafes, timestamp },
    accountAddress,
    network,
    merchantSafeVersion
  );

export const getLocalTransactions = (
  accountAddress: string,
  network: NetworkType
) =>
  getAccountLocal(
    TRANSACTIONS,
    accountAddress,
    network,
    [],
    transactionsVersion
  );

export const saveLocalTransactions = (
  transactions: any[],
  accountAddress: string,
  network: NetworkType
) =>
  saveAccountLocal(
    TRANSACTIONS,
    transactions,
    accountAddress,
    network,
    transactionsVersion
  );

export const getCollectibles = (
  accountAddress: string,
  network: NetworkType
): Promise<CollectibleType[]> =>
  getAccountLocal(
    COLLECTIBLES,
    accountAddress,
    network,
    [],
    collectiblesVersion
  );

export const saveCollectibles = (
  collectibles: CollectibleType[],
  accountAddress: string,
  network: NetworkType
) =>
  saveAccountLocal(
    COLLECTIBLES,
    collectibles,
    accountAddress,
    network,
    collectiblesVersion
  );
