import {
  convertAmountAndPriceToNativeDisplay,
  convertRawAmountToBalance,
  fromWei,
  getConstantByNetwork,
  greaterThanOrEqualTo,
  multiply,
} from '@cardstack/cardpay-sdk';
import { useCallback, useMemo, useState } from 'react';

import { useGetGasPricesQuery } from '@cardstack/services';
import { GasPricesQueryResults } from '@cardstack/services/hub/gas-prices/gas-prices-types';
import { capitalizeFirstLetter } from '@cardstack/utils';

import { estimateGasLimit } from '@rainbow-me/handlers/web3';
import { useAccountSettings } from '@rainbow-me/hooks';
import { ethUnits } from '@rainbow-me/references';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

import { useAssets } from '../assets/useAssets';

import { ParseTxFeeParams, TxFee } from './types';

const GAS_PRICE_POLLING_INTERVAL = 10000; // 10s

export const useGas = () => {
  const { nativeCurrency, network, accountAddress } = useAccountSettings();

  const { getAssetBalance, getAssetPrice, getAsset } = useAssets();

  const [txFees, setTxFees] = useState<TxFee>();

  const [selectedGasSpeed, setSelectedGasSpeed] = useState<
    keyof GasPricesQueryResults
  >('standard');

  const { data: gasPricesData } = useGetGasPricesQuery(
    { chainId: getConstantByNetwork('chainId', network) },
    { pollingInterval: GAS_PRICE_POLLING_INTERVAL }
  );

  const nativeToken = useMemo(() => {
    const address = getConstantByNetwork('nativeTokenAddress', network);

    return {
      price: getAssetPrice(address),
      balance: getAssetBalance(address),
      ...getAsset(address),
    };
  }, [network, getAssetPrice, getAssetBalance, getAsset]);

  const parseTxFees = useCallback(
    ({ gasLimit: updatedGasLimit }: ParseTxFeeParams) => {
      if (!gasPricesData) {
        return;
      }

      const gasLimit = updatedGasLimit ?? ethUnits.basic_tx;

      const mapGasPriceToSpeeds = Object.entries(gasPricesData).reduce(
        (speeds, [speed, gasPrice]) => {
          const fee = multiply(gasLimit, Number(gasPrice));

          const valueInNativeToken = convertRawAmountToBalance(fee, {
            decimals: nativeToken.decimals ?? 18,
            symbol: nativeToken.symbol,
          });

          return {
            ...speeds,
            [speed]: {
              native: convertAmountAndPriceToNativeDisplay(
                valueInNativeToken.amount,
                nativeToken.price,
                nativeCurrency,
                2
              ),
              value: valueInNativeToken,
              gasPrice,
            },
          };
        },
        {}
      );

      setTxFees(mapGasPriceToSpeeds);
    },
    [nativeCurrency, gasPricesData, nativeToken]
  );

  const updateTxFees = useCallback(
    async ({ asset, amount, recipient }) => {
      const gasLimit = await estimateGasLimit(
        {
          address: accountAddress,
          amount,
          asset,
          recipient,
        },
        network,
        true
      );

      parseTxFees({ gasLimit });

      return gasLimit;
    },
    [network, accountAddress, parseTxFees]
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
      speed =>
        `${capitalizeFirstLetter(speed)}: ${txFees[speed].native.display}`
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
    updateTxFees,
    selectedFee: txFees?.[selectedGasSpeed],
    setSelectedGasSpeed,
    selectedGasSpeed,
    hasSufficientForGas,
    showTransactionSpeedActionSheet,
  };
};
