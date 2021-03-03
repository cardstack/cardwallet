/* eslint-disable @typescript-eslint/camelcase */
import Chance from 'chance';
import React from 'react';

import { BalanceCoinRow } from '../../src/components/BalanceCoinRow';
import { render } from '../test-utils';
import { colors } from '@cardstack/theme';

const chance = new Chance();

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

describe('BalanceCoinRow', () => {
  let item: any;

  beforeEach(() => {
    item = {
      name: chance.string(),
      balance: {
        display: chance.string(),
      },
      native: {
        balance: {
          display: chance.string(),
        },
        change: chance.natural(),
      },
      price: {
        relative_change_24h: chance.natural(),
      },
    };
  });

  it('should render the item correctly if change is positive', () => {
    const { getByText } = render(<BalanceCoinRow item={item} />);

    getByText(item.name);
    getByText(item.balance.display);
    getByText(`${item.native.change}`);
  });

  it('should render change in green if it is positive', () => {
    const { getByText } = render(<BalanceCoinRow item={item} />);

    const change = getByText(`${item.native.change}`);

    expect(change).toHaveStyle({ color: colors.green });
  });

  it('should render change in blue if relative change is 0', () => {
    item.price.relative_change_24h = 0;
    const { getByText } = render(<BalanceCoinRow item={item} />);

    const change = getByText(`${item.native.change}`);

    expect(change).toHaveStyle({ color: colors.blueText });
  });

  it('should render change in blue if relative change is less than 0', () => {
    item.price.relative_change_24h = -1;
    const { getByText } = render(<BalanceCoinRow item={item} />);

    const change = getByText(`${item.native.change}`);

    expect(change).toHaveStyle({ color: colors.blueText });
  });
});
