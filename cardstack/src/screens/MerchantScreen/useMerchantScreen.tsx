import { useCallback, useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import { MerchantSafeType } from '@cardstack/types';
import { useAccountSettings } from '@rainbow-me/hooks';
import { useGetSafesDataQuery } from '@cardstack/services';
import { RouteType } from '@cardstack/navigation/types';
import usePrimarySafe from '@cardstack/redux/hooks/usePrimarySafe';
import { MerchantContentProps } from '@cardstack/components';

export const useMerchantScreen = () => {
  const {
    params: { merchantSafe: merchantSafeFallback },
  } = useRoute<RouteType<MerchantContentProps>>();

  const { accountAddress, nativeCurrency } = useAccountSettings();

  const { updatedMerchantSafe, isRefreshingBalances } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      selectFromResult: ({ data, isFetching }) => ({
        updatedMerchantSafe: data?.merchantSafes.find(
          (safe: MerchantSafeType) =>
            safe.address === merchantSafeFallback.address
        ),
        isRefreshingBalances: isFetching,
      }),
    }
  );

  const { primarySafe, changePrimarySafe } = usePrimarySafe();

  const { merchantSafe, isPrimarySafe } = useMemo(() => {
    const safe = updatedMerchantSafe || merchantSafeFallback;
    return {
      merchantSafe: safe,
      isPrimarySafe: primarySafe?.address === safe.address,
    };
  }, [primarySafe, updatedMerchantSafe, merchantSafeFallback]);

  const changeToPrimarySafe = useCallback(() => {
    changePrimarySafe(merchantSafe);
  }, [merchantSafe, changePrimarySafe]);

  return {
    isRefreshingBalances,
    merchantSafe,
    isPrimarySafe,
    changeToPrimarySafe,
  };
};
