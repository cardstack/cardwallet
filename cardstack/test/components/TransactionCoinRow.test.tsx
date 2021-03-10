import React from 'react';

import { TransactionItem } from '../../src/types';
import { render } from '../test-utils';
import { createRandomTransactionItem } from '../test-utils/model-factory';
import { TransactionCoinRow } from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

describe('TransactionCoinRow', () => {
  let item: TransactionItem;

  const renderComponent = () => render(<TransactionCoinRow item={item} />);

  beforeEach(() => {
    item = createRandomTransactionItem();
  });

  it('should render the item title and name', () => {
    const { getByText } = renderComponent();

    getByText(item.title);
    getByText(item.name);
  });

  it('should render the transaction amount correctly', () => {
    const { getByText } = renderComponent();

    getByText(item.balance.display);
    getByText(`- ${item.native.display} USD`);
  });

  it('should not blow up if item is null', () => {
    item = null;

    renderComponent();
  });

  it('should not blow up if item.balance is null', () => {
    item.balance = null;

    renderComponent();
  });

  it('should not blow up if item.native is null', () => {
    item.native = null;

    renderComponent();
  });
});
