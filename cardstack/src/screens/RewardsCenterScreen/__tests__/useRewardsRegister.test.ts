import { useRoute } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { act } from 'react-test-renderer';

import { defaultErrorAlert } from '@cardstack/constants';
import { inputData } from '@cardstack/helpers/__mocks__/dataMocks';
import { Routes } from '@cardstack/navigation/routes';
import { useGetPrepaidCardsQuery } from '@cardstack/services';
import { useRegisterToRewardProgramMutation } from '@cardstack/services/rewards-center/rewards-center-api';

import useRewardsRegister, {
  defaultGasEstimateInSpend,
} from '../RewardsRegisterSheet/useRewardsRegister';
import { strings } from '../strings';
import useRewardsDataFetch from '../useRewardsDataFetch';

const mockedShowOverlay = jest.fn();
const mockedDismissOverlay = jest.fn();
const accountAddress = '0x0000000000000000000';
const defaultRewardProgramId = '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185';

const mockedGoBack = jest.fn();
const mockNavDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: () => ({
    navigate: mockNavigate,
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
  Routes: {
    CHOOSE_PREPAIDCARD_SHEET: 'ChoosePrepaidCardSheet',
  },
}));

jest.mock('@rainbow-me/hooks', () => ({
  useWallets: () => ({
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

  it('should call getRegisterRewardeeGasEstimate when the route params has prepaid card info', () => {
    renderHook(() => useRewardsRegister());

    expect(mockedGetRegisterRewardeeGasEstimate).toBeCalledWith({
      prepaidCardAddress: inputData.prepaidCards[0].address,
      rewardProgramId: defaultRewardProgramId,
    });
  });

  it(`should NOT call getRegisterRewardeeGasEstimate when there's no prepaid card info in the route params`, () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {},
    });

    renderHook(() => useRewardsRegister());

    expect(mockedGetRegisterRewardeeGasEstimate).not.toBeCalled();
  });

  it('should redirect to prepaid card selection route with the correct params when calling onRegisterPress()', () => {
    const { result } = renderHook(() => useRewardsRegister());

    act(() => {
      result.current.onRegisterPress();
    });

    expect(mockNavigate).toBeCalledWith(Routes.CHOOSE_PREPAIDCARD_SHEET, {
      spendAmount: defaultGasEstimateInSpend,
      onConfirmChoosePrepaidCard: expect.any(Function),
      payCostDesc: strings.register.payCostDescription,
    });
  });
});
