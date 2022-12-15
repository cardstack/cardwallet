import { isZero } from '@cardstack/cardpay-sdk';
import produce from 'immer';
import { concat, isEmpty, partition, toLower } from 'lodash';
import { getTransactionReceipt } from '../handlers/web3';
import { NetworkType } from '@cardstack/types';
import {
  getDepots,
  getLocalTransactions,
  getMerchantSafes,
  getPrepaidCards,
  saveLocalTransactions,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import DirectionTypes from '@rainbow-me/helpers/transactionDirectionTypes';
import TransactionStatusTypes from '@rainbow-me/helpers/transactionStatusTypes';
import TransactionTypes from '@rainbow-me/helpers/transactionTypes';
import {
  getTitle,
  getTransactionLabel,
  parseNewTransaction,
} from '@rainbow-me/parsers';
import { ethereumUtils } from '@rainbow-me/utils';
import logger from 'logger';

let pendingTransactionsHandle = null;
const TXN_WATCHER_MAX_TRIES = 60;
const TXN_WATCHER_POLL_INTERVAL = 5000; // 5 seconds

// -- Constants --------------------------------------- //

const DATA_UPDATE_ASSETS = 'data/DATA_UPDATE_ASSETS';
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
      { prepaidCards },
      { depots },
      { merchantSafes },
    ] = await Promise.all([
      getPrepaidCards(accountAddress, network),
      getDepots(accountAddress, network),
      getMerchantSafes(accountAddress, network),
    ]);
    dispatch({
      payload: {
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
