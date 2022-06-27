import { convertToSpend } from '@cardstack/cardpay-sdk';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects } from '@cardstack/hooks';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import {
  useLazyGetRegisterRewardeeGasEstimateQuery,
  useRegisterToRewardProgramMutation,
} from '@cardstack/services/rewards-center/rewards-center-api';
import {
  PrepaidCardType,
  RewardsRegisterData,
  TransactionConfirmationType,
} from '@cardstack/types';

import { Alert } from '@rainbow-me/components/alerts';
import { useWallets } from '@rainbow-me/hooks';

import { strings } from '../strings';
import useRewardsDataFetch from '../useRewardsDataFetch';

export const defaultGasEstimateInSpend = convertToSpend(0.05, 'USD', 1);

interface RouteParams {
  prepaidCard: PrepaidCardType;
}

const useRewardsRegister = () => {
  const { params } = useRoute<RouteType<RouteParams>>();
  const { navigate, dispatch, goBack } = useNavigation();
  const { defaultRewardProgramId } = useRewardsDataFetch();
  const { accountAddress } = useWallets();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const [
    registerToRewardProgram,
    { isSuccess: isRegistrationSuccess, isError: isRegistrationError },
  ] = useRegisterToRewardProgramMutation();

  const [
    getRegisterGasEstimate,
    { data: registerEstimatedGas, isLoading: registerEstimatedGasLoading },
  ] = useLazyGetRegisterRewardeeGasEstimateQuery();

  const registerConfirmationData: RewardsRegisterData = useMemo(
    () => ({
      type: TransactionConfirmationType.REWARDS_REGISTER,
      programName: strings.defaultProgramName,
      prepaidCard: params?.prepaidCard?.address || '',
      spendAmount: registerEstimatedGas || defaultGasEstimateInSpend,
    }),
    [params, registerEstimatedGas]
  );

  useEffect(() => {
    if (params?.prepaidCard) {
      getRegisterGasEstimate({
        prepaidCardAddress: params.prepaidCard.address,
        rewardProgramId: defaultRewardProgramId,
      });
    }
  }, [params, getRegisterGasEstimate, defaultRewardProgramId]);

  const onPrepaidCardSelection = useCallback(
    async (prepaidCard: PrepaidCardType) => {
      navigate(Routes.REWARDS_REGISTER_SHEET, { prepaidCard });
    },
    [navigate]
  );

  const onRegisterPress = useCallback(() => {
    navigate(Routes.CHOOSE_PREPAIDCARD_SHEET, {
      spendAmount: defaultGasEstimateInSpend,
      onConfirmChoosePrepaidCard: onPrepaidCardSelection,
      payCostDesc: strings.register.payCostDescription,
    });
  }, [navigate, onPrepaidCardSelection]);

  const onConfirmRegisterPress = useCallback(() => {
    showLoadingOverlay({ title: strings.register.loading });

    if (registerConfirmationData.prepaidCard) {
      registerToRewardProgram({
        accountAddress,

        prepaidCardAddress: registerConfirmationData.prepaidCard,
        rewardProgramId: defaultRewardProgramId,
      });
    }
  }, [
    registerConfirmationData,
    showLoadingOverlay,
    registerToRewardProgram,
    defaultRewardProgramId,
    accountAddress,
  ]);

  const onRegisterFulfilledAlert = useCallback(
    ({ title, message, popStackNavigation }) => () => {
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
          status: isRegistrationSuccess,
          callback: onRegisterFulfilledAlert({
            ...strings.register.successAlert,
            popStackNavigation: 2,
          }),
        },
        error: {
          status: isRegistrationError,
          callback: onRegisterFulfilledAlert(defaultErrorAlert),
        },
      }),
      [isRegistrationError, isRegistrationSuccess, onRegisterFulfilledAlert]
    )
  );

  return {
    data: registerConfirmationData,
    onRegisterPress,
    onConfirmRegisterPress,
    goBack,
    registerEstimatedGasLoading,
  };
};

export default useRewardsRegister;
