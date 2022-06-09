import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { act } from 'react-test-renderer';

import { useBiometry } from '@cardstack/hooks/useBiometry';
import { biometricAuthentication } from '@cardstack/models/biometric-auth';
import { getPin } from '@cardstack/models/secure-storage';

import { strings } from '../strings';
import { useUnlockScreen } from '../useUnlockScreen';

const PIN = '111111';

jest.mock('@cardstack/models/secure-storage', () => ({
  getPin: jest.fn(),
}));

jest.mock('@cardstack/models/biometric-auth', () => ({
  biometricAuthentication: jest.fn(),
}));

const mockSetAuthorized = jest.fn();

jest.mock('@cardstack/redux/authSlice', () => ({
  useAuthActions: () => ({ setUserAuthorized: mockSetAuthorized }),
  authSlice: { name: 'authSlice', reducer: null },
}));

jest.mock('@cardstack/hooks/useBiometry', () => ({
  useBiometry: jest.fn(),
}));

jest.useFakeTimers();

describe('useUnlockScreen', () => {
  const spyAlert = jest.spyOn(Alert, 'alert');

  const mockBiometryAvailableHelper = (available = false) => {
    (useBiometry as jest.Mock).mockImplementation(() => ({
      biometryAvailable: available,
    }));
  };

  const mockAuthAuthorizedHelper = (authorized = false) => {
    (biometricAuthentication as jest.Mock).mockImplementation(() =>
      Promise.resolve(authorized)
    );
  };

  const mockGetPinHelper = () => {
    (getPin as jest.Mock).mockImplementation(() => Promise.resolve(PIN));
  };

  beforeEach(() => {
    mockBiometryAvailableHelper();
    mockAuthAuthorizedHelper();
    mockGetPinHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call setAuthorized when inputed PIN matches stored one', async () => {
    const { result } = renderHook(() => useUnlockScreen());

    // We need to wait getPin be resolved so storedPin.current is valid.
    await waitFor(() => expect(getPin).toHaveBeenCalled());

    act(() => {
      result.current.setInputPin(PIN);
    });

    expect(result.current.inputPin).toMatch(PIN);
    expect(result.current.pinInvalid).toBeFalsy();
    expect(mockSetAuthorized).toBeCalledTimes(1);
  });

  it('should not call setAuthorized if inputed PIN does not match stored one and set PIN as invalid', async () => {
    const wrongPIN = '222222';

    const { result } = renderHook(() => useUnlockScreen());

    await waitFor(() => expect(getPin).toHaveBeenCalled());

    act(() => {
      result.current.setInputPin(wrongPIN);
    });

    expect(result.current.inputPin).toMatch('');
    expect(result.current.pinInvalid).toBeTruthy();
    expect(mockSetAuthorized).not.toBeCalled();
  });

  it('should authorize if biometry check is successful', async () => {
    mockBiometryAvailableHelper(true);
    mockAuthAuthorizedHelper(true);

    const { result } = renderHook(() => useUnlockScreen());

    act(() => {
      result.current.authenticateBiometrically();
    });

    await waitFor(() => expect(mockSetAuthorized).toBeCalledTimes(1));
  });

  it('should not authorize if biometry check fails and retry should become available', async () => {
    mockBiometryAvailableHelper(true);

    const { result } = renderHook(() => useUnlockScreen());

    act(() => {
      result.current.authenticateBiometrically();
    });

    await waitFor(() => {
      expect(result.current.retryBiometricAuth).toBeTruthy();
      expect(mockSetAuthorized).toBeCalledTimes(0);
    });
  });

  it('should display alert if reset wallet is pressed', () => {
    const { result } = renderHook(() => useUnlockScreen());

    act(() => {
      result.current.onResetWalletPress();
    });

    expect(spyAlert).toBeCalledWith(
      strings.reset.title,
      strings.reset.message,
      [
        { text: strings.reset.delete, onPress: expect.any(Function) },
        { text: strings.reset.cancel, style: 'cancel' },
      ]
    );
  });
});
