import { renderHook } from '@testing-library/react-hooks';

import { mockMainPoolTokenInfo } from '@cardstack/screens/RewardsCenterScreen/__tests__/mocks';
import useRewardsDataFetch from '@cardstack/screens/RewardsCenterScreen/useRewardsDataFetch';

import useRewardsPromoBanner from '../useRewardsPromoBanner';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useAccountSettings: () => ({
    accountAddress: '0x0000000000000000000',
    nativeCurrency: 'USD',
    network: 'sokol',
  }),
}));

jest.mock('@cardstack/screens/RewardsCenterScreen/useRewardsDataFetch', () =>
  jest.fn()
);

describe('RewardsPromoBanner', () => {
  it(`should have a button with the label 'Get Started' if the user has rewards to claim`, () => {
    (useRewardsDataFetch as jest.Mock).mockImplementation(() => ({
      mainPoolTokenInfo: mockMainPoolTokenInfo,
    }));

    const { result } = renderHook(() => useRewardsPromoBanner());

    expect(result.current.buttonLabel).toBe('Get Started');
  });

  it(`should have a button with the label 'Rewards' if the user doesn't have rewards to claim`, () => {
    (useRewardsDataFetch as jest.Mock).mockImplementation(() => ({
      mainPoolTokenInfo: undefined,
    }));

    const { result } = renderHook(() => useRewardsPromoBanner());

    expect(result.current.buttonLabel).toBe('Rewards');
  });

  it(`should show an icon inside the button if the user has rewards to claim`, () => {
    (useRewardsDataFetch as jest.Mock).mockImplementation(() => ({
      mainPoolTokenInfo: mockMainPoolTokenInfo,
    }));

    const { result } = renderHook(() => useRewardsPromoBanner());

    expect(result.current.buttonIcon).toEqual({
      name: 'rewards',
      size: 22,
      color: 'black',
      pathFillColor: 'black',
    });
  });

  it(`should NOT show an icon inside the button if the user doesn't have rewards to claim`, () => {
    (useRewardsDataFetch as jest.Mock).mockImplementation(() => ({
      mainPoolTokenInfo: undefined,
    }));

    const { result } = renderHook(() => useRewardsPromoBanner());

    expect(result.current.buttonIcon).toBe(undefined);
  });
});
