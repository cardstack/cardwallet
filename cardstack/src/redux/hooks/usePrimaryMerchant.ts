import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  changePrimaryMerchant as slideChangePrimaryMerchant,
  selectPrimaryMerchantSafe,
} from '../merchantSlice';
import { useTypedSelector } from '@rainbow-me/redux/store';
import { MerchantSafeType } from '@cardstack/types';

export default function usePrimaryMerchant() {
  const dispatch = useDispatch();
  const primaryMerchant = useTypedSelector(selectPrimaryMerchantSafe);

  const changePrimaryMerchant = useCallback(
    (merchant: MerchantSafeType) =>
      dispatch(slideChangePrimaryMerchant({ primary: merchant })),
    [dispatch]
  );

  return {
    primaryMerchant,
    changePrimaryMerchant,
  };
}
