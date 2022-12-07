import { act, renderHook } from '@testing-library/react-hooks';

import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { Routes } from '@cardstack/navigation';
import { NotificationsOptionsType } from '@cardstack/types';

import { useNotificationsPermissionScreen } from '../useNotificationsPermissionScreen';

const mockNavigateOnboardingTo = jest.fn();
const mockOnUpdateOptionStatus = jest.fn();

const mockOption: NotificationsOptionsType = {
  type: 'customer_payment',
  description: 'New Payment Received',
  status: 'enabled',
};

jest.mock('@cardstack/hooks/onboarding/useShowOnboarding', () => ({
  useShowOnboarding: () => ({
    navigateOnboardingTo: mockNavigateOnboardingTo,
  }),
}));

jest.mock('@cardstack/redux/persistedFlagsSlice', () => ({
  usePersistedFlagsActions: () => ({
    triggerSkipNotificationPermission: jest.fn(),
  }),
}));

jest.mock('@cardstack/models/firebase', () => ({
  checkPushPermissionAndRegisterToken: jest.fn(),
}));

jest.mock('@cardstack/navigation', () => ({
  Routes: {
    BACKUP_EXPLANATION: 'BackupExplanation',
  },
}));

jest.mock('@cardstack/hooks', () => ({
  useUpdateNotificationPreferences: jest.fn(() => ({
    options: [mockOption],
    isError: false,
    onUpdateOptionStatus: mockOnUpdateOptionStatus,
  })),
}));

describe('useNotificationsPermissionScreen', () => {
  it('should start with correct options and isError values', () => {
    const { result } = renderHook(() => useNotificationsPermissionScreen());

    expect(result.current.options).toEqual([mockOption]);
    expect(result.current.isError).toBe(false);
  });

  it('should call onUpdateOptionStatus when triggered', () => {
    const { result } = renderHook(() => useNotificationsPermissionScreen());
    act(() => result.current.onUpdateOptionStatus(mockOption.type, false));

    expect(mockOnUpdateOptionStatus).toBeCalledWith(mockOption.type, false);
  });

  it('should check push permission when handleEnableNotificationsOnPress is called and navigate to the wallet screen', async () => {
    const { result, waitFor } = renderHook(() =>
      useNotificationsPermissionScreen()
    );

    act(() => result.current.handleEnableNotificationsOnPress());

    expect(checkPushPermissionAndRegisterToken).toBeCalled();

    await waitFor(() =>
      expect(mockNavigateOnboardingTo).toBeCalledWith(Routes.BACKUP_EXPLANATION)
    );
  });
});
