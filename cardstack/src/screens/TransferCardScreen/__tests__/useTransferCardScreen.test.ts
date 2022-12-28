import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useTransferPrepaidCardMutation } from '@cardstack/services';

import haptics from '@rainbow-me/utils/haptics';

import { strings } from '../strings';
import { useTransferCardScreen } from '../useTransferCardScreen';

const validAddress = '0x2f58630CA445Ab1a6DE2Bb9892AA2e1d60876C13';
const prepaidCardAddress = '0x4ba1A50Aecba077Acdf4625BF9aDB3Fe964eEA17';
const accountAddress = '0x0000000000000000000000000000000000000000';

// Mock navigation
const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockedGoBack,
  }),
  useRoute: () => ({
    params: { prepaidCardAddress },
  }),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useWallets: () => ({
    accountAddress,
  }),
}));

const mockedShowOverlay = jest.fn();
const mockedDismissOverlay = jest.fn();
jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: mockedShowOverlay,
    dismissLoadingOverlay: mockedDismissOverlay,
  }),
}));

jest.mock('@cardstack/services', () => ({
  useTransferPrepaidCardMutation: jest.fn(),
}));

jest.mock('@rainbow-me/components/send/SendSheet', () => ({
  useSendAddressValidation: jest.fn(() => true),
}));

jest.mock('@rainbow-me/utils/haptics');

describe('useTransferCardScreen', () => {
  const mockedTransferPrepaidCard = jest.fn();

  const spyAlert = jest.spyOn(Alert, 'alert');

  const mockTransferCardHelper = (overwriteStatus?: {
    isSuccess: boolean;
    isError: boolean;
  }) => {
    (useTransferPrepaidCardMutation as jest.Mock).mockImplementation(() => [
      mockedTransferPrepaidCard.mockResolvedValue(Promise.resolve()),
      {
        isSuccess: true,
        isError: false,
        ...overwriteStatus,
      },
    ]);
  };

  beforeEach(() => {
    mockTransferCardHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading and call transferPrepaidCard onTransferPress', async () => {
    const { result } = renderHook(() => useTransferCardScreen());

    act(() => {
      result.current.onChangeText(validAddress);
    });

    act(() => {
      result.current.onTransferPress();
    });

    expect(mockedShowOverlay).toBeCalledWith({
      title: strings.loadingTitle,
    });

    expect(mockedTransferPrepaidCard).toBeCalledWith({
      accountAddress,
      prepaidCardAddress,
      newOwner: validAddress,
    });
  });

  it('should dismiss loading and show alert on success', async () => {
    const { result } = renderHook(() => useTransferCardScreen());

    act(() => {
      result.current.onChangeText(validAddress);
    });

    act(() => {
      result.current.onTransferPress();
    });

    expect(spyAlert).toBeCalledWith(
      strings.alert.success.title,
      strings.alert.success.message,
      [{ text: strings.alert.btnLabel, onPress: mockedGoBack }],
      undefined
    );
  });

  it('should dismiss loading and show alert on error', async () => {
    const { result } = renderHook(() => useTransferCardScreen());

    mockTransferCardHelper({
      isSuccess: false,
      isError: true,
    });

    act(() => {
      result.current.onChangeText(validAddress);
    });

    act(() => {
      result.current.onTransferPress();
    });

    expect(spyAlert).toBeCalledWith(
      strings.alert.error.title,
      strings.alert.error.message,
      [{ text: strings.alert.btnLabel, onPress: mockedGoBack }],
      undefined
    );
  });

  it('should goBack on alert Okay press', async () => {
    const { result } = renderHook(() => useTransferCardScreen());

    act(() => {
      result.current.onChangeText(validAddress);
    });

    act(() => {
      result.current.onTransferPress();
    });

    act(() => {
      // Tap Okay button on Alert
      spyAlert.mock.calls?.[0]?.[2]?.[0]?.onPress?.();
    });

    expect(mockedGoBack).toBeCalled();
  });

  it('should set renderScanPage to true onScanPress', async () => {
    const { result } = renderHook(() => useTransferCardScreen());

    act(() => {
      result.current.onScanPress();
    });

    expect(result.current.renderScanPage).toBeTruthy();
  });

  it('should set renderScanPage to false on dismissScanPage', async () => {
    const { result } = renderHook(() => useTransferCardScreen());

    act(() => {
      result.current.dismissScanPage();
    });

    expect(result.current.renderScanPage).toBeFalsy();
  });

  it('should set newOwner on ScanHandler read', async () => {
    haptics.notificationSuccess = jest.fn();

    const { result } = renderHook(() => useTransferCardScreen());

    act(() => {
      result.current.onScanHandler(validAddress);
    });

    expect(haptics.notificationSuccess).toBeCalled();
    expect(result.current.newOwnerAddress).toBe(validAddress);
  });
});
