import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { act } from 'react-test-renderer';

import { defaultErrorAlert } from '@cardstack/constants';
import { useClaimAllRewardsMutation } from '@cardstack/services/rewards-center/rewards-center-api';

import useRewardsClaim from '../RewardsClaimSheet/useRewardsClaim';
import { strings } from '../strings';
import useRewardsDataFetch from '../useRewardsDataFetch';

import {
  mockclaimableBalanceToken,
  mockfullBalanceToken,
  mockRewardSafeForProgram,
} from './mocks';

const mockedShowOverlay = jest.fn();
const mockedDismissOverlay = jest.fn();
const accountAddress = '0x0000000000000000000';
const mockedGoBack = jest.fn();
const rewardSafes = mockRewardSafeForProgram;
const fullBalanceToken = mockfullBalanceToken;
const claimableBalanceToken = mockclaimableBalanceToken;
const defaultRewardProgramId = '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockedGoBack,
  }),
}));

jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: mockedShowOverlay,
    dismissLoadingOverlay: mockedDismissOverlay,
  }),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useWallets: () => ({
    accountAddress,
  }),
}));

jest.mock('@cardstack/services/rewards-center/rewards-center-api', () => ({
  useClaimAllRewardsMutation: jest.fn(),
  useGetClaimAllRewardsGasEstimateQuery: jest.fn().mockResolvedValue('0.20'),
}));

jest.mock('../useRewardsDataFetch', () => jest.fn());

describe('useRewardsClaim', () => {
  const mockedClaimRewards = jest.fn();

  const spyAlert = jest.spyOn(Alert, 'alert');

  const mockUseRewardsDataFetch = (
    overwriteProps?: Partial<ReturnType<typeof useRewardsDataFetch>>
  ) =>
    (useRewardsDataFetch as jest.Mock).mockImplementation(() => ({
      rewardSafes,
      rewardSafeForProgram: rewardSafes[0],
      defaultRewardProgramId,
      fullBalanceToken,
      claimableBalanceToken,
      ...overwriteProps,
    }));

  const mockClaimRewards = (overwriteStatus?: {
    isSuccess: boolean;
    isError: boolean;
  }) => {
    (useClaimAllRewardsMutation as jest.Mock).mockImplementation(() => [
      mockedClaimRewards.mockResolvedValue(Promise.resolve()),
      {
        isSuccess: true,
        isError: false,
        ...overwriteStatus,
      },
    ]);
  };

  beforeEach(() => {
    mockUseRewardsDataFetch();
    mockClaimRewards();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading and call claimRewards with the correct params', () => {
    const { result } = renderHook(() => useRewardsClaim());

    act(() => {
      result.current.onConfirm();
    });

    expect(mockedShowOverlay).toBeCalledWith({
      title: strings.claim.loading,
    });

    expect(mockedClaimRewards).toBeCalledWith({
      accountAddress,
      rewardProgramId: defaultRewardProgramId,
      tokenAddress: mockclaimableBalanceToken.tokenAddress,
      safeAddress: mockRewardSafeForProgram[0].address,
    });
  });

  it('should show Okay button with an onPress action on Alert after successful claim', () => {
    const { result } = renderHook(() => useRewardsClaim());

    act(() => {
      result.current.onConfirm();
    });

    expect(mockedShowOverlay).toBeCalledWith({
      title: strings.claim.loading,
    });

    expect(spyAlert).toBeCalledWith(
      strings.claim.successAlert.title,
      strings.claim.successAlert.message,
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

  it('should show Okay button with NO onPress action on Alert after unsuccesful claim', () => {
    mockClaimRewards({
      isSuccess: false,
      isError: true,
    });

    const { result } = renderHook(() => useRewardsClaim());

    act(() => {
      result.current.onConfirm();
    });

    expect(mockedShowOverlay).toBeCalledWith({
      title: strings.claim.loading,
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
