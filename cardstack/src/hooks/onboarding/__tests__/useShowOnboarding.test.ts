import { renderHook, act, waitFor } from '@testing-library/react-native';

import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { needsNotificationPermission } from '@cardstack/models/firebase';
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
  usePersistedFlagsSelector: jest.fn(),
}));

jest.mock('@cardstack/models/firebase', () => ({
  needsNotificationPermission: jest.fn(),
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

  const mockNeedsNotificationPermission = (needsAsk = false) =>
    (needsNotificationPermission as jest.Mock).mockResolvedValue(needsAsk);

  const mockUsePersistedFlagsSelector = (
    overwriteParams: Partial<ReturnType<typeof usePersistedFlagsSelector>> = {}
  ) => {
    (usePersistedFlagsSelector as jest.Mock).mockImplementation(() => ({
      hasSkippedNotificationPermission: false,
      hasSkippedBackup: false,
      hasSkippedProfileCreation: false,
      ...overwriteParams,
    }));
  };

  beforeEach(() => {
    mockUseWallets();
    mockNeedsNotificationPermission();
    mockUsePersistedFlagsSelector();
    mockPrimarySafeHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to notification permission flow when still not granted and has not skipped', async () => {
    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() =>
      expect(mockedNavigate).toBeCalledWith(Routes.NOTIFICATIONS_PERMISSION)
    );
  });

  it('should NOT navigate to notification permission when user has skipped', async () => {
    mockNeedsNotificationPermission(true);
    mockUsePersistedFlagsSelector({
      hasSkippedNotificationPermission: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() =>
      expect(mockedNavigate).not.toBeCalledWith(Routes.NOTIFICATIONS_PERMISSION)
    );
  });

  it('should NOT navigate to profile flow when profile hasnt been fetched', async () => {
    mockPrimarySafeHelper({ hasProfile: false, isLoadingOnInit: true });

    mockUsePersistedFlagsSelector({
      hasSkippedBackup: true,
      hasSkippedNotificationPermission: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() => expect(mockedNavigate).not.toBeCalled());
  });

  it('should navigate to profile flow when safes are loaded and no profile was found', async () => {
    mockPrimarySafeHelper({
      hasProfile: false,
      isLoadingOnInit: false,
    });

    mockUsePersistedFlagsSelector({
      hasSkippedNotificationPermission: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() =>
      expect(mockedNavigate).toBeCalledWith(Routes.PROFILE_SLUG)
    );
  });

  it('should NOT navigate to profile flow when safes are loading', async () => {
    mockPrimarySafeHelper({
      hasProfile: false,
      isLoadingOnInit: true,
    });

    mockUsePersistedFlagsSelector({
      hasSkippedBackup: true,
      hasSkippedNotificationPermission: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() => expect(mockedNavigate).not.toBeCalled());
  });

  it('should NOT navigate to profile flow when profile has been fetched and it exists', async () => {
    mockPrimarySafeHelper({
      hasProfile: true,
      isLoadingOnInit: false,
    });

    mockUsePersistedFlagsSelector({
      hasSkippedBackup: true,
      hasSkippedNotificationPermission: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() => expect(mockedNavigate).not.toBeCalled());
  });

  it('should NOT navigate to profile flow if no wallet', async () => {
    (useAuthSelector as jest.Mock).mockReturnValueOnce({
      hasWallet: false,
    });

    mockPrimarySafeHelper({
      hasProfile: false,
      isLoadingOnInit: false,
    });

    mockUsePersistedFlagsSelector({
      hasSkippedBackup: true,
      hasSkippedNotificationPermission: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() => expect(mockedNavigate).not.toBeCalled());
  });

  it('should NOT navigate to profile creation flow if "Skip" was pressed', async () => {
    mockUsePersistedFlagsSelector({
      hasSkippedProfileCreation: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() => expect(mockedNavigate).not.toBeCalled());
  });

  it('should navigate to backup flow if not backedup', async () => {
    mockUseWallets({ selectedWallet: { manuallyBackedUp: false } });

    mockPrimarySafeHelper({
      hasProfile: true,
      isLoadingOnInit: false,
    });

    mockUsePersistedFlagsSelector({
      hasSkippedNotificationPermission: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() =>
      expect(mockedNavigate).toBeCalledWith(Routes.BACKUP_EXPLANATION)
    );
  });

  it('should not navigate to backup flow if user already skipped backup', async () => {
    mockUseWallets({ selectedWallet: { manuallyBackedUp: false } });
    mockUsePersistedFlagsSelector({
      hasSkippedBackup: true,
    });

    const { result } = renderHook(useShowOnboarding);

    act(() => {
      result.current.navigateToNextOnboardingStep();
    });

    await waitFor(() =>
      expect(mockedNavigate).not.toBeCalledWith(Routes.BACKUP_EXPLANATION)
    );
  });
});
