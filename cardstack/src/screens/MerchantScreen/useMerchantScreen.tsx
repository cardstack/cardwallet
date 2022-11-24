import { useRoute } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { MerchantContentProps } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { useGetSafesDataQuery } from '@cardstack/services';
import { MerchantSafeType } from '@cardstack/types';

import { useAccountSettings } from '@rainbow-me/hooks';

import { strings } from './strings';

export const useMerchantScreen = () => {
  const {
    params: { merchantSafe: merchantSafeFallback },
  } = useRoute<RouteType<MerchantContentProps>>();

  const {
    accountAddress,
    nativeCurrency,
    noCardPayAccount,
  } = useAccountSettings();

  const {
    updatedMerchantSafe,
    isRefreshingBalances,
    refetch,
  } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      skip: noCardPayAccount,
      refetchOnMountOrArgChange: 60,
      selectFromResult: ({ data, isFetching }) => ({
        updatedMerchantSafe: data?.merchantSafes?.find(
          (safe: MerchantSafeType) =>
            safe.address === merchantSafeFallback.address
        ),
        isRefreshingBalances: isFetching,
      }),
    }
  );

  const { primarySafe, changePrimarySafe, safesCount } = usePrimarySafe();

  const { merchantSafe, isPrimarySafe } = useMemo(() => {
    const safe = updatedMerchantSafe || merchantSafeFallback;
    return {
      merchantSafe: safe,
      isPrimarySafe: primarySafe?.address === safe.address,
    };
  }, [primarySafe, updatedMerchantSafe, merchantSafeFallback]);

  const changePrimaryConfirmation = useCallback(() => {
    Alert.alert(
      strings.confirmPrimaryChangeTitle,
      strings.confirmPrimaryChange,
      [
        {
          text: strings.confirm,
          onPress: () => changePrimarySafe(merchantSafe),
        },
        {
          text: strings.cancel,
          style: 'cancel',
        },
      ]
    );
  }, [merchantSafe, changePrimarySafe]);

  const changeToPrimarySafe = useCallback(() => {
    changePrimaryConfirmation();
  }, [changePrimaryConfirmation]);

  return {
    isRefreshingBalances,
    refetch,
    merchantSafe,
    safesCount,
    isPrimarySafe,
    changeToPrimarySafe,
  };
};
