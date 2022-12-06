import { isZero } from '@cardstack/cardpay-sdk';
import produce from 'immer';
import {
  concat,
  filter,
  get,
  isEmpty,
  map,
  partition,
  remove,
  toLower,
  uniqBy,
  values,
} from 'lodash';
import { getTransactionReceipt } from '../handlers/web3';
import { collectiblesRefreshState } from '@cardstack/redux/collectibles';
import { NetworkType } from '@cardstack/types';
import {
  getAssets,
  getDepots,
  getLocalTransactions,
  getMerchantSafes,
  getPrepaidCards,
  saveAccountEmptyState,
  saveAssets,
  saveLocalTransactions,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import AssetTypes from '@rainbow-me/helpers/assetTypes';
import DirectionTypes from '@rainbow-me/helpers/transactionDirectionTypes';
import TransactionStatusTypes from '@rainbow-me/helpers/transactionStatusTypes';
import TransactionTypes from '@rainbow-me/helpers/transactionTypes';
import {
  getTitle,
  getTransactionLabel,
  parseAccountAssets,
  parseAsset,
  parseNewTransaction,
  parseTransactions,
} from '@rainbow-me/parsers';
import { shitcoins } from '@rainbow-me/references';
import { ethereumUtils, isLowerCaseMatch } from '@rainbow-me/utils';
import logger from 'logger';

let pendingTransactionsHandle = null;
const TXN_WATCHER_MAX_TRIES = 60;
const TXN_WATCHER_POLL_INTERVAL = 5000; // 5 seconds

// -- Constants --------------------------------------- //

const DATA_UPDATE_ASSETS = 'data/DATA_UPDATE_ASSETS';
const DATA_UPDATE_GENERIC_ASSETS = 'data/DATA_UPDATE_GENERIC_ASSETS';
const DATA_UPDATE_TRANSACTIONS = 'data/DATA_UPDATE_TRANSACTIONS';
const DATA_UPDATE_GNOSIS_DATA = 'data/DATA_UPDATE_GNOSIS_DATA';

const DATA_LOAD_ASSETS_SUCCESS = 'data/DATA_LOAD_ASSETS_SUCCESS';
const DATA_LOAD_ASSETS_FAILURE = 'data/DATA_LOAD_ASSETS_FAILURE';

const DATA_LOAD_TRANSACTIONS_REQUEST = 'data/DATA_LOAD_TRANSACTIONS_REQUEST';
const DATA_LOAD_TRANSACTIONS_SUCCESS = 'data/DATA_LOAD_TRANSACTIONS_SUCCESS';
const DATA_LOAD_TRANSACTIONS_FAILURE = 'data/DATA_LOAD_TRANSACTIONS_FAILURE';

const DATA_ADD_NEW_TRANSACTION_SUCCESS =
  'data/DATA_ADD_NEW_TRANSACTION_SUCCESS';

const DATA_UPDATE_REFETCH_SAVINGS = 'data/DATA_UPDATE_REFETCH_SAVINGS';

const DATA_CLEAR_STATE = 'data/DATA_CLEAR_STATE';
export const DATA_UPDATE_PREPAIDCARDS = 'data/DATA_UPDATE_PREPAIDCARDS';

// -- Actions ---------------------------------------- //
export const dataLoadState = () => async (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  try {
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

export const dataResetState = () => dispatch => {
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
  const { transactions } = getState().data;

  const { parsedTransactions, potentialNftTransaction } = parseTransactions(
    transactionData,
    accountAddress,
    nativeCurrency,
    transactions,
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
  saveLocalTransactions(parsedTransactions, accountAddress, network);
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
    if (!disableTxnWatcher || network !== NetworkType.mainnet) {
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

export const updateRefetchSavings = fetch => dispatch =>
  dispatch({
    payload: fetch,
    type: DATA_UPDATE_REFETCH_SAVINGS,
  });

// -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  assets: [], // for account-specific assets
  depots: [],
  merchantSafes: [],
  prepaidCards: [],
  genericAssets: {},
  isLoadingAssets: true,
  isLoadingTransactions: true,
  shouldRefetchSavings: false,
  transactions: [],
};

export default (state = INITIAL_STATE, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case DATA_UPDATE_REFETCH_SAVINGS:
        draft.shouldRefetchSavings = action.payload;
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
      case DATA_LOAD_ASSETS_SUCCESS:
        draft.assets = action.payload.assets;
        draft.depots = action.payload.depots;
        draft.prepaidCards = action.payload.prepaidCards;
        draft.merchantSafes = action.payload.merchantSafes;
        draft.isLoadingAssets = false;
        break;
      case DATA_LOAD_ASSETS_FAILURE:
        draft.isLoadingAssets = false;
        break;
      case DATA_ADD_NEW_TRANSACTION_SUCCESS:
        draft.transactions = action.payload;
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
