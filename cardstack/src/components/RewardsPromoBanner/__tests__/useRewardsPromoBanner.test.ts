import { act, renderHook } from '@testing-library/react-native';

import { Routes } from '@cardstack/navigation';

import useRewardsPromoBanner from '../useRewardsPromoBanner';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@cardstack/navigation', () => ({
  Routes: {
    REWARDS_CENTER_SCREEN: 'RewardsCenterScreen',
  },
}));

describe('RewardsPromoBanner', () => {
  it(`should have a title saying "You have unclaimed rewards waiting!" if the user has rewards to claim`, () => {
    const hasRewardsProps = true;

    const { result } = renderHook(() => useRewardsPromoBanner(hasRewardsProps));

    expect(result.current.title).toBe('You have unclaimed rewards waiting!');
  });

  it(`should have a button with the label 'Get Started' if the user has rewards to claim`, () => {
    const hasRewardsProps = true;

    const { result } = renderHook(() => useRewardsPromoBanner(hasRewardsProps));

    expect(result.current.btnLabel).toBe('Get Started');
  });

  it(`should have a title saying "Check your rewards eligibility" if the user has rewards to claim`, () => {
    const hasRewardsProps = false;

    const { result } = renderHook(() => useRewardsPromoBanner(hasRewardsProps));

    expect(result.current.title).toBe('Check your rewards eligibility');
  });

  it(`should have a button with the label 'Rewards' if the user doesn't have rewards to claim`, () => {
    const hasRewardsProps = false;

    const { result } = renderHook(() => useRewardsPromoBanner(hasRewardsProps));

    expect(result.current.btnLabel).toBe('Rewards');
  });

  it('should redirect to Rewards Center route when tapping the banner button', () => {
    const hasRewardsProps = true;

    const { result } = renderHook(() => useRewardsPromoBanner(hasRewardsProps));

    act(() => {
      result.current.onPress();
    });

    expect(mockNavigate).toBeCalledWith(Routes.REWARDS_CENTER_SCREEN);
  });
});
