import React from 'react';

import { useNameOrPreviewFromAddress } from '@cardstack/hooks/merchant/useNameOrPreviewFromAddress';
import {
  ERC20TransactionType,
  TransactionStatus,
  TransactionTypes,
} from '@cardstack/types';

import { useAccountProfile } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

import { render } from '../../../test-utils';
import { ERC20Transaction } from '../ERC20Transaction';

jest.mock('@rainbow-me/hooks', () => ({
  useAccountProfile: jest.fn(),
}));

jest.mock('@rainbow-me/redux/hooks', () => ({
  useRainbowSelector: jest.fn(),
}));

jest.mock('@cardstack/hooks/merchant/useNameOrPreviewFromAddress', () => ({
  useNameOrPreviewFromAddress: jest.fn(),
}));

describe('ERC20Transaction', () => {
  let item: ERC20TransactionType;

  const renderComponent = () => render(<ERC20Transaction item={item} />);
  beforeEach(() => {
    item = {
      from: '0xAa262652e7459693fdA194b33d288b487908E520',
      to: '0xf7FBF7200F2D98979858127baF22FB85c94f3592',
      balance: {
        amount: '5',
        display: '5.00 ETH',
      },
      hash:
        '0x57d91b5b7e5259c009e21f8d8e2ea06e7ea437ff4a2e5391fdc47de573cef3fd-0',
      minedAt: 1615326853,
      native: {
        amount: '5',
        display: '$5.00',
      },
      status: TransactionStatus.sent,
      symbol: 'ETH',
      title: 'Sent',
      type: TransactionTypes.ERC_20,
    };

    (useAccountProfile as jest.Mock).mockImplementation(() => ({
      accountAddress: '1234567890',
      accountName: 'foo',
    }));

    (useNameOrPreviewFromAddress as jest.Mock).mockImplementation(() => ({
      name: 'BizName',
    }));

    (useRainbowSelector as jest.Mock).mockImplementation(cb =>
      cb({ settings: { network: 'gnosis' } })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the item title and name', () => {
    const { getByText } = renderComponent();

    getByText(item.title);
  });

  it('should render the transaction amount correctly', () => {
    const { getByText } = renderComponent();
    getByText(`- ${item.balance.display}`);
    getByText(item.native.display);
  });
});
