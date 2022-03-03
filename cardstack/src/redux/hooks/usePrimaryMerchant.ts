import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  changePrimaryMerchant as slideChangePrimaryMerchant,
  selectPrimaryMerchantSafe,
} from '../merchantSlice';
import { useGetSafesDataQuery } from '@cardstack/services';
import { useTypedSelector } from '@rainbow-me/redux/store';
import { useAccountSettings } from '@rainbow-me/hooks';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { MerchantSafeType } from '@cardstack/types';

export default function usePrimaryMerchant() {
  const dispatch = useDispatch();
  const [nativeCurrency] = useNativeCurrencyAndConversionRates();
  const { accountAddress } = useAccountSettings();
  const primaryMerchant = useTypedSelector(selectPrimaryMerchantSafe);

  const {
    data: { merchantSafes },
    error,
  } = useGetSafesDataQuery({
    address: accountAddress,
    nativeCurrency,
  });

  const changePrimaryMerchant = useCallback(
    (merchant: MerchantSafeType) =>
      dispatch(slideChangePrimaryMerchant({ primary: merchant })),
    [dispatch]
  );

  // Ensures primary will always be valid if theres at least one merchant safe.
  useEffect(() => {
    if (merchantSafes?.length > 0 && !primaryMerchant) {
      changePrimaryMerchant(merchantSafes[merchantSafes.length - 1]);
    }
  }, [changePrimaryMerchant, primaryMerchant, merchantSafes]);

  return {
    error,
    merchantSafes,
    primaryMerchant,
    changePrimaryMerchant,
  };
}
