import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo, useRef } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects } from '@cardstack/hooks';
import { useLoadingOverlay } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import {
  useClaimRewardsMutation,
  useGetClaimRewardsGasEstimateQuery,
} from '@cardstack/services/rewards-center/rewards-center-api';
import {
  RewardProofType,
  RewardsClaimMutationParams,
} from '@cardstack/services/rewards-center/rewards-center-types';
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
  dismiss?: boolean;
}

interface RewardParam {
  reward: RewardProofType;
}

const useRewardClaimSingle = () => {
  const { goBack } = useNavigation();

  const { params } = useRoute<RouteType<RewardParam>>();

  const { accountAddress } = useWallets();

  const {
    rewardSafeForProgram,
    defaultRewardProgramId,
  } = useRewardsDataFetch();

  // flag to avoid rerendering the screen after the claim happened
  const isClaiming = useRef(false);
  const rewardRef = useRef(params.reward);

  const { dismissLoadingOverlay, showLoadingOverlay } = useLoadingOverlay();

  const [
    claimRewards,
    { isSuccess: isClaimSuccess, isError: isClaimError },
  ] = useClaimRewardsMutation();

  const claimParams: RewardsClaimMutationParams = useMemo(
    () => ({
      accountAddress,
      rewardProgramId: defaultRewardProgramId,
      tokenAddress: rewardRef.current?.tokenAddress || '',
      safeAddress: rewardSafeForProgram?.address || '',
      rewardsToClaim: [rewardRef.current],
    }),
    [accountAddress, defaultRewardProgramId, rewardRef, rewardSafeForProgram]
  );

  const {
    data: estimatedGasClaim,
    isLoading: loadingEstimatedGasClaim,
    isFetching: fetchingEstimatedGasClaim,
  } = useGetClaimRewardsGasEstimateQuery(claimParams, {
    skip: isClaiming.current,
  });

  const screenData = useMemo(
    () => ({
      loadingGasEstimate: loadingEstimatedGasClaim || fetchingEstimatedGasClaim,
      type: TransactionConfirmationType.REWARDS_CLAIM,
      estGasFee: estimatedGasClaim || '0.10',
      ...rewardRef.current,
    }),
    [
      estimatedGasClaim,
      rewardRef,
      loadingEstimatedGasClaim,
      fetchingEstimatedGasClaim,
    ]
  );

  const onConfirm = useCallback(() => {
    showLoadingOverlay({ title: strings.claim.loading });

    isClaiming.current = true;
    claimRewards(claimParams);
  }, [showLoadingOverlay, claimRewards, claimParams]);

  const onClaimFulfilledAlert = useCallback(
    ({ title, message, dismiss }: onClaimCallbackProps) => () => {
      dismissLoadingOverlay();

      Alert({
        message,
        title,
        buttons: [
          {
            text: strings.defaultAlertBtn,
            onPress: dismiss ? goBack : undefined,
          },
        ],
      });
    },
    [dismissLoadingOverlay, goBack]
  );

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isClaimSuccess,
          callback: onClaimFulfilledAlert({
            ...strings.claim.successAlert,
            dismiss: true,
          }),
        },
        error: {
          status: isClaimError,
          callback: onClaimFulfilledAlert(defaultErrorAlert),
        },
      }),
      [isClaimError, isClaimSuccess, onClaimFulfilledAlert]
    )
  );

  return {
    onConfirm,
    data: screenData as RewardsClaimData, // type casting bc fullBalanceToken type has undefined
    onCancel: goBack,
  };
};

export default useRewardClaimSingle;
