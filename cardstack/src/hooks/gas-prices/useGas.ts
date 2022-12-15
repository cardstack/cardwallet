import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
  fromWei,
  getConstantByNetwork,
  greaterThanOrEqualTo,
} from '@cardstack/cardpay-sdk';
import { useCallback, useMemo, useState } from 'react';

import { useGetGasPricesQuery } from '@cardstack/services';
import { GasPricesQueryResults } from '@cardstack/services/hub/gas-prices/gas-prices-types';

import { useAccountAssets, useAccountSettings } from '@rainbow-me/hooks';
import { ethUnits } from '@rainbow-me/references';
import { ethereumUtils } from '@rainbow-me/utils';

import { ParseTxFeeParams, TxFee, UseGasParams } from './types';

const GAS_PRICE_POLLING_INTERVAL = 60000; // 1min

export const useGas = ({ network }: UseGasParams) => {
  const { nativeCurrency } = useAccountSettings();
  const chainId = getConstantByNetwork('chainId', network);
  const { assets } = useAccountAssets();
  const [txFees, setTxFees] = useState<TxFee>();

  const [selectedGasSpeed, setSelectedGasSpeed] = useState<
    keyof GasPricesQueryResults
  >('fast');

  const { data: gasPricesData } = useGetGasPricesQuery(
    { chainId },
    { pollingInterval: GAS_PRICE_POLLING_INTERVAL }
  );

  const getTxFees = useCallback(
    (params?: ParseTxFeeParams) => {
      if (!gasPricesData) {
        return;
      }

      const tokenPriceUnit =
        params?.nativeTokenPriceUnit ?? ethereumUtils.getEthPriceUnit();

      const gasLimit = params?.gasLimit ?? ethUnits.basic_tx;

      const speeds = Object.keys(gasPricesData) as Array<
        keyof typeof gasPricesData
      >;

      const calculateGasFee = speeds.map(speed => {
        const nativeTokenSymbol = getConstantByNetwork(
          'nativeTokenSymbol',
          network
        );

        const amount = gasLimit * (gasPricesData[speed].amount as number);

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

      const mapSpeedsToValues = Object.fromEntries(
        speeds.map((key, index) => [key, calculateGasFee[index]])
      );

      setTxFees(mapSpeedsToValues);
    },
    [network, nativeCurrency, gasPricesData]
  );

  const hasSufficientForGas = useMemo(() => {
    const nativeTokenAsset = ethereumUtils.getNativeTokenAsset(assets);
    const balanceAmount = nativeTokenAsset.balance.amount || 0;

    const txFeeAmount = fromWei(txFees?.[selectedGasSpeed].value.amount || 0);

    return greaterThanOrEqualTo(balanceAmount, txFeeAmount);
  }, [txFees, selectedGasSpeed, assets]);

  /**
   * Handles the ActionSheet with the different speed options
   */
  const showTransactionSpeedActionSheet = useCallback(() => {
    // const options = Object.values(txFees).map(speed => ({
    //   `${upperFirst(speed)}: ${cost}`
    // }));0x543450aeD7660acd764B8d3EFD107137521c4cc1
    // const options = [
    //   ...formatGasSpeedItems(gasPrices, txFees),
    //   { label: 'Cancel' },
    // ];
    // const cancelButtonIndex = options.length - 1;

    // if (!txFees) {
    //   return;
    // }

    // const options = Object.values(txFees).map(fee => `${fee.native.value}`);

    // console.log('options', Object.values(txFees));

    // showActionSheetWithOptions(
    //   {
    //     cancelButtonIndex: options.length,
    //     options,
    //   },
    //   (buttonIndex: number) => {
    //     console.log('Click Button', buttonIndex);
    //   }
    // );
    return false;
  }, []);

  return {
    getTxFees,
    selectedFee: txFees?.standard,
    setSelectedGasSpeed,
    selectedGasSpeed,
    hasSufficientForGas,
    showTransactionSpeedActionSheet,
  };
};
