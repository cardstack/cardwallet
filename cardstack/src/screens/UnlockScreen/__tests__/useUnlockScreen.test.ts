import { waitFor, act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useBiometricSwitch } from '@cardstack/components/BiometricSwitch';
import { useAppState } from '@cardstack/hooks/useAppState';
import { useBiometry } from '@cardstack/hooks/useBiometry';
import { biometricAuthentication } from '@cardstack/models/biometric-auth';
import { getPin } from '@cardstack/models/secure-storage';
import * as requests from '@cardstack/redux/requests';

import {
  getPinAuthAttempts,
  getPinAuthNextDateAttempt,
  savePinAuthAttempts,
  savePinAuthNextDateAttempt,
} from '@rainbow-me/handlers/localstorage/globalSettings';

import { strings } from '../strings';
import { MAX_WRONG_ATTEMPTS, useUnlockScreen } from '../useUnlockScreen';

const PIN = '111111';

const oneMinuteinMs = 60000;

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

jest.mock('@cardstack/components/BiometricSwitch', () => ({
  useBiometricSwitch: jest.fn(),
}));

jest.mock('@cardstack/hooks/useAppState', () => ({
  useAppState: jest.fn(),
}));

const mockStorage = {
  attempts: 0,
  nextDate: null,
};

jest.useFakeTimers({ legacyFakeTimers: true });
jest.setTimeout(30000);

const DateNow = Date.now;

jest.mock('@rainbow-me/handlers/localstorage/globalSettings', () => ({
  getPinAuthAttempts: jest.fn(),
  getPinAuthNextDateAttempt: jest.fn(),
  savePinAuthAttempts: jest.fn(),
  savePinAuthNextDateAttempt: jest.fn(),
}));

const mockedRequest = { id: 'myRequest' };

jest.mock('@rainbow-me/hooks', () => ({
  useRequests: () => ({
    latestRequest: jest.fn().mockReturnValue(mockedRequest),
  }),
}));

describe('useUnlockScreen', () => {
  const spyAlert = jest.spyOn(Alert, 'alert');

  const spyHandleRequest = jest
    .spyOn(requests, 'handleWalletConnectRequests')
    .mockImplementation(jest.fn);

  const mockBiometryAvailableHelper = (available = false) => {
    (useBiometry as jest.Mock).mockImplementation(() => ({
      biometryAvailable: available,
    }));

    (useBiometricSwitch as jest.Mock).mockImplementation(() => ({
      isBiometryEnabled: available,
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

  const mockUseAppState = (isActive = true) => {
    (useAppState as jest.Mock).mockImplementation(() => ({
      isActive,
    }));
  };

  beforeAll(() => {
    (savePinAuthAttempts as jest.Mock).mockImplementation((value = 0) => {
      mockStorage.attempts = value;
    });

    (savePinAuthNextDateAttempt as jest.Mock).mockImplementation(
      (value = null) => {
        mockStorage.nextDate = value;
      }
    );

    (getPinAuthNextDateAttempt as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockStorage.nextDate)
    );

    (getPinAuthAttempts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockStorage.attempts)
    );
  });

  beforeEach(() => {
    mockBiometryAvailableHelper();
    mockAuthAuthorizedHelper();
    mockGetPinHelper();
    mockUseAppState();
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
    expect(savePinAuthAttempts).toBeCalledWith(1);
  });

  it('should authorize if biometry check is successful', () => {
    mockBiometryAvailableHelper(true);
    mockAuthAuthorizedHelper(true);

    renderHook(() => useUnlockScreen());

    waitFor(() => expect(mockSetAuthorized).toBeCalledTimes(1));
  });

  it('should not authorize if biometry check fails and retry should become available', async () => {
    mockBiometryAvailableHelper(true);

    const { result } = renderHook(() => useUnlockScreen());

    act(() => {
      result.current.authenticateBiometrically();
    });

    waitFor(() => expect(result.current.retryBiometricAuth).toBeTruthy());
    expect(mockSetAuthorized).toBeCalledTimes(0);
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

  it('should call handleWalletConnectRequests after user is authorized', () => {
    mockBiometryAvailableHelper(true);
    mockAuthAuthorizedHelper(true);

    renderHook(() => useUnlockScreen());

    waitFor(() => expect(spyHandleRequest).toBeCalledWith(mockedRequest));
  });

  describe('Exponential backoff', () => {
    const clearMockedStorage = () => {
      mockStorage.attempts = 0;
      mockStorage.nextDate = null;
    };

    afterEach(() => {
      global.Date.now = DateNow;
    });

    // These suites are dependent on each other, so running it with it.only might fail
    beforeAll(() => {
      clearMockedStorage();
    });

    it('should set attemptsCount to 1 on first invalid Pin', async () => {
      const wrongPIN = '222222';

      const {
        result: {
          current: { setInputPin, attemptsCount, nextAttemptDate },
        },
      } = renderHook(() => useUnlockScreen());

      await waitFor(() => expect(getPin).toHaveBeenCalled());

      act(() => {
        setInputPin(wrongPIN);
      });

      await waitFor(() => expect(savePinAuthAttempts).toBeCalledWith(1));

      expect(attemptsCount.current).toBe(1);
      expect(nextAttemptDate.current).toBeNull();
    });

    it('should set attemptsCount to MAX_WRONG_ATTEMPTS', async () => {
      const wrongPIN = '333333';

      const {
        result: {
          current: { setInputPin, attemptsCount, nextAttemptDate, inputPin },
        },
      } = renderHook(() => useUnlockScreen());

      await waitFor(() => expect(getPinAuthNextDateAttempt).toHaveReturned());

      for (let i = 2; i <= MAX_WRONG_ATTEMPTS; i++) {
        act(() => {
          setInputPin(wrongPIN);
        });

        await waitFor(() => expect(savePinAuthAttempts).toBeCalledWith(i));
        expect(attemptsCount.current).toEqual(i);
      }

      await waitFor(() =>
        expect(attemptsCount.current).toEqual(MAX_WRONG_ATTEMPTS)
      );

      expect(nextAttemptDate.current).toBeNull();
      expect(inputPin).toBe('');
      expect(savePinAuthNextDateAttempt).toHaveBeenLastCalledWith(null);
    });

    it('should block the user if wrong attempts are greater than MAX_WRONG_ATTEMPTS', async () => {
      const wrongPIN = '444444';

      const {
        result: {
          current: { setInputPin, nextAttemptDate },
        },
      } = renderHook(() => useUnlockScreen());

      await waitFor(() => expect(getPinAuthNextDateAttempt).toHaveReturned());

      act(() => {
        setInputPin(wrongPIN);
      });

      await waitFor(() => expect(nextAttemptDate.current).toBeTruthy());

      expect(savePinAuthNextDateAttempt).toHaveBeenLastCalledWith(
        nextAttemptDate.current
      );

      // savePinAuthAttempts is only called inside validatePin,
      // so not calling it, means validatePin was not called
      expect(savePinAuthAttempts).not.toBeCalled();

      expect(spyAlert).toBeCalledWith(
        'Temporary block',
        'Too many attempts!\nPlease wait 00:01:40 to try again.'
      );
    });

    it('should update the amount of time on the alert when user tries again and still blocked', async () => {
      const wrongPIN = '555555';

      const {
        result: {
          current: { setInputPin, inputPin },
        },
      } = renderHook(() => useUnlockScreen());

      await waitFor(() => expect(getPinAuthNextDateAttempt).toHaveReturned());

      act(() => {
        setInputPin(wrongPIN);
      });

      global.Date.now = jest.fn(() => DateNow() + oneMinuteinMs);

      act(() => {
        setInputPin(PIN);
      });

      await waitFor(() => expect(inputPin).toBe(''));

      expect(spyAlert).toBeCalledWith(
        'Temporary block',
        'Too many attempts!\nPlease wait 00:00:39 to try again.'
      );
    });

    it('should increase the amount of time on the alert if users enters wrong Pin again', async () => {
      const wrongPIN = '666666';

      const {
        rerender,
        result: {
          current: { setInputPin, attemptsCount },
        },
      } = renderHook(() => useUnlockScreen());

      await waitFor(() => expect(getPinAuthNextDateAttempt).toHaveReturned());

      global.Date.now = jest.fn(() => DateNow() + oneMinuteinMs * 3);

      act(() => {
        setInputPin(wrongPIN);
      });

      await waitFor(() => expect(attemptsCount.current).toBe(6));

      act(() => {
        setInputPin(wrongPIN);
      });

      rerender({});

      expect(spyAlert).toBeCalledWith(
        'Temporary block',
        'Too many attempts!\nPlease wait 00:16:40 to try again.'
      );
    });

    it('should have valid pin once blocking time has ended and pin is correct', async () => {
      const {
        result: {
          current: { setInputPin, attemptsCount, pinInvalid, nextAttemptDate },
        },
      } = renderHook(() => useUnlockScreen());

      await waitFor(() => expect(getPinAuthNextDateAttempt).toHaveReturned());

      global.Date.now = jest.fn(() => DateNow() + oneMinuteinMs * 60);

      act(() => {
        setInputPin(PIN);
      });

      await waitFor(() =>
        expect(savePinAuthNextDateAttempt).toBeCalledWith(null)
      );

      expect(nextAttemptDate.current).toBeNull();

      await waitFor(() => expect(pinInvalid).toEqual(false));

      expect(mockSetAuthorized).toBeCalledTimes(1);

      expect(attemptsCount.current).toEqual(0);
      expect(savePinAuthAttempts).toBeCalledWith(0);
    });
  });
});
