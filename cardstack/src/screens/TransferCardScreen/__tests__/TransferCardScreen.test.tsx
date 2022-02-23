import React from 'react';
import { render, fireEvent, act } from '../../../../src/test-utils';
import TransferCardScreen from '../TransferCardScreen';
import { useTransferCardScreen } from '../useTransferCardScreen';

jest.mock('../useTransferCardScreen', () => ({
  useTransferCardScreen: jest.fn(),
}));

describe('TransferCardScreen', () => {
  const onTransferPress = jest.fn();
  const onScanPress = jest.fn();
  const goBack = jest.fn();

  const mockUseTransferCardScreenHelper = (
    overwriteProps?: Partial<ReturnType<typeof useTransferCardScreen>>
  ) =>
    (useTransferCardScreen as jest.Mock).mockImplementation(() => ({
      isValidAddress: true,
      onTransferPress,
      onScanPress,
      goBack,
      ...overwriteProps,
    }));

  beforeEach(() => {
    mockUseTransferCardScreenHelper();
  });

  it('should go back on X icon press', () => {
    const { getByTestId } = render(<TransferCardScreen />);

    const closeBtn = getByTestId('icon-x');

    act(() => {
      fireEvent.press(closeBtn);
    });

    expect(goBack).toBeCalledTimes(1);
  });

  it('should call onScanPress', () => {
    const { getByText } = render(<TransferCardScreen />);

    const scanBtn = getByText('Scan QR code');

    act(() => {
      fireEvent.press(scanBtn);
    });

    expect(onScanPress).toBeCalledTimes(1);
  });

  it('should disable transfer btn if address is not valid', () => {
    mockUseTransferCardScreenHelper({ isValidAddress: false });

    const { getByText } = render(<TransferCardScreen />);

    const transferBtn = getByText('Transfer');

    expect(transferBtn).toBeDisabled();
  });

  it('should enable transfer btn if address is valid', () => {
    mockUseTransferCardScreenHelper({ isValidAddress: true });

    const { getByText } = render(<TransferCardScreen />);

    const transferBtn = getByText('Transfer');

    expect(transferBtn).toBeEnabled();
  });

  it('should call onTrasferPress', () => {
    const { getByText } = render(<TransferCardScreen />);

    const transferBtn = getByText('Transfer');

    act(() => {
      fireEvent.press(transferBtn);
    });

    expect(onTransferPress).toBeCalledTimes(1);
  });
});
