import { convertHexToString } from '@cardstack/cardpay-sdk';
import { get, isEmpty } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

import { estimateGas, toHex } from '@rainbow-me/handlers/web3';
import { useGas } from '@rainbow-me/hooks';
import logger from 'logger';

export const useCalculateGas = (
  isMessageRequest: boolean,
  rawPayloadParams: any
) => {
  const { gasLimit, gasPrices, updateTxFee, shouldUpdateTxFee } = useGas();

  const calculatingGasLimit = useRef(false);

  const calculateGasLimit = useCallback(async () => {
    calculatingGasLimit.current = true;
    const txPayload = get(rawPayloadParams, '[0]');
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
  }, [rawPayloadParams, updateTxFee]);

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
    rawPayloadParams,
    shouldUpdateTxFee,
    updateTxFee,
  ]);
};
