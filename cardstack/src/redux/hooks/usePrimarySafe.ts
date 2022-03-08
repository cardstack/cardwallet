import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changePrimarySafe as setPrimarySafeAccount,
  selectPrimarySafe,
} from '../primarySafeSlice';
import { useGetSafesDataQuery } from '@cardstack/services';
import { useAccountSettings } from '@rainbow-me/hooks';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { MerchantSafeType } from '@cardstack/types';

export default function usePrimarySafe() {
  const dispatch = useDispatch();
  const [nativeCurrency] = useNativeCurrencyAndConversionRates();
  const { accountAddress, network } = useAccountSettings();

  const primarySafe = useSelector(selectPrimarySafe(network, accountAddress));

  const {
    data: { merchantSafes },
    error,
  } = useGetSafesDataQuery({
    address: accountAddress,
    nativeCurrency,
  });

  const changePrimarySafe = useCallback(
    (merchant: MerchantSafeType) =>
      dispatch(
        setPrimarySafeAccount({ network, accountAddress, primary: merchant })
      ),
    [dispatch, network, accountAddress]
  );

  // Ensures primary will always be valid if theres at least one merchant safe.
  useEffect(() => {
    if (merchantSafes?.length > 0 && !primarySafe) {
      changePrimarySafe(merchantSafes[merchantSafes.length - 1]);
    }
  }, [changePrimarySafe, primarySafe, merchantSafes]);

  return {
    error,
    merchantSafes,
    primarySafe,
    changePrimarySafe,
  };
}
