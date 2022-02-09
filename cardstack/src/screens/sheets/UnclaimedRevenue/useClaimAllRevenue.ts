import { useNavigation } from '@react-navigation/core';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useLoadingOverlay } from '@cardstack/navigation';
import { useClaimRevenueMutation } from '@cardstack/services';
import { MerchantSafeType } from '@cardstack/types';
import { useAccountSettings, usePrevious, useWallets } from '@rainbow-me/hooks';
import { logger } from '@rainbow-me/utils';

export const useClaimAllRevenue = ({
  merchantSafe,
  isRefreshingBalances,
}: {
  merchantSafe: MerchantSafeType;
  isRefreshingBalances: boolean;
}) => {
  const { selectedWallet } = useWallets();
  const { accountAddress, network } = useAccountSettings();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();
  const { goBack, canGoBack, navigate } = useNavigation();

  const [
    claimRevenue,
    { isSuccess, isError, error },
  ] = useClaimRevenueMutation();

  const onClaimAllPress = useCallback(() => {
    showLoadingOverlay({ title: 'Claiming Revenue' });

    claimRevenue({
      selectedWallet,
      revenueBalances: merchantSafe.revenueBalances,
      accountAddress,
      merchantSafeAddress: merchantSafe.address,
      network,
    });
  }, [
    accountAddress,
    claimRevenue,
    merchantSafe.address,
    merchantSafe.revenueBalances,
    network,
    selectedWallet,
    showLoadingOverlay,
  ]);

  // isRefreshing may be false when isSuccess is truthy on the first time
  // so we use the previous value to make sure
  const hasUpdated = usePrevious(isRefreshingBalances);

  useEffect(() => {
    if (isSuccess && hasUpdated) {
      dismissLoadingOverlay();

      goBack();
    }
  }, [
    dismissLoadingOverlay,
    isSuccess,
    hasUpdated,
    goBack,
    canGoBack,
    navigate,
  ]);

  useEffect(() => {
    if (isError) {
      dismissLoadingOverlay();
      logger.sentry('Error claiming revenue', error);
      Alert.alert(
        'Could not claim revenue, please try again. If this problem persists please reach out to support@cardstack.com'
      );
    }
  }, [dismissLoadingOverlay, error, isError]);

  return onClaimAllPress;
};
