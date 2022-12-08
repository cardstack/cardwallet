import { getConstantByNetwork } from '@cardstack/cardpay-sdk';

import { isEqual } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  gasUpdateCustomValues,
  gasUpdateDefaultGasLimit,
  gasUpdateGasPriceOption,
  gasUpdateTxFee,
  saveGasPrices,
} from '../redux/gas';

import useAccountSettings from './useAccountSettings';
import { usePrevious } from '.';
import { useGetGasPricesQuery } from '@cardstack/services';

const GAS_PRICE_POLLING_INTERVAL = 10000; // 10s

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

  const hasTriggeredPollingOnce = useRef(false);
  const [shouldUpdateTxFee, setShouldUpdateTxFee] = useState(false);

  const { data: gasPricesData } = useGetGasPricesQuery(
    {
      chainId: getConstantByNetwork('chainId', network),
    },
    {
      pollingInterval: GAS_PRICE_POLLING_INTERVAL,
    }
  );

  const previousGas = usePrevious(gasPricesData);

  const startPollingGasPrices = useCallback(async () => {
    hasTriggeredPollingOnce.current = true;

    await dispatch(saveGasPrices(gasPricesData));
    setShouldUpdateTxFee(true);
  }, [dispatch, gasPricesData]);

  useEffect(() => {
    if (
      !isEqual(previousGas, gasPricesData) &&
      hasTriggeredPollingOnce.current
    ) {
      startPollingGasPrices();
    }
  }, [gasPricesData, previousGas, shouldUpdateTxFee, startPollingGasPrices]);

  const updateDefaultGasLimit = useCallback(
    data => dispatch(gasUpdateDefaultGasLimit(data)),
    [dispatch]
  );

  const updateGasPriceOption = useCallback(
    data => dispatch(gasUpdateGasPriceOption(data)),
    [dispatch]
  );

  const updateTxFee = useCallback(
    (data, overrideGasOption) => {
      setShouldUpdateTxFee(false);
      return dispatch(gasUpdateTxFee(data, overrideGasOption));
    },
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
    shouldUpdateTxFee,
    ...gasData,
  };
}
