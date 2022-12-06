import { act, renderHook } from '@testing-library/react-hooks';

import { Routes } from '@cardstack/navigation';

import { useNotificationsPermissionScreen } from '../useNotificationsPermissionScreen';

const mockCheckPushPermission = jest.fn();
jest.mock('@cardstack/models/firebase', () => ({
  checkPushPermissionAndRegisterToken: mockCheckPushPermission,
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@cardstack/navigation', () => ({
  Routes: {
    WALLET_SCREEN: 'WalletScreen',
  },
}));

const mockOption = { type: 'test', status: 'enabled' };
const mockOnUpdateOptionStatus = jest.fn();
jest.mock(
  '@cardstack/hooks/notifications-preferences/useUpdateNotificationPreferences',
  () => ({
    useUpdateNotificationPreferences: jest.fn(() => ({
      options: [mockOption],
      isError: false,
      onUpdateOptionStatus: mockOnUpdateOptionStatus,
    })),
  })
);

describe('useNotificationsPermissionScreen', () => {
  it('should start with correct options and isError values', () => {
    const { result } = renderHook(() => useNotificationsPermissionScreen());

    expect(result.current.options).toEqual([mockOption]);
    expect(result.current.isError).toBe(false);
  });

  it('should call onUpdateOptionStatus when triggered', () => {
    const { result } = renderHook(() => useNotificationsPermissionScreen());
    act(() => result.current.onUpdateOptionStatus(mockOption.type, false));

    expect(mockOnUpdateOptionStatus).toHaveBeenCalledWith(
      mockOption.type,
      false
    );
  });

  it('should check push permission when handleEnableNotificationsOnPress is called and navigate to the wallet screen', () => {
    const { result } = renderHook(() => useNotificationsPermissionScreen());
    act(() => result.current.handleEnableNotificationsOnPress());

    expect(mockCheckPushPermission).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(Routes.WALLET_SCREEN);
  });
});
