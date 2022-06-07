import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { useBiometry } from '@cardstack/hooks/useBiometry';
// import { getPin } from '@cardstack/models/secure-storage';

import { useUnlockScreen } from '../useUnlockScreen';

const PIN = '111111';

const mockSetAuthorized = jest.fn();

jest.mock('@cardstack/redux/authSlice', () => ({
  useAuthActions: () => ({ setUserAuthorized: mockSetAuthorized }),
  authSlice: { name: 'authSlice', reducer: null },
}));

jest.mock('@cardstack/models/secure-storage', () => ({
  getPin: () => PIN,
}));

jest.mock('@cardstack/hooks/useBiometry', () => ({
  useBiometry: jest.fn(),
}));

const mockBiometryHelper = (overwrite: any = {}) => {
  (useBiometry as jest.Mock).mockImplementation(() => ({
    biometryAvailable: false,
    ...overwrite,
  }));
};

describe('useUnlockScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set pin as valid and user as authorized when input PIN matches saved one', async () => {
    mockBiometryHelper();

    const { result } = renderHook(() => useUnlockScreen());

    act(() => {
      result.current.setInputPin(PIN);
    });

    await waitFor(() => {
      expect(result.current.inputPin).toBeTruthy();
    });

    expect(result.current.pinInvalid).toStrictEqual(false);

    expect(mockSetAuthorized).toBeCalled();
  });
});
