import { useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';

import { BN } from 'ethereumjs-util';
import { strings } from './strings';
import { RouteType } from '@cardstack/navigation/types';

import { TokenWithSafeAddress } from '@cardstack/screens/RewardsCenterScreen/components';
import { MainRoutes, useLoadingOverlay } from '@cardstack/navigation';
import {
  useGetRewardWithdrawGasEstimateQuery,
  useWithdrawRewardBalanceMutation,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import { useMutationEffects } from '@cardstack/hooks';
import { Alert } from '@rainbow-me/components/alerts';
import { defaultErrorAlert } from '@cardstack/constants';
import { fromWeiToFixedEth } from '@cardstack/utils';

interface NavParams {
  tokenInfo: TokenWithSafeAddress;
  fromRewardSafe: string;
  withdrawTo: any; // TODO: create right type with avatar customization
}

export const useRewardWithdrawConfimationScreen = () => {
  const { params } = useRoute<RouteType<NavParams>>();
  const { navigate } = useNavigation();

  const { accountAddress, network } = useAccountSettings();
  const { selectedWallet } = useWallets();

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

  // TODO: retry state for gas estimate failure
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
    navigate(MainRoutes.REWARDS_CENTER_SCREEN);
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
      walletId: selectedWallet.id,
      accountAddress,
      network,
      amount: totalBalanceMinusGasInWei,
    });
  }, [
    accountAddress,
    network,
    selectedWallet.id,
    showLoadingOverlay,
    totalBalanceMinusGasInWei,
    withdraw,
    withdrawBaseData,
  ]);

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
