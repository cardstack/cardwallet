import { getConstantByNetwork } from '@cardstack/cardpay-sdk';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  gasUpdateCustomValues,
  gasUpdateDefaultGasLimit,
  gasUpdateGasPriceOption,
  gasUpdateTxFee,
  saveGasPrices,
} from '../redux/gas';

import useAccountSettings from './useAccountSettings';
import { useGetGasPricesQuery } from '@cardstack/services';

const GAS_PRICE_POLLING_INTERVAL = 15000; // 15s

export default function useGas() {
  const dispatch = useDispatch();
  const { network } = useAccountSettings();

  const gasData = useSelector(
    ({
      gas: {
        gasLimit,
        gasPrices,
        isSufficientGas,
        selectedGasPrice,
        selectedGasPriceOption,
        txFees,
      },
    }) => ({
      gasLimit,
      gasPrices,
      isSufficientGas,
      selectedGasPrice,
      selectedGasPriceOption,
      txFees,
    })
  );

  const { data } = useGetGasPricesQuery(
    {
      chainId: getConstantByNetwork('chainId', network),
    },
    {
      pollingInterval: GAS_PRICE_POLLING_INTERVAL,
    }
  );

  const startPollingGasPrices = useCallback(
    () => dispatch(saveGasPrices(data)),
    [dispatch, data]
  );

  const updateDefaultGasLimit = useCallback(
    data => dispatch(gasUpdateDefaultGasLimit(data)),
    [dispatch]
  );

  const updateGasPriceOption = useCallback(
    data => dispatch(gasUpdateGasPriceOption(data)),
    [dispatch]
  );

  const updateTxFee = useCallback(
    (data, overrideGasOption) =>
      dispatch(gasUpdateTxFee(data, overrideGasOption)),
    [dispatch]
  );
  const updateCustomValues = useCallback(
    (price, estimate) => dispatch(gasUpdateCustomValues(price, estimate)),
    [dispatch]
  );

  return {
    startPollingGasPrices,
    updateCustomValues,
    updateDefaultGasLimit,
    updateGasPriceOption,
    updateTxFee,
    ...gasData,
  };
}
