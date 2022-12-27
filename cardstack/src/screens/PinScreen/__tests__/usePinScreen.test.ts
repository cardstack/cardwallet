import { StackActions, useRoute } from '@react-navigation/native';
import { renderHook, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { Routes } from '@cardstack/navigation/routes';

import { PinFlow } from '../types';
import { usePinScreen } from '../usePinScreen';

const mockNavDispatch = jest.fn();
const mockNavSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    dispatch: mockNavDispatch,
    setOptions: mockNavSetOptions,
  }),
  useRoute: jest.fn(),
  StackActions: { push: jest.fn(), popToTop: jest.fn() },
}));

const mockSetAuthorized = jest.fn();

jest.mock('@cardstack/redux/authSlice', () => ({
  useAuthActions: () => ({ setUserAuthorized: mockSetAuthorized }),
  authSlice: { name: 'authSlice', reducer: null },
}));

const PIN = '111111';

const mockRouteParamsHelper = (overwrite: any = {}) => {
  (useRoute as jest.Mock).mockImplementation(() => ({
    params: {
      flow: PinFlow.create,
      canGoBack: false,
      variant: 'dark',
      showBiometricSwitcher: true,
      initialPin: '',
      ...overwrite,
    },
  }));
};

jest.useFakeTimers({ legacyFakeTimers: true });

describe('usePinScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('it should navigate to confirm PIN instance once PIN is filled on create flow', async () => {
    mockRouteParamsHelper();

    const { result } = renderHook(() => usePinScreen());

    act(() => {
      result.current.setInputPin(PIN);
    });

    await waitFor(() => expect(result.current.inputPin).toBeTruthy());

    expect(mockNavDispatch).toBeCalledWith(
      StackActions.push(Routes.PIN_SCREEN, {
        flow: PinFlow.confirm,
        initialPin: PIN,
        canGoBack: true,
      })
    );
  });

  it('it should navigate to confirm PIN instance once PIN is filled on new flow', async () => {
    mockRouteParamsHelper({ flow: PinFlow.new, variant: 'light' });

    const { result } = renderHook(() => usePinScreen());

    act(() => {
      result.current.setInputPin(PIN);
    });

    await waitFor(() => expect(result.current.inputPin).toBeTruthy());

    expect(mockNavDispatch).toBeCalledWith(
      StackActions.push(Routes.PIN_SCREEN, {
        flow: PinFlow.confirm,
        initialPin: PIN,
        variant: 'light',
        canGoBack: true,
      })
    );
  });

  it('should show PIN as invalid on confirm flow, if PIN does not match on confirm flow', async () => {
    const wrongPIN = '222222';

    mockRouteParamsHelper({
      flow: PinFlow.confirm,
      canGoBack: true,
      initialPin: PIN,
    });

    const { result } = renderHook(() => usePinScreen());

    act(() => {
      result.current.setInputPin(wrongPIN);
    });

    await waitFor(() => {
      expect(result.current.inputPin).toBeTruthy();
    });

    expect(result.current.isValidPin).toStrictEqual(false);
  });

  it('should have isValid as null if inputed PIN does not match PIN length on confirm flow', async () => {
    const smallerPin = '22';

    mockRouteParamsHelper({
      flow: PinFlow.confirm,
      canGoBack: true,
      initialPin: PIN,
    });

    const { result } = renderHook(() => usePinScreen());

    act(() => {
      result.current.setInputPin(smallerPin);
    });

    await waitFor(() => {
      expect(result.current.inputPin).toBeTruthy();
    });

    expect(result.current.isValidPin).toBeNull();
  });

  it('should have isValid as true if PIN matches and its on confirm flow', async () => {
    mockRouteParamsHelper({
      flow: PinFlow.confirm,
      canGoBack: true,
      initialPin: PIN,
    });

    const { result } = renderHook(() => usePinScreen());

    act(() => {
      result.current.setInputPin(PIN);
    });

    await waitFor(() => {
      expect(result.current.inputPin).toBeTruthy();
    });

    expect(result.current.isValidPin).toStrictEqual(true);

    expect(mockSetAuthorized).toBeCalled();
  });

  it('should call onSuccess cb and popToTop when PIN is valid on confirm flow and dismissOnSuccess is true', async () => {
    const onSuccess = jest.fn();

    mockRouteParamsHelper({
      flow: PinFlow.confirm,
      canGoBack: true,
      initialPin: PIN,
      dismissOnSuccess: true,
      onSuccess,
    });

    const { result } = renderHook(() => usePinScreen());

    act(() => {
      result.current.setInputPin(PIN);
    });

    await waitFor(() => {
      expect(result.current.inputPin).toBeTruthy();
    });

    await waitFor(() => {
      expect(result.current.isValidPin).toBeTruthy();
    });

    expect(onSuccess).toBeCalledWith(PIN);

    jest.runAllTimers();

    expect(mockNavDispatch).toBeCalledWith(StackActions.popToTop());
  });

  it('should call onSuccess cb and not popToTop when PIN is valid on confirm flow and dismissOnSuccess is false', async () => {
    const onSuccess = jest.fn();

    mockRouteParamsHelper({
      flow: PinFlow.confirm,
      canGoBack: true,
      initialPin: PIN,
      onSuccess,
    });

    const { result } = renderHook(() => usePinScreen());

    act(() => {
      result.current.setInputPin(PIN);
    });

    await waitFor(() => {
      expect(result.current.inputPin).toBeTruthy();
    });

    await waitFor(() => {
      expect(result.current.isValidPin).toBeTruthy();
    });

    expect(onSuccess).toBeCalledWith(PIN);

    jest.runAllTimers();

    expect(mockNavDispatch).not.toBeCalledWith(StackActions.popToTop());
  });
});
