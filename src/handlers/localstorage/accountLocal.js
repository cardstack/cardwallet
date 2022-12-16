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
const ACCOUNT_CHARTS = 'accountCharts';
const PURCHASE_TRANSACTIONS = 'purchaseTransactions';
const SAVINGS = 'savings';
const TRANSACTIONS = 'transactions';
const COLLECTIBLES = 'collectibles';

export const accountLocalKeys = [
  ACCOUNT_INFO,
  ASSETS,
  ACCOUNT_CHARTS,
  PURCHASE_TRANSACTIONS,
  SAVINGS,
  TRANSACTIONS,
  COLLECTIBLES,
  DEPOTS,
  MERCHANT_SAFES,
  PREPAID_CARDS,
];

/**
 * @desc get assets
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const getAssets = (accountAddress, network) =>
  getAccountLocal(
    ASSETS,
    accountAddress,
    network,
    { latestBlockNumber: undefined, assets: [] },
    assetsVersion
  );

/**
 * @desc save assets
 * @param  {Array | Object}    [assets]
 * @param  {String}   [address]
 * @param  {String}   [network]
 */
export const saveAssets = (assets, accountAddress, network) =>
  saveAccountLocal(ASSETS, assets, accountAddress, network, assetsVersion);

/**
 * @desc get prepaid cards
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {{prepaidCards: Array, timestamp: String}}
 */
export const getPrepaidCards = (accountAddress, network) =>
  getAccountLocal(
    PREPAID_CARDS,
    accountAddress,
    network,
    { prepaidCards: [], timestamp: '' },
    prepaidCardsVersion
  );

/**
 * @desc save prepaid cards
 * @param  {Array}    [prepaidCards]
 * @param  {String}   [address]
 * @param  {String}   [network]
 */
export const savePrepaidCards = (
  prepaidCards,
  accountAddress,
  network,
  timestamp
) =>
  saveAccountLocal(
    PREPAID_CARDS,
    { prepaidCards, timestamp },
    accountAddress,
    network,
    prepaidCardsVersion
  );

/**
 * @desc get depots
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {{depots: Array, timestamp: String}}
 */
export const getDepots = (accountAddress, network) =>
  getAccountLocal(
    DEPOTS,
    accountAddress,
    network,
    { depots: [], timestamp: '' },
    depotVersion
  );

/**
 * @desc save depots
 * @param  {Array}    [depots]
 * @param  {String}   [address]
 * @param  {String}   [network]
 */
export const saveDepots = (depots, accountAddress, network, timestamp) =>
  saveAccountLocal(
    DEPOTS,
    { depots, timestamp },
    accountAddress,
    network,
    depotVersion
  );

/**
 * @desc get merchant safes
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {{merchantSafes: Array, timestamp: String}}
 */
export const getMerchantSafes = (accountAddress, network) =>
  getAccountLocal(
    MERCHANT_SAFES,
    accountAddress,
    network,
    { merchantSafes: [], timestamp: '' },
    merchantSafeVersion
  );

/**
 * @desc save merchant safes
 * @param  {Array}    [depots]
 * @param  {String}   [address]
 * @param  {String}   [network]
 */
export const saveMerchantSafes = (
  merchantSafes,
  accountAddress,
  network,
  timestamp
) =>
  saveAccountLocal(
    MERCHANT_SAFES,
    { merchantSafes, timestamp },
    accountAddress,
    network,
    merchantSafeVersion
  );

export const getLocalTransactions = (accountAddress, network) =>
  getAccountLocal(
    TRANSACTIONS,
    accountAddress,
    network,
    [],
    transactionsVersion
  );

/**
 * @desc save transactions
 * @param  {String}   [address]
 * @param  {Array}   [transactions]
 * @param  {String}   [network]
 */
export const saveLocalTransactions = (transactions, accountAddress, network) =>
  saveAccountLocal(
    TRANSACTIONS,
    transactions,
    accountAddress,
    network,
    transactionsVersion
  );

/**
 * @desc get collectibles
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const getCollectibles = (accountAddress, network) =>
  getAccountLocal(
    COLLECTIBLES,
    accountAddress,
    network,
    [],
    collectiblesVersion
  );

/**
 * @desc save collectibles
 * @param  {String}   [address]
 * @param  {Array}    [collectibles]
 * @param  {String}   [network]
 */
export const saveCollectibles = (collectibles, accountAddress, network) =>
  saveAccountLocal(
    COLLECTIBLES,
    collectibles,
    accountAddress,
    network,
    collectiblesVersion
  );

/**
 * @desc get profile info
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const getAccountInfo = (accountAddress, network) =>
  getAccountLocal(ACCOUNT_INFO, accountAddress, network, {});

/**
 * @desc save profile info
 * @param  {String}   [address]
 * @param  {Object}    [profile info]
 * @param  {String}   [network]
 */
export const saveAccountInfo = (profileInfo, accountAddress, network) =>
  saveAccountLocal(ACCOUNT_INFO, profileInfo, accountAddress, network);
