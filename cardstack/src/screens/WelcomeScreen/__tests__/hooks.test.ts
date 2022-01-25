import { act, renderHook } from '@testing-library/react-hooks';
import { useWelcomeScreen } from '../hooks';
import * as cloudBackup from '@rainbow-me/handlers/cloudBackup';
import { Device } from '@cardstack/utils/device';
import Routes from '@rainbow-me/routes';

// Mock navigation
const mockedNavigate = jest.fn();
const mockedReplace = jest.fn();
jest.mock('@react-navigation/core', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
    replace: mockedReplace,
  }),
}));

// Mock hideSplash
const mockedHideSplashScreen = jest.fn();
jest.mock('@rainbow-me/hooks', () => ({
  useHideSplashScreen: () => mockedHideSplashScreen,
}));

describe('useWelcomeScreen', () => {
  Device.isIOS = true;

  const mockedUserData = {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    secrets: { foo: 'bar' },
  };

  const spyIsCloudAvailable = jest
    .spyOn(cloudBackup, 'isCloudBackupAvailable')
    .mockReturnValue(Promise.resolve(true));

  jest.spyOn(cloudBackup, 'syncCloud').mockReturnValue(Promise.resolve(true));

  const fetchUserDataFromCloud = jest
    .spyOn(cloudBackup, 'fetchUserDataFromCloud')
    .mockResolvedValue(Promise.resolve(mockedUserData));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should check if there is cloud info on start', async () => {
    const { waitForNextUpdate } = renderHook(() => useWelcomeScreen());

    await waitForNextUpdate();

    expect(spyIsCloudAvailable).toBeCalledTimes(1);
    expect(fetchUserDataFromCloud).toBeCalledTimes(1);
  });

  it('should navigate to RestoreSheet on onAddExistingWallet press with userData', async () => {
    const { waitForNextUpdate, result } = renderHook(() => useWelcomeScreen());

    await waitForNextUpdate();

    act(() => {
      result.current.onAddExistingWallet();
    });

    expect(mockedNavigate).toBeCalledWith(Routes.RESTORE_SHEET, {
      userData: mockedUserData,
    });
  });

  it('should navigate to RestoreSheet on onAddExistingWallet press without userData', async () => {
    spyIsCloudAvailable.mockReturnValue(Promise.resolve(false));

    const { result } = renderHook(() => useWelcomeScreen());

    act(() => {
      result.current.onAddExistingWallet();
    });

    expect(mockedNavigate).toBeCalledWith(Routes.RESTORE_SHEET, {
      userData: null,
    });
  });

  it('should replace the current screen with WalletScreen on onCreateWallet press', async () => {
    const { result } = renderHook(() => useWelcomeScreen());

    act(() => {
      result.current.onCreateWallet();
    });

    expect(mockedReplace).toBeCalledWith(Routes.SWIPE_LAYOUT, {
      params: { emptyWallet: true },
      screen: Routes.WALLET_SCREEN,
    });
  });
});
