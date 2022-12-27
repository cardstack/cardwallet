import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { defaultErrorAlert } from '@cardstack/constants';
import { useRequestEmailCardDropMutation } from '@cardstack/services';

import { strings } from '../strings';
import { useRequestPrepaidCardScreen } from '../useRequestPrepaidCardScreen';

const validEmail = 'test@test.com';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useAccountSettings: () => ({
    accountAddress: '0x0000000000000000000',
    network: 'sokol',
  }),
}));

jest.mock('@cardstack/services', () => ({
  useRequestEmailCardDropMutation: jest.fn(() => [
    jest.fn(),
    {
      isSuccess: true,
      isError: false,
    },
  ]),
  hubApi: jest.fn(),
}));

describe('useRequestPrepaidCardScreen', () => {
  const spyAlert = jest.spyOn(Alert, 'alert');
  const mockedRequestCardDrop = jest.fn();

  const mockRequestCardDropHelper = (overwriteStatus?: {
    isSuccess: boolean;
    isError: boolean;
    error: {
      status: number;
      message: string;
    };
  }) => {
    (useRequestEmailCardDropMutation as jest.Mock).mockImplementation(() => [
      mockedRequestCardDrop.mockResolvedValue(Promise.resolve()),
      {
        isSuccess: false,
        isError: true,
        error: {
          status: 400,
          message: '',
        },
        ...overwriteStatus,
      },
    ]);
  };

  beforeEach(() => {
    mockRequestCardDropHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger a custom error message if email card drop request returns 503 error', () => {
    const { result } = renderHook(() => useRequestPrepaidCardScreen());

    mockRequestCardDropHelper({
      isSuccess: false,
      isError: true,
      error: {
        status: 503,
        message: '',
      },
    });

    act(() => {
      result.current.onChangeText(validEmail);
      result.current.onTermsAcceptToggle();
    });

    act(() => {
      result.current.onSubmitPress();
    });

    expect(spyAlert).toBeCalledWith(
      strings.customError.title,
      strings.customError.message,
      undefined,
      undefined
    );
  });

  it('should show default error message for request errors that are not 503', () => {
    const { result } = renderHook(() => useRequestPrepaidCardScreen());

    mockRequestCardDropHelper({
      isSuccess: false,
      isError: true,
      error: {
        status: 404,
        message: '',
      },
    });

    act(() => {
      result.current.onChangeText(validEmail);
      result.current.onTermsAcceptToggle();
    });

    act(() => {
      result.current.onSubmitPress();
    });

    expect(spyAlert).toBeCalledWith(
      defaultErrorAlert.title,
      defaultErrorAlert.message,
      undefined,
      undefined
    );
  });
});
