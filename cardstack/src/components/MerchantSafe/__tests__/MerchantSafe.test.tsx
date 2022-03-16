import React from 'react';
import { render } from '../../../test-utils';
import { MerchantSafe } from '../MerchantSafe';
import { strings } from '../strings';

const merchantSafe = {
  address: '0xAddress',
  network: 'Gnosis',
  infoDID: 'DID',
  tokens: [],
  revenueBalances: [],
  accumulatedSpendValue: '100',
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
const mock_navigate = jest.fn();
jest.mock('@rainbow-me/navigation', () => ({
  useNavigation: () => ({
    navigate: mock_navigate,
  }),
}));

jest.mock(
  '@rainbow-me/components/contacts/ContactAvatar',
  () => 'ContactAvatar'
);

jest.mock('@cardstack/redux/hooks/usePrimarySafe', () => ({
  usePrimarySafe: () => merchantSafe,
}));

describe('MerchantSafe', () => {
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
});
