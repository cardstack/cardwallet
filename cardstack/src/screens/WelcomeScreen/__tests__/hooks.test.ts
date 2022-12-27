import { act, renderHook } from '@testing-library/react-native';

import { Routes } from '@cardstack/navigation/routes';

import { useWelcomeScreen } from '../hooks';

// Mock navigation
const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

// Mock rainbow hooks
const mockedCreateWallet = jest.fn();

jest.mock('@rainbow-me/hooks', () => ({
  useWalletManager: () => ({ createNewWallet: mockedCreateWallet }),
}));

describe('useWelcomeScreen', () => {
  it('should navigate to backup restore flow on onAddExistingWallet press', async () => {
    const { result } = renderHook(() => useWelcomeScreen());

    act(() => {
      result.current.onAddExistingWallet();
    });

    expect(mockedNavigate).toBeCalledWith(Routes.BACKUP_RESTORE_EXPLANATION);
  });

  it('should call createNewWallet function with right params onCreateWallet press', async () => {
    const { result } = renderHook(() => useWelcomeScreen());

    act(() => {
      result.current.onCreateWallet();
    });

    expect(mockedCreateWallet).toBeCalledTimes(1);
  });
});
