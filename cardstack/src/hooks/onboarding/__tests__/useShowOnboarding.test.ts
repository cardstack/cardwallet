import { renderHook } from '@testing-library/react-hooks';

import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { Routes } from '@cardstack/navigation/routes';
import { useAuthSelector } from '@cardstack/redux/authSlice';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { usePersistedFlagsSelector } from '@cardstack/redux/persistedFlagsSlice';

jest.mock('@cardstack/redux/hooks/usePrimarySafe', () => ({
  usePrimarySafe: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

jest.mock('@cardstack/redux/authSlice', () => ({
  useAuthSelector: jest.fn().mockReturnValue({
    hasWallet: true,
  }),
}));

jest.mock('@cardstack/redux/persistedFlagsSlice', () => ({
  usePersistedFlagsSelector: jest.fn().mockReturnValue({
    hasSkippedProfileCreation: false,
  }),
}));

const mockPrimarySafeHelper = (overwriteParams?: any) =>
  (usePrimarySafe as jest.Mock).mockImplementation(() => ({
    primarySafe: undefined,
    hasFetchedProfile: false,
    ...overwriteParams,
  }));

describe('useShowOnboarding', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to profile flow when profile has been fetched and no profile is found', () => {
    mockPrimarySafeHelper({
      hasFetchedProfile: true,
      primarySafe: undefined,
    });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).toBeCalledWith(Routes.PROFILE_SLUG);
  });

  it('should NOT navigate to profile flow when user has already accessed the onboarding', () => {
    mockPrimarySafeHelper({
      hasFetchedProfile: true,
      primarySafe: undefined,
    });

    // First render
    const { rerender } = renderHook(useShowOnboarding);

    // Second render
    rerender();

    // Called just on first render
    expect(mockedNavigate).toBeCalledTimes(1);
  });

  it('should NOT navigate to profile flow when profile hasnt been fetched', () => {
    mockPrimarySafeHelper();

    renderHook(useShowOnboarding);

    expect(mockedNavigate).not.toBeCalled();
  });

  it('should NOT navigate to profile flow when profile has been fetched and it exists', () => {
    mockPrimarySafeHelper({
      hasFetchedProfile: true,
      primarySafe: { slug: '1223' },
    });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).not.toBeCalled();
  });

  it('should NOT navigate to profile flow if user has not wallet', () => {
    (useAuthSelector as jest.Mock).mockReturnValueOnce({
      hasWallet: false,
    });

    mockPrimarySafeHelper({
      hasFetchedProfile: true,
      primarySafe: undefined,
    });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).not.toBeCalled();
  });

  it('should NOT navigate to profile creation flow if "Skip" was pressed', () => {
    (usePersistedFlagsSelector as jest.Mock).mockReturnValueOnce({
      hasSkippedProfileCreation: true,
    });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).not.toBeCalled();
  });
});
