import { renderHook } from '@testing-library/react-hooks';

import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { remoteFlags } from '@cardstack/services/remote-config';

jest.mock('@cardstack/redux/hooks/usePrimarySafe', () => ({
  usePrimarySafe: jest.fn(),
}));

jest.mock('@cardstack/services/remote-config', () => ({
  remoteFlags: jest.fn().mockReturnValue({
    featureProfilePurchaseOnboarding: true,
  }),
}));

const mockPrimarySafeHelper = (overwriteParams?: any) =>
  (usePrimarySafe as jest.Mock).mockImplementation(() => ({
    primarySafe: undefined,
    isFetching: false,
    isLoading: false,
    isUninitialized: true,
    ...overwriteParams,
  }));

describe('useShowOnboarding', () => {
  it('should have shouldPresentOnboarding flag as FALSE when it`s uninitialized', () => {
    mockPrimarySafeHelper();

    const {
      result: {
        current: { shouldPresentOnboarding },
      },
    } = renderHook(() => useShowOnboarding());

    expect(shouldPresentOnboarding()).toBe(false);
  });

  it('should have shouldPresentOnboarding flag as FALSE while it`s loading', () => {
    mockPrimarySafeHelper({ isLoading: true, isUninitialized: false });

    const {
      result: {
        current: { shouldPresentOnboarding },
      },
    } = renderHook(() => useShowOnboarding());

    expect(shouldPresentOnboarding()).toBe(false);
  });

  it('should have shouldPresentOnboarding flag as FALSE while it`s fetching', () => {
    mockPrimarySafeHelper({
      isFetching: true,
      isLoading: false,
      isUninitialized: false,
    });

    const {
      result: {
        current: { shouldPresentOnboarding },
      },
    } = renderHook(() => useShowOnboarding());

    expect(shouldPresentOnboarding()).toBe(false);
  });

  it('should have shouldPresentOnboarding flag as FALSE when user already has profile', () => {
    mockPrimarySafeHelper({
      primarySafe: { slug: '12323' },
      isLoading: false,
      isUninitialized: false,
    });

    const {
      result: {
        current: { shouldPresentOnboarding },
      },
    } = renderHook(() => useShowOnboarding());

    expect(shouldPresentOnboarding()).toBe(false);
  });

  it('should have shouldPresentOnboarding flag as FALSE if remote flag is disabled', () => {
    (remoteFlags as jest.Mock).mockReturnValueOnce({
      featureProfilePurchaseOnboarding: false,
    });

    mockPrimarySafeHelper({
      primarySafe: undefined,
      isLoading: false,
      isUninitialized: false,
    });

    const {
      result: {
        current: { shouldPresentOnboarding },
      },
    } = renderHook(() => useShowOnboarding());

    expect(shouldPresentOnboarding()).toBe(false);
  });

  it('should have shouldPresentOnboarding flag as TRUE when remote flag is enabled, info has been fetched AND user doesn`t own a profile', () => {
    (remoteFlags as jest.Mock).mockReturnValueOnce({
      featureProfilePurchaseOnboarding: true,
    });

    mockPrimarySafeHelper({
      primarySafe: undefined,
      isUninitialized: false,
    });

    const {
      result: {
        current: { shouldPresentOnboarding },
      },
    } = renderHook(() => useShowOnboarding());

    expect(shouldPresentOnboarding()).toBe(true);
  });
});
