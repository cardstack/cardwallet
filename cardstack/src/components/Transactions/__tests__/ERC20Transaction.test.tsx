import React from 'react';

import { ERC20TransactionType } from '../../../types';
import { render } from '../../../test-utils';
import { createRandomTransactionItem } from '../../../test-utils/model-factory';
import { ERC20Transaction } from '../ERC20Transaction';

describe('ERC20Transaction', () => {
  let item: ERC20TransactionType;

  const renderComponent = () => render(<ERC20Transaction item={item} />);

  beforeEach(() => {
    item = createRandomTransactionItem();
  });

  it('should render the item title and name', () => {
    const { debug, getByText } = renderComponent();
    debug();
    getByText(item.title);
  });

  it('should render the transaction amount correctly', () => {
    const { getByText } = renderComponent();

    getByText(item.balance.display);
    getByText(`- ${item.native.display} USD`);
  });

  it('should not blow up if item is null', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    item = null;

    renderComponent();
  });

  it('should not blow up if item.balance is null', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    item.balance = null;

    renderComponent();
  });

  it('should not blow up if item.native is null', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    item.native = null;

    renderComponent();
  });
});
