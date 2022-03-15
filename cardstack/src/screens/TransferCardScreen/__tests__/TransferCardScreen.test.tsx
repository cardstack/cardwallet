import React from 'react';
import { render, fireEvent, act } from '../../../../src/test-utils';
import { strings } from '../strings';
import TransferCardScreen from '../TransferCardScreen';
import { useTransferCardScreen } from '../useTransferCardScreen';

jest.mock('../useTransferCardScreen', () => ({
  useTransferCardScreen: jest.fn(),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useDimensions: () => ({
    isTinyPhone: false,
  }),
}));

jest.mock('../../QRScannerScreen/pages', () => ({
  QRCodeScannerPage: () => <></>,
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
      renderScanPage: false,
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

  it('should disable transfer btn if address is not valid', () => {
    mockUseTransferCardScreenHelper({ isValidAddress: false });

    const { getByText } = render(<TransferCardScreen />);

    const transferBtn = getByText(strings.transferBtn);

    expect(transferBtn).toBeDisabled();
  });

  it('should enable transfer btn if address is valid', () => {
    mockUseTransferCardScreenHelper({ isValidAddress: true });

    const { getByText } = render(<TransferCardScreen />);

    const transferBtn = getByText(strings.transferBtn);

    expect(transferBtn).toBeEnabled();
  });

  it('should call onTrasferPress', () => {
    const { getByText } = render(<TransferCardScreen />);

    const transferBtn = getByText(strings.transferBtn);

    act(() => {
      fireEvent.press(transferBtn);
    });

    expect(onTransferPress).toBeCalledTimes(1);
  });

  it('should render scan page if renderScanPage is true', () => {
    mockUseTransferCardScreenHelper({ renderScanPage: true });

    const { getByText } = render(<TransferCardScreen />);

    const returnToTransferBtn = getByText(strings.scanPage.btnLabel);

    expect(returnToTransferBtn).toBeTruthy();
  });

  it('should call dismiss when return button is pressed', () => {
    const mockedDismissScanPage = jest.fn();

    mockUseTransferCardScreenHelper({
      dismissScanPage: mockedDismissScanPage,
      renderScanPage: true,
    });

    const { getByText } = render(<TransferCardScreen />);

    const returnToTransferBtn = getByText(strings.scanPage.btnLabel);

    act(() => {
      fireEvent.press(returnToTransferBtn);
    });

    expect(mockedDismissScanPage).toBeCalledTimes(1);
  });
});
