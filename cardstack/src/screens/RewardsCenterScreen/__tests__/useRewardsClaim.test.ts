import { renderHook } from '@testing-library/react-hooks';
import { Alert } from 'react-native';
import { act } from 'react-test-renderer';

import { defaultErrorAlert } from '@cardstack/constants';
import { useClaimRewardsMutation } from '@cardstack/services/rewards-center/rewards-center-api';

import useRewardsClaim from '../RewardsClaimSheet/useRewardsClaim';
import { strings } from '../strings';
import useRewardsDataFetch from '../useRewardsDataFetch';

import { mockMainPoolTokenInfo, mockRewardSafeForProgram } from './mocks';

const mockedShowOverlay = jest.fn();
const mockedDismissOverlay = jest.fn();
const accountAddress = '0x0000000000000000000';
const mockedDispatch = jest.fn();
const rewardSafes = mockRewardSafeForProgram;
const mainPoolTokenInfo = mockMainPoolTokenInfo;
const defaultRewardProgramId = '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185';

const signerParams = {
  walletId: '123',
  accountIndex: 1,
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    dispatch: mockedDispatch,
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
    signerParams,
    accountAddress,
  }),
}));

jest.mock('@cardstack/services/rewards-center/rewards-center-api', () => ({
  useClaimRewardsMutation: jest.fn(),
  useGetClaimRewardsGasEstimateQuery: jest.fn().mockResolvedValue('0.20'),
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
      defaultRewardProgramId,
      mainPoolTokenInfo,
      ...overwriteProps,
    }));

  const mockClaimRewards = (overwriteStatus?: {
    isSuccess: boolean;
    isError: boolean;
  }) => {
    (useClaimRewardsMutation as jest.Mock).mockImplementation(() => [
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
      tokenAddress: mockMainPoolTokenInfo.tokenAddress,
      safeAddress: mockRewardSafeForProgram[0].address,
      signerParams,
    });
  });

  it('on successful claim, Alert should show Okay button', () => {
    const { result } = renderHook(() => useRewardsClaim());

    act(() => {
      result.current.onConfirm();
    });

    expect(mockedShowOverlay).toBeCalledWith({
      title: strings.claim.loading,
    });

    expect(spyAlert).toBeCalledWith(
      strings.claim.sucessAlert.title,
      strings.claim.sucessAlert.message,
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

  it('on unsuccesful claim, Alert should not have an OKay button', () => {
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
