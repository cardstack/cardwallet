import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { multiply, zipObject } from 'lodash';
import { useCallback } from 'react';

import { useGetGasPricesQuery } from '@cardstack/services';
import { NetworkType } from '@cardstack/types';

import { useAccountSettings } from '@rainbow-me/hooks';
import { ethUnits } from '@rainbow-me/references';
import { ethereumUtils } from '@rainbow-me/utils';

const GAS_PRICE_POLLING_INTERVAL = 10000; // 10s

interface UseGasParams {
  network: NetworkType;
}

interface ParseTxFeeParams {
  nativeTokenPriceUnit?: number;
  gasLimit?: number;
}

export const useGas = ({ network }: UseGasParams) => {
  const { nativeCurrency } = useAccountSettings();
  const chainId = getConstantByNetwork('chainId', network);

  const { data: gasPricesData } = useGetGasPricesQuery(
    { chainId },
    { pollingInterval: GAS_PRICE_POLLING_INTERVAL }
  );

  const parseTxFees = useCallback(
    (params: ParseTxFeeParams) => {
      if (!gasPricesData) {
        return;
      }

      const tokenPriceUnit =
        params?.nativeTokenPriceUnit ?? ethereumUtils.getEthPriceUnit();

      const gasLimit = params?.gasLimit ?? ethUnits.basic_tx;
      const speeds = Object.keys(gasPricesData);

      const txFees = speeds.map(speed => {
        const nativeTokenSymbol = getConstantByNetwork(
          'nativeTokenSymbol',
          network
        );

        const amount = multiply(gasPricesData[speed], gasLimit);

        return {
          native: {
            value: convertRawAmountToNativeDisplay(
              amount,
              18,
              tokenPriceUnit,
              nativeCurrency
            ),
          },
          value: convertRawAmountToBalance(amount, {
            decimals: 18,
            symbol: nativeTokenSymbol,
          }),
        };
      });

      return zipObject(speeds, txFees);
    },
    [network, nativeCurrency, gasPricesData]
  );

  return {
    parseTxFees,
  };
};
