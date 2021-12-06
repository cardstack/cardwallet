import { find, map } from 'lodash';
import { savePurchaseTransactions } from '../handlers/localstorage/accountLocal';
import TransactionStatusTypes from '../helpers/transactionStatusTypes';
import ethereumUtils from '../utils/ethereumUtils';

// extension to addCash reducer to avoid cyclic dependency between addCash and data reducers
export const ADD_CASH_UPDATE_PURCHASE_TRANSACTIONS =
  'addCash/ADD_CASH_UPDATE_PURCHASE_TRANSACTIONS';

export const addCashUpdatePurchases = purchases => (dispatch, getState) => {
  const { purchaseTransactions } = getState().addCash;
  const { accountAddress, network } = getState().settings;

  const updatedPurchases = map(purchaseTransactions, txn => {
    if (txn.status === TransactionStatusTypes.purchasing) {
      const updatedPurchase = find(
        purchases,
        purchase =>
          ethereumUtils.getHash(purchase) === ethereumUtils.getHash(txn)
      );
      if (updatedPurchase) {
        return {
          ...txn,
          ...updatedPurchase,
        };
      }
      return txn;
    }
    return txn;
  });

  dispatch({
    payload: updatedPurchases,
    type: ADD_CASH_UPDATE_PURCHASE_TRANSACTIONS,
  });
  savePurchaseTransactions(updatedPurchases, accountAddress, network);
};
