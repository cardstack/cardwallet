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
import { isLayer1 } from '@cardstack/utils';

const safesInitialState = {
  merchantSafes: [],
};

export const usePrimarySafe = () => {
  const dispatch = useDispatch();
  const [nativeCurrency] = useNativeCurrencyAndConversionRates();
  const { accountAddress, network } = useAccountSettings();

  const primarySafe = useSelector(selectPrimarySafe(network, accountAddress));

  const {
    data = safesInitialState,
    error,
    isFetching,
    refetch,
  } = useGetSafesDataQuery(
    {
      address: accountAddress,
      nativeCurrency,
    },
    {
      skip: isLayer1(network) || !accountAddress,
    }
  );

  const { merchantSafes } = data;

  const changePrimarySafe = useCallback(
    (merchant: MerchantSafeType) =>
      dispatch(
        setPrimarySafeAccount({ network, accountAddress, primary: merchant })
      ),
    [dispatch, network, accountAddress]
  );

  // Ensures primary will always be valid if theres at least one merchant safe.
  useEffect(() => {
    if (!isFetching && merchantSafes?.length > 0) {
      if (primarySafe) {
        const updatedPrimarySafe = merchantSafes.find(
          (safe: MerchantSafeType) => safe.address === primarySafe.address
        );

        if (updatedPrimarySafe) {
          changePrimarySafe(updatedPrimarySafe);
        }
      } else {
        changePrimarySafe(merchantSafes[merchantSafes.length - 1]);
      }
    }
  }, [changePrimarySafe, primarySafe, merchantSafes, isFetching]);

  return {
    error,
    isFetching,
    refetch,
    merchantSafes,
    primarySafe,
    changePrimarySafe,
    safesCount: merchantSafes?.length || 1,
  };
};
