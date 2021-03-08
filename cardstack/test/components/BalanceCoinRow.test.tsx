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
  let item: any, props: any;

  beforeEach(() => {
    item = {
      isHidden: false,
      isPinned: false,
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

    props = {
      item,
      onPress: jest.fn(),
      isEditing: false,
      selected: false,
    };
  });

  it('should render the item correctly if change is positive', () => {
    const { getByText } = render(<BalanceCoinRow {...props} />);

    getByText(item.name);
    getByText(item.balance.display);
    getByText(`${item.native.change}`);
  });

  it('should render change in green if it is positive', () => {
    const { getByText } = render(<BalanceCoinRow {...props} />);

    const change = getByText(`${item.native.change}`);

    expect(change).toHaveStyle({ color: colors.green });
  });

  it('should render change in blue if relative change is 0', () => {
    item.price.relative_change_24h = 0;
    const { getByText } = render(<BalanceCoinRow {...props} />);

    const change = getByText(`${item.native.change}`);

    expect(change).toHaveStyle({ color: colors.blueText });
  });

  it('should render change in blue if relative change is less than 0', () => {
    item.price.relative_change_24h = -1;
    const { getByText } = render(<BalanceCoinRow {...props} />);

    const change = getByText(`${item.native.change}`);

    expect(change).toHaveStyle({ color: colors.blueText });
  });

  it('should render the editing icon if isEditing', () => {
    props.isEditing = true;
    const { getByTestId } = render(<BalanceCoinRow {...props} />);

    getByTestId('coin-row-editing-icon-circle');
  });

  it('should render the editing icon with the correct name if selected if isEditing', () => {
    props.isEditing = true;
    props.selected = true;
    const { getByTestId } = render(<BalanceCoinRow {...props} />);

    getByTestId('coin-row-editing-icon-check-circle');
  });

  it('should render the icon with the correct name if item is hidden and isEditing', () => {
    props.isEditing = true;
    props.item.isHidden = true;
    const { getByTestId } = render(<BalanceCoinRow {...props} />);

    getByTestId('coin-row-icon-hidden');
  });

  it('should render the icon with the correct name if item is pinned and isEditing', () => {
    props.isEditing = true;
    props.item.isPinned = true;
    const { getByTestId } = render(<BalanceCoinRow {...props} />);

    getByTestId('coin-row-icon-pinned');
  });

  it('should render the coin row overlay if isEditing and the item is hidden', () => {
    props.isEditing = true;
    props.item.isHidden = true;
    const { getByTestId } = render(<BalanceCoinRow {...props} />);

    getByTestId(`coin-row-hidden-overlay`);
  });
});
