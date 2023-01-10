import { format } from 'date-fns';
import { get, groupBy, isEmpty, map, toLower } from 'lodash';
import { createElement } from 'react';
import { createSelector } from 'reselect';

import { ERC20Transaction } from '@cardstack/components';

import { RequestCoinRow } from '../components/coin-row';
import TransactionStatusTypes from '../helpers/transactionStatusTypes';

import {
  thisMonthTimestamp,
  thisYearTimestamp,
  todayTimestamp,
  yesterdayTimestamp,
} from './transactions';

const contactsSelector = state => state.contacts;
const requestsSelector = state => state.requests;
const transactionsSelector = state => state.transactions;

const renderItemElement = renderItem =>
  function InternarSectionListRender(renderItemProps) {
    return createElement(renderItem, renderItemProps);
  };
const groupTransactionByDate = ({ pending, minedAt }) => {
  if (pending) return 'Pending';

  const ts = parseInt(minedAt) * 1000;

  if (ts > todayTimestamp) return 'Today';
  if (ts > yesterdayTimestamp) return 'Yesterday';
  if (ts > thisMonthTimestamp) return 'This Month';

  return format(ts, `MMMM${ts > thisYearTimestamp ? '' : ' yyyy'}`);
};

const addContactInfo = contacts => txn => {
  const { from, to, status } = txn;
  const isSent = status === TransactionStatusTypes.sent;
  const contactAddress = isSent ? to : from;
  const contact = get(contacts, `${[toLower(contactAddress)]}`, null);
  return {
    ...txn,
    contact,
  };
};

const buildTransactionsSections = (contacts, requests, transactions) => {
  let sectionedTransactions = [];

  const transactionsWithContacts = map(transactions, addContactInfo(contacts));

  if (!isEmpty(transactionsWithContacts)) {
    const transactionsByDate = groupBy(
      transactionsWithContacts,
      groupTransactionByDate
    );
    sectionedTransactions = Object.keys(transactionsByDate).map(section => ({
      data: transactionsByDate[section],
      renderItem: renderItemElement(ERC20Transaction),
      title: section,
    }));
  }

  let requestsToApprove = [];
  if (!isEmpty(requests)) {
    requestsToApprove = [
      {
        data: requests,
        renderItem: renderItemElement(RequestCoinRow),
        title: 'Requests',
      },
    ];
  }
  return {
    sections: [...requestsToApprove, ...sectionedTransactions],
  };
};

export const buildTransactionsSectionsSelector = createSelector(
  [contactsSelector, requestsSelector, transactionsSelector],
  buildTransactionsSections
);
