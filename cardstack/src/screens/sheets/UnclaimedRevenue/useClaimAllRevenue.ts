import { StackActions, useNavigation } from '@react-navigation/core';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { useLoadingOverlay } from '@cardstack/navigation';
import { useClaimRevenueMutation } from '@cardstack/services';
import { MerchantSafeType } from '@cardstack/types';

import { usePrevious, useWallets } from '@rainbow-me/hooks';
import { logger } from '@rainbow-me/utils';

export const useClaimAllRevenue = ({
  merchantSafe,
  isRefreshingBalances,
}: {
  merchantSafe: MerchantSafeType;
  isRefreshingBalances: boolean;
}) => {
  const { signerParams, accountAddress } = useWallets();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { navigate, dispatch: navDispatch } = useNavigation();

  const [
    claimRevenue,
    { isSuccess, isError, error },
  ] = useClaimRevenueMutation();

  const onClaimAllPress = useCallback(() => {
    showLoadingOverlay({ title: 'Claiming' });

    claimRevenue({
      signerParams,
      revenueBalances: merchantSafe.revenueBalances,
      accountAddress,
      merchantSafeAddress: merchantSafe.address,
    });
  }, [
    accountAddress,
    claimRevenue,
    merchantSafe.address,
    merchantSafe.revenueBalances,
    showLoadingOverlay,
    signerParams,
  ]);

  // isRefreshing may be false when isSuccess is truthy on the first time
  // so we use the previous value to make sure
  const hasUpdated = usePrevious(isRefreshingBalances);

  useEffect(() => {
    if (isSuccess && hasUpdated) {
      dismissLoadingOverlay();

      navDispatch(StackActions.pop(2));
    }
  }, [dismissLoadingOverlay, isSuccess, hasUpdated, navigate, navDispatch]);

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
