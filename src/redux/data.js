import { isZero } from '@cardstack/cardpay-sdk';
import { concat, isEmpty, partition, toLower } from 'lodash';

import {
  getLocalTransactions,
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

import { getTransactionReceipt } from '../handlers/web3';

let pendingTransactionsHandle = null;
const TXN_WATCHER_MAX_TRIES = 60;
const TXN_WATCHER_POLL_INTERVAL = 5000; // 5 seconds

// -- Constants --------------------------------------- //

const DATA_UPDATE_TRANSACTIONS = 'data/DATA_UPDATE_TRANSACTIONS';

const DATA_LOAD_TRANSACTIONS_REQUEST = 'data/DATA_LOAD_TRANSACTIONS_REQUEST';
const DATA_LOAD_TRANSACTIONS_SUCCESS = 'data/DATA_LOAD_TRANSACTIONS_SUCCESS';
const DATA_LOAD_TRANSACTIONS_FAILURE = 'data/DATA_LOAD_TRANSACTIONS_FAILURE';

const DATA_ADD_NEW_TRANSACTION_SUCCESS =
  'data/DATA_ADD_NEW_TRANSACTION_SUCCESS';

const DATA_CLEAR_STATE = 'data/DATA_CLEAR_STATE';

// -- Actions ---------------------------------------- //
export const dataLoadTxState = () => async (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
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

export const dataAddNewTransaction = (txDetails, txNetwork) => async (
  dispatch,
  getState
) => {
  const { transactions } = getState().data;
  const { accountAddress, nativeCurrency, network } = getState().settings;

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

    const enableWatcher = !txNetwork || txNetwork === network;

    if (enableWatcher) {
      dispatch(watchPendingTransactions(accountAddress));
    }

    return parsedTransaction;
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

// -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  isLoadingTransactions: true,
  transactions: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DATA_UPDATE_TRANSACTIONS:
    case DATA_LOAD_TRANSACTIONS_SUCCESS:
    case DATA_ADD_NEW_TRANSACTION_SUCCESS:
      return {
        ...state,
        isLoadingTransactions: false,
        transactions: [...state.transactions, ...action.payload],
      };
    case DATA_LOAD_TRANSACTIONS_REQUEST:
      return {
        ...state,
        isLoadingTransactions: true,
      };
    case DATA_LOAD_TRANSACTIONS_FAILURE:
      return {
        ...state,
        isLoadingTransactions: false,
      };
    default:
      return INITIAL_STATE;
  }
};
