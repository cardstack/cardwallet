import Chance from 'chance';
import React from 'react';
import { act } from 'react-test-renderer';

import { TransactionItem } from '../../src/types';
import { fireEvent, render } from '../test-utils';
import { createRandomTransactionItem } from '../test-utils/model-factory';
import { PrepaidCard } from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

const chance = new Chance();

describe('PrepaidCard', () => {
  let issuer: string,
    id: string,
    spendableBalance: number,
    recentActivity: {
      title: string;
      data: TransactionItem[];
    }[];

  const createRandomActivityItem = () => ({
    title: chance.word(),
    data: chance.n(createRandomTransactionItem, chance.d6()),
  });

  beforeEach(() => {
    issuer = chance.string();
    id = chance.guid();
    spendableBalance = chance.natural();
    recentActivity = chance.n(createRandomActivityItem, chance.d6());
  });

  it('should render the issuer name', () => {
    const { getByText } = render(
      <PrepaidCard
        issuer={issuer}
        id={id}
        spendableBalance={spendableBalance}
        recentActivity={recentActivity}
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
        recentActivity={recentActivity}
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
        recentActivity={recentActivity}
      />
    );

    getByText('§1,000');
    getByText('$10.00 USD');
  });

  it('should show an expanded card when the prepaid card is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <PrepaidCard
        issuer={issuer}
        id={id}
        spendableBalance={spendableBalance}
        recentActivity={recentActivity}
      />
    );

    const prepaidCard = getByTestId('prepaid-card');

    expect(queryByTestId('expanded-card')).toBeNull();

    act(() => {
      fireEvent.press(prepaidCard);
    });

    getByTestId('expanded-card');
  });
});
