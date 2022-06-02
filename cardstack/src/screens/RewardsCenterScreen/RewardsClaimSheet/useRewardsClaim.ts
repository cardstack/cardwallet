import { StackActions, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects } from '@cardstack/hooks';
import { useLoadingOverlay } from '@cardstack/navigation';
import {
  useClaimRewardsMutation,
  useGetClaimRewardsGasEstimateQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import {
  RewardsClaimData,
  TransactionConfirmationType,
} from '@cardstack/types';

import { Alert } from '@rainbow-me/components/alerts';
import { useWallets } from '@rainbow-me/hooks';

import { strings } from '../strings';
import useRewardsDataFetch from '../useRewardsDataFetch';

interface onClaimCallbackProps {
  title: string;
  message: string;
  popStackNavigation?: number;
}

const useRewardsClaim = () => {
  const { goBack, dispatch } = useNavigation();
  const { signerParams, accountAddress } = useWallets();

  const {
    rewardSafes,
    defaultRewardProgramId,
    mainPoolTokenInfo,
  } = useRewardsDataFetch();

  const { dismissLoadingOverlay, showLoadingOverlay } = useLoadingOverlay();

  const [
    claimRewards,
    { isSuccess: isClaimSuccess, isError: isClaimError },
  ] = useClaimRewardsMutation();

  const rewardSafeForProgram = useMemo(
    () =>
      rewardSafes?.find(
        safe => safe.rewardProgramId === defaultRewardProgramId
      ),
    [rewardSafes, defaultRewardProgramId]
  );

  const partialClaimParams = {
    accountAddress,
    rewardProgramId: defaultRewardProgramId,
    tokenAddress: mainPoolTokenInfo?.tokenAddress || '',
    safeAddress: rewardSafeForProgram?.address || '',
  };

  const {
    data: estimatedGasClaim,
    isLoading: loadingEstimatedGasClaim,
    isFetching: fetchingEstimatedGasClaim,
  } = useGetClaimRewardsGasEstimateQuery(partialClaimParams, {
    refetchOnMountOrArgChange: true,
  });

  const screenData = useMemo(
    () => ({
      loadingGasEstimate: loadingEstimatedGasClaim || fetchingEstimatedGasClaim,
      type: TransactionConfirmationType.REWARDS_CLAIM,
      estGasFee: estimatedGasClaim || '0.10',
      ...mainPoolTokenInfo,
    }),
    [
      estimatedGasClaim,
      mainPoolTokenInfo,
      loadingEstimatedGasClaim,
      fetchingEstimatedGasClaim,
    ]
  );

  const onConfirm = useCallback(() => {
    showLoadingOverlay({ title: strings.claim.loading });

    claimRewards({
      ...partialClaimParams,
      signerParams,
      rewardProgramId: defaultRewardProgramId,
    });
  }, [
    showLoadingOverlay,
    claimRewards,
    partialClaimParams,
    signerParams,
    defaultRewardProgramId,
  ]);

  const onClaimCallback = useCallback(
    ({ title, message, popStackNavigation }: onClaimCallbackProps) => () => {
      dismissLoadingOverlay();

      Alert({
        message,
        title,
        buttons: [
          {
            text: strings.defaultAlertBtn,
            onPress: popStackNavigation
              ? () => {
                  dispatch(StackActions.pop(popStackNavigation));
                }
              : undefined,
          },
        ],
      });
    },
    [dismissLoadingOverlay, dispatch]
  );

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isClaimSuccess,
          callback: onClaimCallback({
            ...strings.claim.sucessAlert,
            popStackNavigation: 1,
          }),
        },
        error: {
          status: isClaimError,
          callback: onClaimCallback(defaultErrorAlert),
        },
      }),
      [isClaimError, isClaimSuccess, onClaimCallback]
    )
  );

  return {
    onConfirm,
    data: screenData as RewardsClaimData, // type casting bc mainPoolTokenInfo type has undefined
    onCancel: goBack,
  };
};

export default useRewardsClaim;
