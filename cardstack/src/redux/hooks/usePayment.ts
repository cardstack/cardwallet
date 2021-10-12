import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  paymentChangeCurrency as changeCurrency,
  paymentProcessStart,
  paymentProcessDone,
} from '../payment';
import { RootState } from '@rainbow-me/redux/store';

export default function usePayment() {
  const dispatch = useDispatch();

  const paymentData = useSelector(
    ({
      payment: { currency, inProcess, processTitle, processSubTitle },
    }: RootState) => ({
      currency,
      inProcess,
      processTitle,
      processSubTitle,
    })
  );

  const paymentChangeCurrency = useCallback(
    currency => dispatch(changeCurrency(currency)),
    [dispatch]
  );

  const processStart = useCallback(
    (processTitle?: string, processSubTitle?: string) =>
      dispatch(paymentProcessStart(processTitle, processSubTitle)),
    [dispatch]
  );

  const processDone = useCallback(() => dispatch(paymentProcessDone()), [
    dispatch,
  ]);

  return {
    paymentChangeCurrency,
    paymentProcessStart: processStart,
    paymentProcessDone: processDone,
    ...paymentData,
  };
}
