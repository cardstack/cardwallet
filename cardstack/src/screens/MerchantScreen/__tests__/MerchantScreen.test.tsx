import React from 'react';
import { render, fireEvent, act } from '../../../test-utils';
import MerchantScreen from '../MerchantScreen';
import { useMerchantScreen } from '../useMerchantScreen';

// import { strings } from '@cardstack/components/MerchantContent/strings';

jest.mock('../useMerchantScreen', () => ({
  useMerchantScreen: jest.fn(),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useDimensions: () => ({
    isTinyPhone: false,
  }),
}));

jest.mock('@rainbow-me/redux/hooks', () => ({
  useRainbowSelector: jest.fn().mockImplementation(() => 'xdai'),
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
jest.mock('@react-navigation/core', () => ({
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
});
