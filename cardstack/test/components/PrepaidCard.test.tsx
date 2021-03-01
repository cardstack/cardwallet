import Chance from 'chance';
import React from 'react';

import { render } from '../test-utils';
import { PrepaidCard } from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

const chance = new Chance();

describe('PrepaidCard', () => {
  let issuer: string, id: string, spendableBalance: number;

  beforeEach(() => {
    issuer = chance.string();
    id = chance.guid();
    spendableBalance = chance.natural();
  });

  it('should render the issuer name', () => {
    const { getByText } = render(
      <PrepaidCard
        issuer={issuer}
        id={id}
        spendableBalance={spendableBalance}
      />
    );

    getByText(issuer);
  });

  it('should render the identifier correctly', () => {
    const { getByText, queryByText } = render(
      <PrepaidCard
        issuer={issuer}
        id={id}
        spendableBalance={spendableBalance}
      />
    );

    getByText(id.slice(0, 6));
    getByText(id.slice(-4));
    expect(queryByText(id)).toBeNull();
  });

  it('should correctly render the spendable balance in dai and USD', () => {
    spendableBalance = 1000;

    const { getByText } = render(
      <PrepaidCard
        issuer={issuer}
        id={id}
        spendableBalance={spendableBalance}
      />
    );

    getByText('§1,000');
    getByText('$10.00 USD');
  });
});
