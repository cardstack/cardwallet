import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetSafesDataQuery } from '@cardstack/services';
import { MerchantSafeType } from '@cardstack/types';
import { isCardPayCompatible } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

import {
  changePrimarySafe as setPrimarySafeAccount,
  selectPrimarySafe,
} from '../primarySafeSlice';

export const usePrimarySafe = () => {
  const dispatch = useDispatch();
  const { accountAddress, network, nativeCurrency } = useAccountSettings();

  const primarySafeKey = useSelector(selectPrimarySafe(network, accountAddress))
    ?.address;

  const {
    merchantSafes = [],
    error,
    isFetching,
    refetch,
    isLoading,
    isUninitialized,
  } = useGetSafesDataQuery(
    {
      address: accountAddress,
      nativeCurrency,
    },
    {
      selectFromResult: ({ data, ...rest }) => ({
        merchantSafes: data?.merchantSafes,
        ...rest,
      }),
      skip: !isCardPayCompatible(network) || !accountAddress,
    }
  );

  const primarySafe = useMemo(
    () => merchantSafes.find(({ address }) => address === primarySafeKey),
    [merchantSafes, primarySafeKey]
  );

  const changePrimarySafe = useCallback(
    (merchant: MerchantSafeType) =>
      dispatch(
        setPrimarySafeAccount({ network, accountAddress, primary: merchant })
      ),
    [dispatch, network, accountAddress]
  );

  // Ensures primary will always be valid if theres at least one merchant safe.
  useEffect(() => {
    if (!isFetching && merchantSafes?.length > 0 && !primarySafe) {
      changePrimarySafe(merchantSafes[merchantSafes.length - 1]);
    }
  }, [changePrimarySafe, primarySafe, merchantSafes, isFetching]);

  return {
    error,
    isFetching,
    refetch,
    merchantSafes,
    primarySafe,
    changePrimarySafe,
    isLoading,
    isUninitialized,
    isLoadingOnInit: isLoading || isUninitialized,
    safesCount: merchantSafes?.length || 1,
    hasProfile: !!merchantSafes.length,
  };
};
