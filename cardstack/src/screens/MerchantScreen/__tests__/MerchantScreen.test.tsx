import React from 'react';

import { strings } from '@cardstack/components/MerchantContent/strings';

import { render } from '../../../test-utils';
import MerchantScreen from '../MerchantScreen';
import { useMerchantScreen } from '../useMerchantScreen';

const merchantSafeInfo = {
  isRefreshingBalances: false,
  merchantSafe: {
    address: '0xAddress',
    network: 'Gnosis',
    infoDID: 'DID',
    tokens: [],
    revenueBalances: [],
    merchantInfo: {
      did: 'DID',
      name: 'Safe Name',
      slug: '0xSlug',
      color: 'green',
      textColor: 'black',
      ownerAddress: '0xOwner',
    },
  },
  safesCount: 2,
  isPrimarySafe: false,
};

jest.mock('../useMerchantScreen', () => ({
  useMerchantScreen: jest.fn(),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useDimensions: () => ({
    isTinyPhone: false,
  }),
  useAccountSettings: jest
    .fn()
    .mockImplementation(() => ({ network: 'gnosis' })),
}));

// Mock useClaimAllRevenue
const mock_onClaimAllPress = jest.fn();
jest.mock(
  '@cardstack/screens/sheets/UnclaimedRevenue/useClaimAllRevenue',
  () => ({
    useClaimAllRevenue: () => ({ onClaimAllPress: mock_onClaimAllPress }),
  })
);

// Mock navigation
const mock_goBack = jest.fn();
const mock_navigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mock_goBack,
    navigate: mock_navigate,
  }),
}));

jest.mock(
  '@rainbow-me/components/contacts/ContactAvatar',
  () => 'ContactAvatar'
);

describe('MerchantScreen', () => {
  const changeToPrimarySafe = jest.fn();

  const mockuseMerchantScreenHelper = (
    overwriteProps?: Partial<ReturnType<typeof useMerchantScreen>>
  ) =>
    (useMerchantScreen as jest.Mock).mockImplementation(() => ({
      ...merchantSafeInfo,
      changeToPrimarySafe,
      ...overwriteProps,
    }));

  beforeEach(() => {
    mockuseMerchantScreenHelper();
  });

  it('should contain header', () => {
    const { getByTestId } = render(<MerchantScreen />);

    const header = getByTestId('merchant-header');

    expect(header).toBeDefined();
  });

  it('should match merchant name', () => {
    const { getByTestId } = render(<MerchantScreen />);

    const name = getByTestId('merchant-name');

    expect(name).toHaveTextContent(
      merchantSafeInfo.merchantSafe.merchantInfo.name
    );
  });

  it('should match merchant slug', () => {
    const { getByTestId } = render(<MerchantScreen />);

    const slug = getByTestId('merchant-slug');

    expect(slug).toHaveTextContent(
      merchantSafeInfo.merchantSafe.merchantInfo.slug
    );
  });

  it('should state if primary', () => {
    mockuseMerchantScreenHelper({ isPrimarySafe: true });

    const { getByText } = render(<MerchantScreen />);

    const primary = getByText(strings.isPrimarySafeProfileLinkText);

    expect(primary).toBeDefined();
  });
});
