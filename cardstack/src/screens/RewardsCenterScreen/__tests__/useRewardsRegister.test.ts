import { useRoute } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-hooks';
import { Alert } from 'react-native';
import { act } from 'react-test-renderer';

import { defaultErrorAlert } from '@cardstack/constants';
import { inputData } from '@cardstack/helpers/__mocks__/dataMocks';
import { useGetPrepaidCardsQuery } from '@cardstack/services';
import { useRegisterToRewardProgramMutation } from '@cardstack/services/rewards-center/rewards-center-api';

import useRewardsRegister from '../RewardsRegisterSheet/useRewardsRegister';
import { strings } from '../strings';
import useRewardsDataFetch from '../useRewardsDataFetch';

const mockedShowOverlay = jest.fn();
const mockedDismissOverlay = jest.fn();
const accountAddress = '0x0000000000000000000';
const defaultRewardProgramId = '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185';

const signerParams = {
  walletId: '123',
  accountIndex: 1,
};

const mockedGoBack = jest.fn();
const mockNavDispatch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: mockedGoBack,
    dispatch: mockNavDispatch,
  }),
  StackActions: { pop: jest.fn() },
}));

jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: mockedShowOverlay,
    dismissLoadingOverlay: mockedDismissOverlay,
  }),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useWallets: () => ({
    signerParams,
    accountAddress,
  }),
}));

const mockedGetRegisterRewardeeGasEstimate = jest.fn();

jest.mock('@cardstack/services/rewards-center/rewards-center-api', () => ({
  useRegisterToRewardProgramMutation: jest.fn(),
  useLazyGetRegisterRewardeeGasEstimateQuery: jest
    .fn()
    .mockImplementation(() => [
      mockedGetRegisterRewardeeGasEstimate,
      { data: '0.40', isLoading: false },
    ]),
}));

jest.mock('@cardstack/services', () => ({
  useGetPrepaidCardsQuery: jest.fn(),
}));

jest.mock('../useRewardsDataFetch', () => jest.fn());

describe('useRewardsRegister', () => {
  const mockedRegisterToRewardProgram = jest.fn();

  const spyAlert = jest.spyOn(Alert, 'alert');

  const mockUseRewardsDataFetch = () =>
    (useRewardsDataFetch as jest.Mock).mockImplementation(() => ({
      defaultRewardProgramId,
    }));

  const mockRegisterToRewardProgram = (overwriteStatus?: {
    isSuccess: boolean;
    isError: boolean;
  }) => {
    (useRegisterToRewardProgramMutation as jest.Mock).mockImplementation(() => [
      mockedRegisterToRewardProgram.mockResolvedValue(Promise.resolve()),
      {
        isSuccess: true,
        isError: false,
        ...overwriteStatus,
      },
    ]);
  };

  beforeEach(() => {
    mockUseRewardsDataFetch();
    mockRegisterToRewardProgram();

    (useGetPrepaidCardsQuery as jest.Mock).mockImplementation(() => ({
      prepaidCards: inputData.prepaidCards[0],
      isLoadingCards: false,
    }));

    (useRoute as jest.Mock).mockReturnValue({
      params: {
        prepaidCard: inputData.prepaidCards[0],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading and call registerToRewardsProgram with the correct params', () => {
    const { result } = renderHook(() => useRewardsRegister());

    act(() => {
      result.current.onConfirmRegisterPress();
    });

    expect(mockedShowOverlay).toBeCalledWith({
      title: strings.register.loading,
    });

    expect(mockedRegisterToRewardProgram).toBeCalledWith({
      accountAddress,
      signerParams,
      prepaidCardAddress: inputData.prepaidCards[0].address,
      rewardProgramId: defaultRewardProgramId,
    });
  });

  it('should show Okay button with onPress action on Alert after successful registration', () => {
    const { result } = renderHook(() => useRewardsRegister());

    act(() => {
      result.current.onConfirmRegisterPress();
    });

    expect(mockedShowOverlay).toBeCalledWith({
      title: strings.register.loading,
    });

    expect(spyAlert).toBeCalledWith(
      strings.register.successAlert.title,
      strings.register.successAlert.message,
      [
        {
          text: strings.defaultAlertBtn,
          onPress: expect.any(Function),
        },
      ],
      undefined
    );

    expect(mockedDismissOverlay).toBeCalled();
  });

  it('should show Okay button with NO onPress action on Alert after unsuccesful registration', () => {
    mockRegisterToRewardProgram({
      isSuccess: false,
      isError: true,
    });

    const { result } = renderHook(() => useRewardsRegister());

    act(() => {
      result.current.onConfirmRegisterPress();
    });

    expect(mockedShowOverlay).toBeCalledWith({
      title: strings.register.loading,
    });

    expect(spyAlert).toBeCalledWith(
      defaultErrorAlert.title,
      defaultErrorAlert.message,
      [
        {
          text: strings.defaultAlertBtn,
          onPress: undefined,
        },
      ],
      undefined
    );

    expect(mockedDismissOverlay).toBeCalled();
  });
});
