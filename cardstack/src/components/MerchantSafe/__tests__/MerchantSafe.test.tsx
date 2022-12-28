import React from 'react';

import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

import { render } from '../../../test-utils';
import { MerchantSafe } from '../MerchantSafe';
import { strings } from '../strings';

const merchantSafe = {
  address: '0xAddress',
  network: 'Gnosis',
  infoDID: 'DID',
  tokens: [],
  revenueBalances: [],
  accumulatedSpendValue: 100,
  type: '',
  merchantInfo: {
    did: 'DID',
    name: 'Safe Name',
    slug: '0xSlug',
    color: 'green',
    textColor: 'black',
    ownerAddress: '0xOwner',
  },
};

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useAccountSettings: jest
    .fn()
    .mockImplementation(() => ({ network: 'gnosis' })),
}));

jest.mock(
  '@rainbow-me/components/contacts/ContactAvatar',
  () => 'ContactAvatar'
);

jest.mock('@cardstack/redux/hooks/usePrimarySafe', () => ({
  usePrimarySafe: jest.fn(),
}));

describe('MerchantSafe', () => {
  const mockUsePrimarySafeHelper = (
    overwriteProps?: Partial<ReturnType<typeof usePrimarySafe>>
  ) =>
    (usePrimarySafe as jest.Mock).mockImplementation(() => ({
      primarySafe: merchantSafe,
      ...overwriteProps,
    }));

  beforeEach(() => {
    mockUsePrimarySafeHelper();
  });

  it('should match merchant name', () => {
    const { getByTestId } = render(<MerchantSafe {...merchantSafe} />);

    const name = getByTestId('merchant-name');

    expect(name).toHaveTextContent(merchantSafe.merchantInfo.name);
  });

  it('should match merchant slug', () => {
    const { getByTestId } = render(<MerchantSafe {...merchantSafe} />);

    const slug = getByTestId('merchant-slug');

    expect(slug).toHaveTextContent(merchantSafe.merchantInfo.slug);
  });

  it('should state if primary', () => {
    const { getByText } = render(<MerchantSafe {...merchantSafe} />);

    const primary = getByText(strings.primaryProfile);

    expect(primary).toBeDefined();
  });

  it('should not say anything if not primary', () => {
    mockUsePrimarySafeHelper({
      primarySafe: { ...merchantSafe, address: 'Not Primary' },
    });

    const { queryByText } = render(<MerchantSafe {...merchantSafe} />);

    const primary = queryByText(strings.primaryProfile);

    expect(primary).toBeNull();
  });
});
