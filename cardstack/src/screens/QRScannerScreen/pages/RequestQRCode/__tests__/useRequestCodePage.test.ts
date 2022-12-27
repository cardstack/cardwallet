import { act, renderHook } from '@testing-library/react-native';

import { Routes } from '@cardstack/navigation/routes';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

import { useRequestCodePage } from '../useRequestCodePage';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

jest.mock('@cardstack/hooks/merchant/usePaymentLinks', () => ({
  usePaymentLinks: () => ({
    handleShareLink: jest.fn(),
    paymentRequestDeepLink: 'fooLink',
  }),
}));

jest.mock('@cardstack/redux/hooks/usePrimarySafe', () => ({
  usePrimarySafe: jest.fn(),
}));

const primarySafeMock = {
  address: 'merchantAddress',
  merchantInfo: { name: 'foo' },
};

describe('useRequestCodePage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to payment request sheet on request amount press', async () => {
    (usePrimarySafe as jest.Mock).mockImplementation(() => ({
      primarySafe: primarySafeMock,
    }));

    const { result } = renderHook(useRequestCodePage);

    act(() => {
      result.current.onRequestAmountPress();
    });

    expect(mockedNavigate).toBeCalledWith(
      Routes.MERCHANT_PAYMENT_REQUEST_SHEET,
      {
        address: primarySafeMock.address,
        merchantInfo: primarySafeMock.merchantInfo,
      }
    );
  });

  it('should NOT navigate if no primary safe exists', async () => {
    (usePrimarySafe as jest.Mock).mockImplementation(() => ({
      primarySafe: undefined,
    }));

    const { result } = renderHook(useRequestCodePage);

    act(() => {
      result.current.onRequestAmountPress();
    });

    expect(mockedNavigate).not.toBeCalled();
  });
});
