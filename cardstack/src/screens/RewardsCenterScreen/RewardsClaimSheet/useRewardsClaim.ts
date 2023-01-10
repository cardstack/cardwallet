import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useRef } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects } from '@cardstack/hooks';
import { useLoadingOverlay } from '@cardstack/navigation';
import {
  useClaimAllRewardsMutation,
  useGetClaimAllRewardsGasEstimateQuery,
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
  dismiss?: boolean;
}

const useRewardsClaim = () => {
  const { goBack } = useNavigation();
  const { accountAddress } = useWallets();

  const {
    rewardSafeForProgram,
    defaultRewardProgramId,
    claimableBalanceToken,
  } = useRewardsDataFetch();

  // flag to avoid rerendering the screen after the claim happened
  const isClaiming = useRef(false);
  const claimableBalanceTokenRef = useRef(claimableBalanceToken);

  const { dismissLoadingOverlay, showLoadingOverlay } = useLoadingOverlay();

  const [
    claimAllRewards,
    { isSuccess: isClaimSuccess, isError: isClaimError },
  ] = useClaimAllRewardsMutation();

  const claimParams = useMemo(
    () => ({
      accountAddress,
      rewardProgramId: defaultRewardProgramId,
      tokenAddress: claimableBalanceTokenRef.current?.tokenAddress || '',
      safeAddress: rewardSafeForProgram?.address || '',
    }),
    [accountAddress, defaultRewardProgramId, rewardSafeForProgram?.address]
  );

  const {
    data: estimatedGasClaim,
    isLoading: loadingEstimatedGasClaim,
    isFetching: fetchingEstimatedGasClaim,
  } = useGetClaimAllRewardsGasEstimateQuery(claimParams, {
    refetchOnMountOrArgChange: true,
    skip: isClaiming.current,
  });

  const screenData = useMemo(
    () => ({
      loadingGasEstimate: loadingEstimatedGasClaim || fetchingEstimatedGasClaim,
      type: TransactionConfirmationType.REWARDS_CLAIM,
      estGasFee: estimatedGasClaim || '0.10',
      ...claimableBalanceTokenRef.current,
    }),
    [
      estimatedGasClaim,
      claimableBalanceTokenRef,
      loadingEstimatedGasClaim,
      fetchingEstimatedGasClaim,
    ]
  );

  const onConfirm = useCallback(() => {
    showLoadingOverlay({ title: strings.claim.loading });

    isClaiming.current = true;
    claimAllRewards(claimParams);
  }, [showLoadingOverlay, claimAllRewards, claimParams]);

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

export default useRewardsClaim;
