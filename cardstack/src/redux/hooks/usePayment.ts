import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@rainbow-me/redux/store';

import { paymentChangeCurrency as changeCurrency } from '../payment';

export default function usePayment() {
  const dispatch = useDispatch();

  const paymentData = useSelector(({ payment: { currency } }: AppState) => ({
    currency,
  }));

  const paymentChangeCurrency = useCallback(
    currency => dispatch(changeCurrency(currency)),
    [dispatch]
  );

  return {
    paymentChangeCurrency,
    ...paymentData,
  };
}
