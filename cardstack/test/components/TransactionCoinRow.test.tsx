import Chance from 'chance';
import React from 'react';

import { render } from '../test-utils';
import { TransactionCoinRow, TransactionType } from '@cardstack/components';
import { getDollarsFromDai, numberWithCommas } from '@cardstack/utils';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

const chance = new Chance();

describe('TransactionCoinRow', () => {
  let transactionAmount: number, recipient: string, type: TransactionType;

  beforeEach(() => {
    transactionAmount = chance.natural();
    recipient = chance.guid();
    type = TransactionType.PAID;
  });

  it('should render the transaction amount correctly', () => {
    const { getByText } = render(
      <TransactionCoinRow
        transactionAmount={transactionAmount}
        recipient={recipient}
        type={type}
      />
    );

    getByText(`§${numberWithCommas(transactionAmount.toString())} SPEND`);
    getByText(
      `- $${numberWithCommas(
        getDollarsFromDai(transactionAmount).toFixed(2)
      )} USD`
    );
  });

  it('should render the recipient correctly', () => {
    const { getByText } = render(
      <TransactionCoinRow
        transactionAmount={transactionAmount}
        recipient={recipient}
        type={type}
      />
    );

    getByText(recipient);
  });
});
