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
import { showActionSheetWithOptions } from '@rainbow-me/utils';

import { useAssets } from '../assets/useAssets';

import { ParseTxFeeParams, TxFee, UseGasParams } from './types';

const GAS_PRICE_POLLING_INTERVAL = 10000; // 10s

export const useGas = ({ network }: UseGasParams) => {
  const { nativeCurrency } = useAccountSettings();
  const chainId = getConstantByNetwork('chainId', network);

  const { getAssetBalance, getAssetPrice } = useAssets();
  const [txFees, setTxFees] = useState<TxFee>();

  const nativeToken = useMemo(() => {
    const address = getConstantByNetwork('nativeTokenAddress', network);
    const symbol = getConstantByNetwork('nativeTokenSymbol', network);

    return {
      price: getAssetPrice(address),
      balance: getAssetBalance(address),
      symbol,
    };
  }, [network, getAssetPrice, getAssetBalance]);

  const [selectedGasSpeed, setSelectedGasSpeed] = useState<
    keyof GasPricesQueryResults
  >('standard');

  const { data: gasPricesData } = useGetGasPricesQuery(
    { chainId },
    { pollingInterval: GAS_PRICE_POLLING_INTERVAL }
  );

  const getTxFees = useCallback(
    ({ gasLimit: updatedGasLimit }: ParseTxFeeParams) => {
      if (!gasPricesData) {
        return;
      }

      const nativeTokenDecimals = getConstantByNetwork(
        'nativeTokenDecimals',
        network
      );

      const gasLimit = updatedGasLimit ?? ethUnits.basic_tx;

      const speeds = Object.keys(gasPricesData) as Array<
        keyof typeof gasPricesData
      >;

      const calculateGasFee = speeds.map(speed => {
        const nativeTokenSymbol = getConstantByNetwork(
          'nativeTokenSymbol',
          network
        );

        const fee = gasLimit * (gasPricesData[speed].amount as number); // value in GWEI

        const valueInEth = convertRawAmountToBalance(fee, {
          decimals: nativeTokenDecimals,
          symbol: nativeTokenSymbol,
        });

        return {
          native: convertAmountAndPriceToNativeDisplay(
            valueInEth.amount,
            nativeToken.price,
            nativeCurrency,
            2
          ),
          value: valueInEth,
        };
      });

      const mapSpeedsToValues = Object.fromEntries(
        speeds.map((key, index) => [key, calculateGasFee[index]])
      );

      setTxFees(mapSpeedsToValues);
    },
    [network, nativeCurrency, gasPricesData, nativeToken]
  );

  const hasSufficientForGas = useMemo(() => {
    const txFeeAmount = fromWei(txFees?.[selectedGasSpeed].value.amount || 0);

    return greaterThanOrEqualTo(nativeToken.balance.amount, txFeeAmount);
  }, [txFees, selectedGasSpeed, nativeToken]);

  /**
   * ActionSheet with the different speed options.
   * Shows the value in the user's native currency
   */
  const showTransactionSpeedActionSheet = useCallback(() => {
    if (!txFees) {
      return;
    }

    const options = Object.keys(txFees).map(
      speed => `${speed.toUpperCase()}: ${txFees[speed].native.display}`
    );

    showActionSheetWithOptions(
      {
        cancelButtonIndex: options.length,
        options: [...options, 'Cancel'],
      },
      (buttonIndex: number) => {
        // let's trigger this only if it's not the cancel button
        if (buttonIndex !== options.length) {
          const gasSpeed = Object.keys(txFees)[
            buttonIndex
          ] as keyof GasPricesQueryResults;

          setSelectedGasSpeed(gasSpeed);
        }
      }
    );
  }, [txFees]);

  return {
    getTxFees,
    selectedFee: txFees?.[selectedGasSpeed],
    setSelectedGasSpeed,
    selectedGasSpeed,
    hasSufficientForGas,
    showTransactionSpeedActionSheet,
  };
};
