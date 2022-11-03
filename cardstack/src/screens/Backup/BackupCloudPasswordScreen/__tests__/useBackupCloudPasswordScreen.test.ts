import { StackActions, useRoute } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';

import { usePasswordInput } from '@cardstack/components';

import { BackupRouteParams } from '../../types';
import { useBackupCloudPasswordScreen } from '../useBackupCloudPasswordScreen';

const mockNavDispatch = jest.fn();
const mockNavigateOnboarding = jest.fn();
const mockBackupToCloud = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ dispatch: mockNavDispatch }),
  useRoute: jest.fn(),
  StackActions: { pop: jest.fn() },
}));

jest.mock('@cardstack/hooks/onboarding/useShowOnboarding', () => ({
  useShowOnboarding: () => ({
    navigateToNextOnboardingStep: mockNavigateOnboarding,
  }),
}));

jest.mock('@cardstack/hooks/backup/useWalletCloudBackup', () => ({
  useWalletCloudBackup: () => ({ backupToCloud: mockBackupToCloud }),
}));

jest.mock('@cardstack/components/Input/PasswordInput/usePasswordInput', () => ({
  usePasswordInput: jest.fn(),
}));

describe('useBackupCloudPasswordScreen', () => {
  const mockUseRoute = (params?: Partial<BackupRouteParams>) => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params,
    }));
  };

  const mockUsePasswordInput = (
    overwriteParams: Partial<ReturnType<typeof usePasswordInput>> = {}
  ) =>
    (usePasswordInput as jest.Mock).mockImplementation(() => ({
      password: 'passw0rd',
      isValid: false,
      ...overwriteParams,
    }));

  beforeEach(() => {
    mockUseRoute();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`isSubmitDisabled should be true if checkbox isn't checked`, () => {
    mockUsePasswordInput({ isValid: true });

    const { result } = renderHook(useBackupCloudPasswordScreen);

    expect(result.current.isSubmitDisabled).toBe(true);
  });

  it(`isSubmitDisabled should be true if both password fields are not valid`, () => {
    mockUsePasswordInput({ isValid: false });

    const { result } = renderHook(useBackupCloudPasswordScreen);

    act(() => {
      result.current.onCheckboxPress();
    });

    expect(result.current.isSubmitDisabled).toBe(true);
  });

  it(`isSubmitDisabled should be false if both password fields are valid and checkbox is checked`, () => {
    mockUsePasswordInput({ isValid: true });

    const { result } = renderHook(useBackupCloudPasswordScreen);

    act(() => {
      result.current.onCheckboxPress();
    });

    expect(result.current.isSubmitDisabled).toBe(false);
  });

  it(`should call backupToCloud with password`, async () => {
    mockUsePasswordInput({ password: 'password' });

    const { result } = renderHook(useBackupCloudPasswordScreen);

    await act(async () => {
      await result.current.handleBackupToCloud();
    });

    expect(mockBackupToCloud).toBeCalledTimes(1);
    expect(mockBackupToCloud).toBeCalledWith({ password: 'password' });
  });

  it(`should pop the navigation stack if popStackOnSuccess param is present`, async () => {
    mockUseRoute({ popStackOnSuccess: 1 });

    const { result } = renderHook(useBackupCloudPasswordScreen);

    await act(async () => {
      await result.current.handleBackupToCloud();
    });

    expect(mockBackupToCloud).toBeCalledTimes(1);
    expect(mockNavDispatch).toBeCalledTimes(1);
    expect(mockNavDispatch).toBeCalledWith(StackActions.pop(1));
  });

  it(`should call navigateToNextOnboardingStep if popStackOnSuccess param isn't present`, async () => {
    const { result } = renderHook(useBackupCloudPasswordScreen);

    await act(async () => {
      await result.current.handleBackupToCloud();
    });

    expect(mockBackupToCloud).toBeCalledTimes(1);
    expect(mockNavDispatch).not.toBeCalled();
    expect(mockNavigateOnboarding).toBeCalledTimes(1);
  });
});
