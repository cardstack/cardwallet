import { NavigationContext } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { Routes } from '@cardstack/navigation/routes';

import { useScanner } from '../useScanner';

const validAddress = '0x2f58630CA445Ab1a6DE2Bb9892AA2e1d60876C13';

jest.mock('logger');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');

  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock('@rainbow-me/utils/haptics', () => ({
  notificationSuccess: jest.fn(),
  notificationError: jest.fn(),
}));

jest.mock(
  '@cardstack/hooks/wallet-connect/useWalletConnectConnections',
  () => () => ({
    walletConnectOnSessionRequest: jest.fn(),
  })
);

jest.mock('@rainbow-me/hooks', () => ({
  useTimeout: () => ({ stopTimeout: jest.fn(), startTimeout: jest.fn() }),
}));

const wrapper: React.FC<{ isFocused: boolean }> = ({
  children,
  isFocused = true,
}) => (
  <NavigationContext.Provider
    // @ts-expect-error not matching nav params
    value={{
      isFocused: () => isFocused,
      addListener: jest.fn(),
    }}
  >
    {children}
  </NavigationContext.Provider>
);

describe('useScanner', () => {
  const spyAlert = jest.spyOn(Alert, 'alert');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should enable scanning if screen is Focused', async () => {
    const { result } = renderHook(() => useScanner(), {
      wrapper,
    });

    expect(result.current.isScanningEnabled).toBeTruthy();
  });

  it('should disable scanning if screen is NOT focused', async () => {
    const { result } = renderHook(() => useScanner(), {
      wrapper,
      initialProps: { isFocused: false },
    });

    expect(result.current.isScanningEnabled).toBeFalsy();
  });

  it('should disable scanning when onScan is called', async () => {
    const { result } = renderHook(() => useScanner(), {
      wrapper,
    });

    expect(result.current.isScanningEnabled).toBeTruthy();

    act(() => {
      result.current.onScan({ data: validAddress });
    });

    expect(result.current.isScanningEnabled).toBeFalsy();
  });

  it('should NOT disable scanning if data is empty', async () => {
    const { result } = renderHook(() => useScanner(), {
      wrapper,
    });

    expect(result.current.isScanningEnabled).toBeTruthy();

    act(() => {
      result.current.onScan({ data: '' });
    });

    expect(result.current.isScanningEnabled).toBeTruthy();
  });

  it('should show an alert when it does not recognize the scanned code', async () => {
    const { result } = renderHook(() => useScanner(), {
      wrapper,
    });

    await act(async () => {
      await result.current.onScan({ data: '12345' });
    });

    expect(spyAlert).toBeCalled();
  });

  it('should enable scanning after Okay tap on unrecognized alert', async () => {
    const { result } = renderHook(() => useScanner(), {
      wrapper,
    });

    expect(result.current.isScanningEnabled).toBeTruthy();

    await act(async () => {
      await result.current.onScan({ data: '12345' });
    });

    expect(result.current.isScanningEnabled).toBeFalsy();

    act(() => {
      // Tap Okay button on Alert
      //@ts-expect-error doesn't know it's a function
      spyAlert.mock.calls?.[0]?.[2]?.();
    });

    expect(result.current.isScanningEnabled).toBeTruthy();
  });

  it('should call custom handler with valid address', async () => {
    const customScanAddressHandler = jest.fn();

    const { result } = renderHook(
      () => useScanner({ customScanAddressHandler }),
      {
        wrapper,
      }
    );

    expect(result.current.isScanningEnabled).toBeTruthy();

    await act(async () => {
      await result.current.onScan({ data: validAddress });
    });

    expect(customScanAddressHandler).toBeCalledWith(validAddress);
    expect(mockNavigate).not.toBeCalledWith(Routes.SEND_FLOW_EOA, {
      address: validAddress,
    });
  });

  it('should call default handler with valid address', async () => {
    const { result } = renderHook(() => useScanner(), {
      wrapper,
    });

    expect(result.current.isScanningEnabled).toBeTruthy();

    await act(async () => {
      await result.current.onScan({ data: validAddress });
    });

    expect(mockNavigate).toBeCalledWith(Routes.SEND_FLOW_EOA, {
      address: validAddress,
    });
  });
});
