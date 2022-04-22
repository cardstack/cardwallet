import { divide, isZero } from '@cardstack/cardpay-sdk';
import { getUnixTime, subDays } from 'date-fns';
import produce from 'immer';
import {
  concat,
  filter,
  get,
  isEmpty,
  isNil,
  keyBy,
  map,
  mapKeys,
  mapValues,
  partition,
  property,
  remove,
  toLower,
  uniqBy,
  values,
} from 'lodash';
import { uniswapClient } from '../apollo/client';
import {
  UNISWAP_24HOUR_PRICE_QUERY,
  UNISWAP_PRICES_QUERY,
} from '../apollo/queries';
import { getTransactionReceipt } from '../handlers/web3';
import { addCashUpdatePurchases } from './addCashData';
import { uniswapUpdateLiquidityTokens } from './uniswapLiquidity';
import { collectiblesRefreshState } from '@cardstack/redux/collectibles';
import {
  getAssetPricesFromUniswap,
  getAssets,
  getDepots,
  getLocalTransactions,
  getMerchantSafes,
  getPrepaidCards,
  saveAccountEmptyState,
  saveAssetPricesFromUniswap,
  saveAssets,
  saveLocalTransactions,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import AssetTypes from '@rainbow-me/helpers/assetTypes';
import DirectionTypes from '@rainbow-me/helpers/transactionDirectionTypes';
import TransactionStatusTypes from '@rainbow-me/helpers/transactionStatusTypes';
import TransactionTypes from '@rainbow-me/helpers/transactionTypes';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import { Navigation } from '@rainbow-me/navigation';
import { triggerOnSwipeLayout } from '@rainbow-me/navigation/onNavigationStateChange';
import networkTypes from '@rainbow-me/networkTypes';
import {
  getTitle,
  getTransactionLabel,
  parseAccountAssets,
  parseAsset,
  parseNewTransaction,
  parseTransactions,
} from '@rainbow-me/parsers';
import { shitcoins } from '@rainbow-me/references';
import Routes from '@rainbow-me/routes';
import { ethereumUtils, isLowerCaseMatch } from '@rainbow-me/utils';
import logger from 'logger';

const BACKUP_SHEET_DELAY_MS = 3000;

let pendingTransactionsHandle = null;
const TXN_WATCHER_MAX_TRIES = 60;
const TXN_WATCHER_POLL_INTERVAL = 5000; // 5 seconds

// -- Constants --------------------------------------- //

const DATA_UPDATE_ASSET_PRICES_FROM_UNISWAP =
  'data/DATA_UPDATE_ASSET_PRICES_FROM_UNISWAP';
const DATA_UPDATE_ASSETS = 'data/DATA_UPDATE_ASSETS';
const DATA_UPDATE_GENERIC_ASSETS = 'data/DATA_UPDATE_GENERIC_ASSETS';
const DATA_UPDATE_TRANSACTIONS = 'data/DATA_UPDATE_TRANSACTIONS';
const DATA_UPDATE_UNISWAP_PRICES_SUBSCRIPTION =
  'data/DATA_UPDATE_UNISWAP_PRICES_SUBSCRIPTION';
const DATA_UPDATE_GNOSIS_DATA = 'data/DATA_UPDATE_GNOSIS_DATA';

const DATA_LOAD_ASSETS_REQUEST = 'data/DATA_LOAD_ASSETS_REQUEST';
const DATA_LOAD_ASSETS_SUCCESS = 'data/DATA_LOAD_ASSETS_SUCCESS';
const DATA_LOAD_ASSETS_FAILURE = 'data/DATA_LOAD_ASSETS_FAILURE';

const DATA_LOAD_ASSET_PRICES_FROM_UNISWAP_SUCCESS =
  'data/DATA_LOAD_ASSET_PRICES_FROM_UNISWAP_SUCCESS';

const DATA_LOAD_TRANSACTIONS_REQUEST = 'data/DATA_LOAD_TRANSACTIONS_REQUEST';
const DATA_LOAD_TRANSACTIONS_SUCCESS = 'data/DATA_LOAD_TRANSACTIONS_SUCCESS';
const DATA_LOAD_TRANSACTIONS_FAILURE = 'data/DATA_LOAD_TRANSACTIONS_FAILURE';

const DATA_ADD_NEW_TRANSACTION_SUCCESS =
  'data/DATA_ADD_NEW_TRANSACTION_SUCCESS';

const DATA_ADD_NEW_SUBSCRIBER = 'data/DATA_ADD_NEW_SUBSCRIBER';
const DATA_UPDATE_REFETCH_SAVINGS = 'data/DATA_UPDATE_REFETCH_SAVINGS';

const DATA_CLEAR_STATE = 'data/DATA_CLEAR_STATE';
export const DATA_UPDATE_PREPAIDCARDS = 'data/DATA_UPDATE_PREPAIDCARDS';

// -- Actions ---------------------------------------- //
export const dataLoadState = () => async (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  try {
    const assetPricesFromUniswap = await getAssetPricesFromUniswap(
      accountAddress,
      network
    );
    dispatch({
      payload: assetPricesFromUniswap,
      type: DATA_LOAD_ASSET_PRICES_FROM_UNISWAP_SUCCESS,
    });
    // eslint-disable-next-line no-empty
  } catch (error) {}
  try {
    dispatch({ type: DATA_LOAD_ASSETS_REQUEST });
    const [
      assets,
      { prepaidCards },
      { depots },
      { merchantSafes },
    ] = await Promise.all([
      getAssets(accountAddress, network),
      getPrepaidCards(accountAddress, network),
      getDepots(accountAddress, network),
      getMerchantSafes(accountAddress, network),
    ]);
    dispatch({
      payload: {
        assets,
        depots,
        prepaidCards,
        merchantSafes,
      },
      type: DATA_LOAD_ASSETS_SUCCESS,
    });
  } catch (error) {
    dispatch({ type: DATA_LOAD_ASSETS_FAILURE });
  }
  try {
    dispatch({ type: DATA_LOAD_TRANSACTIONS_REQUEST });
    const transactions = await getLocalTransactions(accountAddress, network);
    dispatch({
      payload: transactions,
      type: DATA_LOAD_TRANSACTIONS_SUCCESS,
    });
  } catch (error) {
    dispatch({ type: DATA_LOAD_TRANSACTIONS_FAILURE });
  }
};

export const dataResetState = () => (dispatch, getState) => {
  const { uniswapPricesSubscription } = getState().data;
  uniswapPricesSubscription &&
    uniswapPricesSubscription.unsubscribe &&
    uniswapPricesSubscription.unsubscribe();
  pendingTransactionsHandle && clearTimeout(pendingTransactionsHandle);
  dispatch({ type: DATA_CLEAR_STATE });
};

export const dataUpdateAssets = assets => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  if (assets.length) {
    saveAssets(assets, accountAddress, network);
    // Change the state since the account isn't empty anymore
    saveAccountEmptyState(false, accountAddress, network);
    dispatch({
      payload: assets,
      type: DATA_UPDATE_ASSETS,
    });
  }
};

const checkMeta = message => (dispatch, getState) => {
  const { accountAddress, nativeCurrency, network } = getState().settings;
  const address = get(message, 'meta.address');
  const currency = get(message, 'meta.currency');
  const metaNetwork = get(message, 'meta.network');

  return (
    isLowerCaseMatch(address, accountAddress) &&
    isLowerCaseMatch(currency, nativeCurrency) &&
    (!metaNetwork || isLowerCaseMatch(metaNetwork, network))
  );
};

const checkForConfirmedSavingsActions = transactionsData => dispatch => {
  const foundConfirmedSavings = find(
    transactionsData,
    transaction =>
      (transaction?.type === 'deposit' || transaction?.type === 'withdraw') &&
      transaction?.status === 'confirmed'
  );
  if (foundConfirmedSavings) {
    dispatch(updateRefetchSavings(true));
  }
};

export const transactionsReceived = (message, appended = false) => async (
  dispatch,
  getState
) => {
  const isValidMeta = dispatch(checkMeta(message));
  if (!isValidMeta) return;
  const transactionData = get(message, 'payload.transactions', []);
  if (appended) {
    dispatch(checkForConfirmedSavingsActions(transactionData));
  }

  const { accountAddress, nativeCurrency, network } = getState().settings;
  const { purchaseTransactions } = getState().addCash;
  const { transactions } = getState().data;
  const { selected } = getState().wallets;

  const { parsedTransactions, potentialNftTransaction } = parseTransactions(
    transactionData,
    accountAddress,
    nativeCurrency,
    transactions,
    purchaseTransactions,
    network,
    appended
  );
  if (appended && potentialNftTransaction) {
    setTimeout(() => {
      dispatch(collectiblesRefreshState());
    }, 60000);
  }
  dispatch({
    payload: parsedTransactions,
    type: DATA_UPDATE_TRANSACTIONS,
  });
  dispatch(updatePurchases(parsedTransactions));
  saveLocalTransactions(parsedTransactions, accountAddress, network);

  if (appended && parsedTransactions.length) {
    if (
      selected &&
      !selected.backedUp &&
      !selected.imported &&
      selected.type !== WalletTypes.readOnly
    ) {
      setTimeout(() => {
        triggerOnSwipeLayout(() =>
          Navigation.handleAction(Routes.BACKUP_SHEET, { single: true })
        );
      }, BACKUP_SHEET_DELAY_MS);
    }
  }
};

export const addressAssetsReceived = (
  message,
  append = false,
  change = false,
  removed = false
) => async (dispatch, getState) => {
  const isValidMeta = dispatch(checkMeta(message));
  if (!isValidMeta) return;

  const { accountAddress, network } = getState().settings;

  const payload = values(get(message, 'payload.assets', {}));
  let assets = filter(
    payload,
    asset =>
      asset?.asset?.type !== AssetTypes.compound &&
      asset?.asset?.type !== AssetTypes.trash
  );

  if (removed) {
    assets = map(payload, asset => {
      return {
        ...asset,
        quantity: 0,
      };
    });
  }

  // Remove spammy tokens
  remove(assets, asset =>
    shitcoins.includes(toLower(asset?.asset?.asset_code))
  );

  let parsedAssets = parseAccountAssets(assets);

  // remove LP tokens
  const liquidityTokens = remove(
    parsedAssets,
    asset =>
      asset?.type === AssetTypes.uniswap || asset?.type === AssetTypes.uniswapV2
  );

  dispatch(
    uniswapUpdateLiquidityTokens(liquidityTokens, append || change || removed)
  );

  if (append || change || removed) {
    const { assets: existingAssets } = getState().data;
    parsedAssets = uniqBy(
      concat(parsedAssets, existingAssets),
      item => item.uniqueId
    );
  }

  parsedAssets = parsedAssets.filter(
    asset => !!Number(get(asset, 'balance.amount'))
  );

  if (parsedAssets.length > 0) {
    // Change the state since the account isn't empty anymore
    saveAccountEmptyState(false, accountAddress, network);
  }

  dispatch({
    payload: parsedAssets,
    type: DATA_UPDATE_ASSETS,
  });
  saveAssets(parsedAssets, accountAddress, network);
  dispatch(collectiblesRefreshState());

  if (!change) {
    const missingPriceAssetAddresses = map(
      filter(parsedAssets, asset => isNil(asset.price)),
      property('address')
    );
    dispatch(subscribeToMissingPrices(missingPriceAssetAddresses));
  }
};

const subscribeToMissingPrices = addresses => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  const { uniswapPricesQuery } = getState().data;
  if (uniswapPricesQuery) {
    uniswapPricesQuery.refetch({ addresses });
  } else {
    const newQuery = uniswapClient.watchQuery({
      fetchPolicy: 'network-only',
      pollInterval: 15000, // 15 seconds
      query: UNISWAP_PRICES_QUERY,
      variables: {
        addresses,
      },
    });

    const newSubscription = newQuery.subscribe({
      next: async ({ data }) => {
        if (data && data.tokens) {
          const nativePriceOfEth = ethereumUtils.getEthPriceUnit();
          const tokenAddresses = map(data.tokens, property('id'));

          const yesterday = getUnixTime(subDays(new Date(), 1));
          const historicalPriceCalls = map(tokenAddresses, address =>
            get24HourPrice(address, yesterday)
          );
          const historicalPriceResults = await Promise.all(
            historicalPriceCalls
          );
          const mappedHistoricalData = keyBy(historicalPriceResults, 'id');
          const missingHistoricalPrices = mapValues(
            mappedHistoricalData,
            value => value.priceUSD
          );

          const mappedPricingData = keyBy(data.tokens, 'id');
          const missingPrices = mapValues(mappedPricingData, token =>
            divide(nativePriceOfEth, token.derivedETH)
          );
          const missingPriceInfo = mapValues(
            missingPrices,
            (currentPrice, key) => {
              const historicalPrice = get(missingHistoricalPrices, `[${key}]`);
              const tokenAddress = get(mappedPricingData, `[${key}].id`);
              const relativePriceChange = historicalPrice
                ? ((currentPrice - historicalPrice) / currentPrice) * 100
                : 0;
              return {
                price: currentPrice,
                relativePriceChange,
                tokenAddress,
              };
            }
          );
          const tokenPricingInfo = mapKeys(missingPriceInfo, 'tokenAddress');

          saveAssetPricesFromUniswap(tokenPricingInfo, accountAddress, network);
          dispatch({
            payload: tokenPricingInfo,
            type: DATA_UPDATE_ASSET_PRICES_FROM_UNISWAP,
          });
        }
      },
    });
    dispatch({
      payload: {
        uniswapPricesQuery: newQuery,
        uniswapPricesSubscription: newSubscription,
      },
      type: DATA_UPDATE_UNISWAP_PRICES_SUBSCRIPTION,
    });
  }
};

const get24HourPrice = async (address, yesterday) => {
  const result = await uniswapClient.query({
    query: UNISWAP_24HOUR_PRICE_QUERY,
    variables: {
      address,
      fetchPolicy: 'network-only',
      timestamp: yesterday,
    },
  });
  return get(result, 'data.tokenDayDatas[0]');
};

export const assetPricesReceived = message => dispatch => {
  const assets = get(message, 'payload.prices', {});
  if (isEmpty(assets)) return;
  const parsedAssets = mapValues(assets, asset => parseAsset(asset));
  dispatch({
    payload: parsedAssets,
    type: DATA_UPDATE_GENERIC_ASSETS,
  });
};

export const assetPricesChanged = message => (dispatch, getState) => {
  const price = get(message, 'payload.prices[0].price');
  const assetAddress = get(message, 'meta.asset_code');
  if (isNil(price) || isNil(assetAddress)) return;
  const { genericAssets } = getState().data;
  const genericAsset = {
    ...get(genericAssets, assetAddress),
    price,
  };
  const updatedAssets = {
    ...genericAssets,
    [assetAddress]: genericAsset,
  };
  dispatch({
    payload: updatedAssets,
    type: DATA_UPDATE_GENERIC_ASSETS,
  });
};

export const dataAddNewTransaction = (
  txDetails,
  accountAddressToUpdate = '',
  disableTxnWatcher = false
) => async (dispatch, getState) => {
  const { transactions } = getState().data;
  const { accountAddress, nativeCurrency, network } = getState().settings;
  if (
    accountAddressToUpdate &&
    toLower(accountAddressToUpdate) !== toLower(accountAddress)
  )
    return;

  try {
    const parsedTransaction = await parseNewTransaction(
      txDetails,
      nativeCurrency
    );
    const _transactions = [parsedTransaction, ...transactions];
    dispatch({
      payload: _transactions,
      type: DATA_ADD_NEW_TRANSACTION_SUCCESS,
    });
    saveLocalTransactions(_transactions, accountAddress, network);
    if (!disableTxnWatcher || network !== networkTypes.mainnet) {
      dispatch(watchPendingTransactions(accountAddress));
    }
    return parsedTransaction;
    // eslint-disable-next-line no-empty
  } catch (error) {}
};

const getConfirmedState = type => {
  switch (type) {
    case TransactionTypes.authorize:
      return TransactionStatusTypes.approved;
    case TransactionTypes.deposit:
      return TransactionStatusTypes.deposited;
    case TransactionTypes.withdraw:
      return TransactionStatusTypes.withdrew;
    case TransactionTypes.receive:
      return TransactionStatusTypes.received;
    case TransactionTypes.purchase:
      return TransactionStatusTypes.purchased;
    default:
      return TransactionStatusTypes.sent;
  }
};

export const dataWatchPendingTransactions = (cb = null) => async (
  dispatch,
  getState
) => {
  const { transactions } = getState().data;
  if (!transactions.length) return true;
  let txStatusesDidChange = false;

  const [pending, remainingTransactions] = partition(
    transactions,
    txn => txn.pending
  );

  if (isEmpty(pending)) return true;

  const updatedPendingTransactions = await Promise.all(
    pending.map(async tx => {
      const updatedPending = { ...tx };
      const txHash = ethereumUtils.getHash(tx);
      try {
        logger.log('Checking pending tx with hash', txHash);
        const txObj = await getTransactionReceipt(txHash);
        if (txObj && txObj.blockNumber) {
          // When speeding up a non "normal tx" we need to resubscribe
          // because zerion "append" event isn't reliable
          logger.log('TX CONFIRMED!', tx);
          if (cb) {
            logger.log('executing cb', cb);
            cb(tx);
            return;
          }
          const minedAt = Math.floor(Date.now() / 1000);
          txStatusesDidChange = true;
          const isSelf = toLower(tx?.from) === toLower(tx?.to);
          if (!isZero(txObj.status)) {
            const newStatus = getTransactionLabel({
              direction: isSelf ? DirectionTypes.self : DirectionTypes.out,
              pending: false,
              protocol: tx?.protocol,
              status:
                tx.status === TransactionStatusTypes.cancelling
                  ? TransactionStatusTypes.cancelled
                  : getConfirmedState(tx.type),
              type: tx?.type,
            });
            updatedPending.status = newStatus;
          } else {
            updatedPending.status = TransactionStatusTypes.failed;
          }
          const title = getTitle({
            protocol: tx.protocol,
            status: updatedPending.status,
            type: tx.type,
          });
          updatedPending.title = title;
          updatedPending.pending = false;
          updatedPending.minedAt = minedAt;
        }
      } catch (error) {
        logger.log('Error watching pending txn', error);
      }
      return updatedPending;
    })
  );
  const updatedTransactions = concat(
    updatedPendingTransactions,
    remainingTransactions
  );

  if (txStatusesDidChange) {
    dispatch(updatePurchases(updatedTransactions));
    const { accountAddress, network } = getState().settings;
    dispatch({
      payload: updatedTransactions,
      type: DATA_UPDATE_TRANSACTIONS,
    });
    saveLocalTransactions(updatedTransactions, accountAddress, network);

    const pendingTx = updatedTransactions.find(tx => tx.pending);
    if (!pendingTx) {
      return true;
    }
  }

  return false;
};

export const dataUpdateTransaction = (txHash, txObj, watch, cb) => (
  dispatch,
  getState
) => {
  const { transactions } = getState().data;

  const allOtherTx = transactions.filter(tx => tx.hash !== txHash);
  const updatedTransactions = [txObj].concat(allOtherTx);

  dispatch({
    payload: updatedTransactions,
    type: DATA_UPDATE_TRANSACTIONS,
  });
  const { accountAddress, network } = getState().settings;
  saveLocalTransactions(updatedTransactions, accountAddress, network);
  // Always watch cancellation and speed up
  if (watch) {
    dispatch(
      watchPendingTransactions(accountAddress, TXN_WATCHER_MAX_TRIES, cb)
    );
  }
};

const updatePurchases = updatedTransactions => dispatch => {
  const confirmedPurchases = filter(updatedTransactions, txn => {
    return (
      txn.type === TransactionTypes.purchase &&
      txn.status !== TransactionStatusTypes.purchasing
    );
  });
  dispatch(addCashUpdatePurchases(confirmedPurchases));
};

const watchPendingTransactions = (
  accountAddressToWatch,
  remainingTries = TXN_WATCHER_MAX_TRIES,
  cb = null
) => async (dispatch, getState) => {
  pendingTransactionsHandle && clearTimeout(pendingTransactionsHandle);
  if (remainingTries === 0) return;

  const { accountAddress: currentAccountAddress } = getState().settings;
  if (currentAccountAddress !== accountAddressToWatch) return;

  const done = await dispatch(dataWatchPendingTransactions(cb));

  if (!done) {
    pendingTransactionsHandle = setTimeout(() => {
      dispatch(
        watchPendingTransactions(accountAddressToWatch, remainingTries - 1, cb)
      );
    }, TXN_WATCHER_POLL_INTERVAL);
  }
};

export const addNewSubscriber = (subscriber, type) => (dispatch, getState) => {
  const { subscribers } = getState().data;
  const newSubscribers = { ...subscribers };
  newSubscribers[type] = concat(newSubscribers[type], subscriber);

  dispatch({
    payload: newSubscribers,
    type: DATA_ADD_NEW_SUBSCRIBER,
  });
};

export const updateRefetchSavings = fetch => dispatch =>
  dispatch({
    payload: fetch,
    type: DATA_UPDATE_REFETCH_SAVINGS,
  });

export const addNewPrepaidCard = newPrepaidCard => (dispatch, getState) => {
  const { prepaidCards } = getState().data;
  const updatedCards = [newPrepaidCard, ...prepaidCards];

  dispatch({
    payload: { prepaidCards: updatedCards },
    type: DATA_UPDATE_PREPAIDCARDS,
  });
};

// -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  assetPricesFromUniswap: {},
  assets: [], // for account-specific assets
  depots: [],
  merchantSafes: [],
  prepaidCards: [],
  genericAssets: {},
  isLoadingAssets: true,
  isLoadingTransactions: true,
  shouldRefetchSavings: false,
  subscribers: {
    appended: [],
    received: [],
  },
  transactions: [],
  uniswapPricesQuery: null,
  uniswapPricesSubscription: null,
};

export default (state = INITIAL_STATE, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case DATA_UPDATE_UNISWAP_PRICES_SUBSCRIPTION:
        draft.uniswapPricesQuery = action.payload.uniswapPricesQuery;
        draft.uniswapPricesSubscription =
          action.payload.uniswapPricesSubscription;
        break;
      case DATA_UPDATE_REFETCH_SAVINGS:
        draft.shouldRefetchSavings = action.payload;
        break;
      case DATA_UPDATE_ASSET_PRICES_FROM_UNISWAP:
        draft.assetPricesFromUniswap = action.payload;
        break;
      case DATA_UPDATE_GENERIC_ASSETS:
        draft.genericAssets = action.payload;
        break;
      case DATA_UPDATE_ASSETS:
        draft.assets = action.payload;
        draft.isLoadingAssets = false;
        break;
      case DATA_UPDATE_GNOSIS_DATA:
        draft.depots = action.payload.depots;
        draft.merchantSafes = action.payload.merchantSafes;
        draft.prepaidCards = action.payload.prepaidCards;
        break;
      case DATA_UPDATE_TRANSACTIONS:
        draft.isLoadingTransactions = false;
        draft.transactions = action.payload;
        break;
      case DATA_LOAD_TRANSACTIONS_REQUEST:
        draft.isLoadingTransactions = true;
        break;
      case DATA_LOAD_TRANSACTIONS_SUCCESS:
        draft.isLoadingTransactions = false;
        draft.transactions = action.payload;
        break;
      case DATA_LOAD_TRANSACTIONS_FAILURE:
        draft.isLoadingTransactions = false;
        break;
      case DATA_LOAD_ASSETS_REQUEST:
        draft.isLoadingAssets = true;
        break;
      case DATA_LOAD_ASSET_PRICES_FROM_UNISWAP_SUCCESS:
        draft.assetPricesFromUniswap = action.payload;
        break;
      case DATA_LOAD_ASSETS_SUCCESS:
        draft.assets = action.payload.assets;
        draft.depots = action.payload.depots;
        draft.prepaidCards = action.payload.prepaidCards;
        draft.merchantSafes = action.payload.merchantSafes;
        draft.isLoadingAssets = false;
        break;
      case DATA_LOAD_ASSETS_FAILURE:
        draft.isLoadingAssets = true;
        break;
      case DATA_ADD_NEW_TRANSACTION_SUCCESS:
        draft.transactions = action.payload;
        break;
      case DATA_ADD_NEW_SUBSCRIBER:
        draft.subscribers = action.payload;
        break;
      case DATA_UPDATE_PREPAIDCARDS:
        draft.prepaidCards = action.payload.prepaidCards;
        break;
      case DATA_CLEAR_STATE:
        return INITIAL_STATE;
      default:
        break;
    }
  });
};
