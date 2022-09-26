import { act, renderHook } from '@testing-library/react-hooks';

import * as rnCloud from '@cardstack/models';
import { Routes } from '@cardstack/navigation/routes';
import { Device } from '@cardstack/utils/device';

import { useWelcomeScreen } from '../hooks';

// Mock navigation
const mockedNavigate = jest.fn();
const mockedReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
    reset: mockedReset,
  }),
}));

// Mock rainbow hooks
const mockedHideSplashScreen = jest.fn();
const mockedCreateWallet = jest.fn();

jest.mock('@rainbow-me/hooks', () => ({
  useHideSplashScreen: () => mockedHideSplashScreen,
  useWalletManager: () => ({ createNewWallet: mockedCreateWallet }),
}));

jest.mock('@rainbow-me/utils', () => ({
  magicMemo: jest.fn(),
  neverRerender: jest.fn(),
}));

const mockedShowOverlay = jest.fn();
jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: mockedShowOverlay,
  }),
}));

describe('useWelcomeScreen', () => {
  Device.isIOS = true;

  const mockedUserData = {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    secrets: { foo: 'bar' },
  };

  const spyIsCloudAvailable = jest
    .spyOn(rnCloud, 'isCloudBackupAvailable')
    .mockReturnValue(Promise.resolve(true));

  jest.spyOn(rnCloud, 'syncCloud').mockReturnValue(Promise.resolve(true));

  const fetchUserDataFromCloud = jest
    .spyOn(rnCloud, 'fetchUserDataFromCloud')
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

  it('should call createNewWallet function with right params onCreateWallet press', async () => {
    const { result } = renderHook(() => useWelcomeScreen());

    act(() => {
      result.current.onCreateWallet();
    });

    expect(mockedCreateWallet).toBeCalledTimes(1);
  });
});
