import Chance from 'chance';
import React from 'react';
import { render } from '../test-utils';
import { PrepaidCard } from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

const chance = new Chance();

describe('PrepaidCard', () => {
  it('should render correctly', () => {
    const issuer = chance.string();
    const id = chance.guid();
    const spendableBalance = chance.natural();

    render(
      <PrepaidCard
        issuer={issuer}
        id={id}
        spendableBalance={spendableBalance}
      />
    );
  });
});
