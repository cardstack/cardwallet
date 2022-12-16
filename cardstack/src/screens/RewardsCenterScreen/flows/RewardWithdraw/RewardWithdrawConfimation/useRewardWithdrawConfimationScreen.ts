import { useNavigation, useRoute } from '@react-navigation/native';
import { BN } from 'ethereumjs-util';
import { useCallback, useMemo } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects } from '@cardstack/hooks';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { TokenWithSafeAddress } from '@cardstack/screens/RewardsCenterScreen/components';
import {
  useGetRewardWithdrawGasEstimateQuery,
  useWithdrawRewardBalanceMutation,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { MerchantOrDepotSafe } from '@cardstack/types';
import { fromWeiToFixedEth } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import { useWallets } from '@rainbow-me/hooks';

import { strings } from './strings';

interface NavParams {
  tokenInfo: TokenWithSafeAddress;
  fromRewardSafe: string;
  withdrawTo: MerchantOrDepotSafe;
}

export const useRewardWithdrawConfimationScreen = () => {
  const { params } = useRoute<RouteType<NavParams>>();
  const { navigate } = useNavigation();

  const { accountAddress } = useWallets();

  const {
    fromRewardSafe,
    withdrawTo,
    tokenInfo: { tokenAddress, balance },
  } = params;

  const withdrawBaseData = useMemo(
    () => ({
      from: fromRewardSafe,
      to: withdrawTo.address,
      tokenAddress,
      amount: balance?.wei || '0',
    }),
    [balance, fromRewardSafe, tokenAddress, withdrawTo]
  );

  const {
    data: gasEstimate = new BN(0),
    isLoading: loadingGas,
    isFetching: fetchingGas,
  } = useGetRewardWithdrawGasEstimateQuery(withdrawBaseData, {
    refetchOnMountOrArgChange: true,
  });

  const totalBalanceMinusGasInWei = useMemo(
    () => new BN(withdrawBaseData.amount).sub(gasEstimate).toString(),
    [gasEstimate, withdrawBaseData.amount]
  );

  const estimatedNetClaim = useMemo(
    () => fromWeiToFixedEth(totalBalanceMinusGasInWei),
    [totalBalanceMinusGasInWei]
  );

  const gasEstimateInEth = useMemo(
    () => fromWeiToFixedEth(gasEstimate.toString()),
    [gasEstimate]
  );

  const returnToRewardsCenter = useCallback(() => {
    navigate(Routes.REWARDS_CENTER_SCREEN);
  }, [navigate]);

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const [
    withdraw,
    { isError: isWithdrawFailure, isSuccess: isWithdrawSuccessful },
  ] = useWithdrawRewardBalanceMutation();

  const onConfirmPress = useCallback(() => {
    showLoadingOverlay({ title: strings.loading });

    withdraw({
      ...withdrawBaseData,
      accountAddress,
      // When no amount is provided, the whole avaible balance is withdrawn
      amount: undefined,
    });
  }, [accountAddress, showLoadingOverlay, withdraw, withdrawBaseData]);

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isWithdrawSuccessful,
          callback: () => {
            dismissLoadingOverlay();
            returnToRewardsCenter();
          },
        },
        error: {
          status: isWithdrawFailure,
          callback: () => {
            dismissLoadingOverlay();
            Alert(defaultErrorAlert);
          },
        },
      }),
      [
        dismissLoadingOverlay,
        isWithdrawFailure,
        isWithdrawSuccessful,
        returnToRewardsCenter,
      ]
    )
  );

  return {
    params,
    onCancelPress: returnToRewardsCenter,
    onConfirmPress,
    isLoadingGasEstimate: loadingGas || fetchingGas,
    gasEstimateInEth,
    estimatedNetClaim,
  };
};
