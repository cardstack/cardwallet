import { convertHexToString } from '@cardstack/cardpay-sdk';
import { get, isEmpty } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { useIsMessageRequest } from './use-is-message-request';

import { useRouteParams } from './use-route-params';
import logger from 'logger';
import { useGas } from '@rainbow-me/hooks';
import { estimateGas, toHex } from '@rainbow-me/handlers/web3';

export const useCalculateGas = () => {
  const {
    transactionDetails: {
      payload: { method, params },
    },
  } = useRouteParams();

  const { gasLimit, gasPrices, updateTxFee } = useGas();

  const isMessageRequest = useIsMessageRequest();

  const calculatingGasLimit = useRef(false);

  const calculateGasLimit = useCallback(async () => {
    calculatingGasLimit.current = true;
    const txPayload = get(params, '[0]');
    // use the default
    let gas = txPayload.gasLimit || txPayload.gas;

    try {
      // attempt to re-run estimation
      logger.log('Estimating gas limit');
      const rawGasLimit = await estimateGas(txPayload);
      logger.log('Estimated gas limit', rawGasLimit);

      if (rawGasLimit) {
        gas = toHex(rawGasLimit);
      }
    } catch (error) {
      logger.log('error estimating gas', error);
    }

    logger.log('Setting gas limit to', convertHexToString(gas));
    // Wait until the gas prices are populated
    setTimeout(() => {
      updateTxFee(gas);
    }, 1000);
  }, [params, updateTxFee]);

  useEffect(() => {
    if (
      !isEmpty(gasPrices) &&
      !calculatingGasLimit.current &&
      !isMessageRequest
    ) {
      InteractionManager.runAfterInteractions(() => {
        calculateGasLimit();
      });
    }
  }, [
    calculateGasLimit,
    gasLimit,
    gasPrices,
    isMessageRequest,
    method,
    params,
    updateTxFee,
  ]);
};
