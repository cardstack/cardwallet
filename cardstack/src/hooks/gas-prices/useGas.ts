import {
  convertAmountAndPriceToNativeDisplay,
  convertRawAmountToBalance,
  fromWei,
  getConstantByNetwork,
  greaterThanOrEqualTo,
} from '@cardstack/cardpay-sdk';
import { useCallback, useMemo, useState } from 'react';

import { useGetGasPricesQuery } from '@cardstack/services';
import { GasPricesQueryResults } from '@cardstack/services/hub/gas-prices/gas-prices-types';

import { useAccountSettings } from '@rainbow-me/hooks';
import { ethUnits } from '@rainbow-me/references';
import { ethereumUtils } from '@rainbow-me/utils';

import { useAssets } from '../assets/useAssets';

import { ParseTxFeeParams, TxFee, UseGasParams } from './types';

const GAS_PRICE_POLLING_INTERVAL = 60000; // 1min

export const useGas = ({ network }: UseGasParams) => {
  const { nativeCurrency } = useAccountSettings();
  const chainId = getConstantByNetwork('chainId', network);

  const nativeTokenDecimals = getConstantByNetwork(
    'nativeTokenDecimals',
    network
  );

  const { assets, getAssetBalance, getAssetPrice } = useAssets();
  const [txFees, setTxFees] = useState<TxFee>();

  const [selectedGasSpeed, setSelectedGasSpeed] = useState<
    keyof GasPricesQueryResults
  >('standard');

  const { data: gasPricesData } = useGetGasPricesQuery(
    { chainId },
    { pollingInterval: GAS_PRICE_POLLING_INTERVAL }
  );

  const getTxFees = useCallback(
    (params?: ParseTxFeeParams) => {
      if (!gasPricesData) {
        return;
      }

      const gasLimit = params?.gasLimit ?? ethUnits.basic_tx;
      const nativeToken = ethereumUtils.getNativeTokenAsset(assets);
      const nativeTokenPrice = getAssetPrice(nativeToken?.id);

      const speeds = Object.keys(gasPricesData) as Array<
        keyof typeof gasPricesData
      >;

      const calculateGasFee = speeds.map(speed => {
        const nativeTokenSymbol = getConstantByNetwork(
          'nativeTokenSymbol',
          network
        );

        const fee = gasLimit * (gasPricesData[speed].amount as number); // value in GWEI

        const ethValue = convertRawAmountToBalance(fee, {
          decimals: nativeTokenDecimals,
          symbol: nativeTokenSymbol,
        });

        return {
          native: {
            ...convertAmountAndPriceToNativeDisplay(
              ethValue.amount,
              nativeTokenPrice,
              nativeCurrency,
              2
            ),
          },
          value: ethValue,
        };
      });

      const mapSpeedsToValues = Object.fromEntries(
        speeds.map((key, index) => [key, calculateGasFee[index]])
      );

      setTxFees(mapSpeedsToValues);
    },
    [
      network,
      nativeCurrency,
      gasPricesData,
      nativeTokenDecimals,
      assets,
      getAssetPrice,
    ]
  );

  const hasSufficientForGas = useMemo(() => {
    const nativeTokenAsset = ethereumUtils.getNativeTokenAsset(assets);
    const { amount } = getAssetBalance(nativeTokenAsset.id);
    const txFeeAmount = fromWei(txFees?.[selectedGasSpeed].value.amount || 0);

    return greaterThanOrEqualTo(amount, txFeeAmount);
  }, [txFees, selectedGasSpeed, assets, getAssetBalance]);

  /**
   * Handles the ActionSheet with the different speed options
   */
  const showTransactionSpeedActionSheet = useCallback(() => {
    // const options = Object.values(txFees).map(speed => ({
    //   `${upperFirst(speed)}: ${cost}`
    // }));
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
    selectedFee: txFees?.[selectedGasSpeed],
    setSelectedGasSpeed,
    selectedGasSpeed,
    hasSufficientForGas,
    showTransactionSpeedActionSheet,
  };
};
