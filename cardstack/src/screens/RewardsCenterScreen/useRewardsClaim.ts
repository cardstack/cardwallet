import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { useBooleanState } from '@cardstack/hooks';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { useClaimRewardsMutation } from '@cardstack/services/rewards-center/rewards-center-api';
import { getClaimRewardsGasEstimate } from '@cardstack/services/rewards-center/rewards-center-service';
import {
  RewardsSafeType,
  TokenByProgramID,
} from '@cardstack/services/rewards-center/rewards-center-types';
import { queryPromiseWrapper } from '@cardstack/services/utils';
import {
  RewardsClaimData,
  TransactionConfirmationType,
} from '@cardstack/types';

import { useWallets } from '@rainbow-me/hooks';

import { strings } from './strings';

interface useRewardClaimsProps {
  accountAddress: string;
  mainPoolTokenInfo?: TokenByProgramID;
  rewardSafes?: RewardsSafeType[];
}

const useRewardsClaim = ({
  rewardSafes,
  accountAddress,
  mainPoolTokenInfo,
}: useRewardClaimsProps) => {
  const { navigate, goBack } = useNavigation();

  const [
    isLoadingClaimGas,
    startClaimGasLoading,
    stopClaimGasLoading,
  ] = useBooleanState();

  const { showLoadingOverlay } = useLoadingOverlay();

  const { signerParams } = useWallets();

  const [
    claimRewards,
    { isSuccess: isClaimSuccess, isError: isClaimError },
  ] = useClaimRewardsMutation();

  const onClaimPress = useCallback(
    (tokenAddress, rewardProgramId) => async () => {
      startClaimGasLoading();

      const rewardSafeForProgram = rewardSafes?.find(
        safe => safe.rewardProgramId === rewardProgramId
      );

      const partialClaimParams = {
        tokenAddress,
        accountAddress,
        rewardProgramId,
        safeAddress: rewardSafeForProgram?.address || '',
      };

      const {
        data: estimatedClaimGas,
      } = await queryPromiseWrapper(
        getClaimRewardsGasEstimate,
        partialClaimParams,
        { errorLogMessage: 'Error fetching reward claim gas fee' }
      );

      stopClaimGasLoading();

      // Cant assign undefined mainPoolTokenInfo to data.
      if (mainPoolTokenInfo) {
        const data: RewardsClaimData = {
          type: TransactionConfirmationType.REWARDS_CLAIM,
          estGasFee: estimatedClaimGas || '0.10',
          ...mainPoolTokenInfo,
        };

        navigate(Routes.REWARDS_CLAIM_SHEET, {
          data,
          onConfirm: () => {
            showLoadingOverlay({ title: strings.claim.loading });

            claimRewards({
              ...partialClaimParams,
              signerParams,
              rewardProgramId,
            });
          },
          onCancel: goBack,
        });
      }
    },
    [
      startClaimGasLoading,
      rewardSafes,
      accountAddress,
      stopClaimGasLoading,
      mainPoolTokenInfo,
      navigate,
      goBack,
      showLoadingOverlay,
      claimRewards,
      signerParams,
    ]
  );

  return { onClaimPress, isLoadingClaimGas, isClaimSuccess, isClaimError };
};

export default useRewardsClaim;
