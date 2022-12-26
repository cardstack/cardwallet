import Chance from 'chance';
import React from 'react';

import { useAccountSettings } from '@rainbow-me/hooks';

import { render } from '../../test-utils';
import { BalanceCoinRow } from '../BalanceCoinRow';
const chance = new Chance();

jest.mock('@rainbow-me/hooks', () => ({
  useAccountSettings: jest.fn(),
}));

describe('BalanceCoinRow', () => {
  let item: any, props: any;

  beforeEach(() => {
    (useAccountSettings as jest.Mock).mockImplementation(() => ({
      network: 'gnosis',
    }));

    item = {
      isHidden: false,
      isPinned: false,
      symbol: 'ABCD',
      balance: {
        display: '2.45 ABCD',
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
      pinned: false,
      selected: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the item correctly', () => {
    const { getByText } = render(<BalanceCoinRow {...props} />);
    getByText(item.balance.display);
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
    props.hidden = true;
    const { getByTestId } = render(<BalanceCoinRow {...props} />);
    getByTestId('icon-eye-off');
  });

  it('should render the icon with the correct name if item is pinned and isEditing', () => {
    props.isEditing = true;
    props.pinned = true;
    const { getByTestId } = render(<BalanceCoinRow {...props} />);
    getByTestId('icon-pin');
  });

  it('should render the coin row overlay if isEditing and the item is hidden', () => {
    props.isEditing = true;
    props.hidden = true;
    const { getByTestId } = render(<BalanceCoinRow {...props} />);
    getByTestId('icon-eye-off');
  });
});
