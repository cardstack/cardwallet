import { renderHook } from '@testing-library/react-hooks';

import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { Routes } from '@cardstack/navigation/routes';
import { useAuthSelector } from '@cardstack/redux/authSlice';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { usePersistedFlagsSelector } from '@cardstack/redux/persistedFlagsSlice';

import { useWallets } from '@rainbow-me/hooks';

jest.mock('@rainbow-me/hooks', () => ({
  useWallets: jest.fn(),
}));

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

describe('useShowOnboarding', () => {
  const mockUseWallets = (
    overwriteParams: Partial<ReturnType<typeof useWallets>> = {}
  ) => {
    (useWallets as jest.Mock).mockImplementation(() => ({
      selectedWallet: { manuallyBackedUp: true },
      walletReady: true,
      ...overwriteParams,
    }));
  };

  const mockPrimarySafeHelper = (
    overwriteParams: Partial<ReturnType<typeof usePrimarySafe>> = {}
  ) =>
    (usePrimarySafe as jest.Mock).mockImplementation(() => ({
      hasProfile: false,
      isLoadingOnInit: true,
      ...overwriteParams,
    }));

  beforeEach(() => {
    mockUseWallets();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should NOT navigate to profile flow when profile hasnt been fetched', () => {
    mockPrimarySafeHelper({ hasProfile: false, isLoadingOnInit: true });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).not.toBeCalled();
  });

  it('should navigate to profile flow when safes are loaded and no profile was found', () => {
    mockPrimarySafeHelper({
      hasProfile: false,
      isLoadingOnInit: false,
    });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).toBeCalledWith(Routes.PROFILE_SLUG);
  });

  it('should NOT navigate to profile flow when profile has been fetched and it exists', () => {
    mockPrimarySafeHelper({
      hasProfile: true,
      isLoadingOnInit: false,
    });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).not.toBeCalled();
  });

  it('should NOT navigate to profile flow if user has not wallet', () => {
    (useAuthSelector as jest.Mock).mockReturnValueOnce({
      hasWallet: false,
    });

    mockPrimarySafeHelper({
      hasProfile: false,
      isLoadingOnInit: false,
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

  it('should navigate to backup flow if not backedup', () => {
    mockUseWallets({ selectedWallet: { manuallyBackedUp: false } });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).toBeCalledWith(Routes.BACKUP_EXPLANATION);
  });

  it('should not navigate to backup flow if user already skipped backup', () => {
    mockUseWallets({ selectedWallet: { manuallyBackedUp: false } });
    (usePersistedFlagsSelector as jest.Mock).mockReturnValueOnce({
      hasSkippedBackup: true,
    });

    renderHook(useShowOnboarding);

    expect(mockedNavigate).not.toBeCalledWith(Routes.BACKUP_EXPLANATION);
  });
});
