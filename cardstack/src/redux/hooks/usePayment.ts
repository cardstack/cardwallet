import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { paymentChangeCurrency as changeCurrency } from '../payment';
import { RootState } from '@rainbow-me/redux/store';

export default function usePayment() {
  const dispatch = useDispatch();

  const paymentData = useSelector(({ payment: { currency } }: RootState) => ({
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
