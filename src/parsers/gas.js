import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
  divide,
  getConstantByNetwork,
  multiply,
} from '@cardstack/cardpay-sdk';
import { utils } from 'ethers';
import { get, map, zipObject } from 'lodash';
import { getMinimalTimeUnitStringForMs } from '../helpers/time';
import ethUnits from '../references/ethereum-units.json';
import timeUnits from '../references/time-units.json';
import { gasUtils } from '../utils';

const { GasSpeedOrder } = gasUtils;

export const defaultGasPriceFormat = (option, timeWait, value) => {
  const timeAmount = timeWait ? multiply(timeWait, timeUnits.ms.minute) : null;

  return {
    estimatedTime: {
      amount: timeAmount,
      display: getMinimalTimeUnitStringForMs(timeAmount),
    },
    option,
    value: {
      amount: value,
      display: `${utils.formatUnits(value, 'gwei')} Gwei`,
    },
  };
};

/**
 * @desc parse ether gas prices with updated gas limit
 * @param {Object} data
 * @param {Object} prices
 * @param {Number} gasLimit
 */
export const parseTxFees = (
  gasPrices,
  priceUnit,
  gasLimit,
  nativeCurrency,
  network
) => {
  const txFees = map(GasSpeedOrder, speed => {
    const gasPrice = get(gasPrices, `${speed}.value.amount`);
    return {
      txFee: getTxFee(gasPrice, gasLimit, priceUnit, nativeCurrency, network),
    };
  });
  return zipObject(GasSpeedOrder, txFees);
};

const getTxFee = (gasPrice, gasLimit, priceUnit, nativeCurrency, network) => {
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);
  const amount = multiply(gasPrice, gasLimit);

  return {
    native: {
      value: convertRawAmountToNativeDisplay(
        amount,
        18,
        priceUnit,
        nativeCurrency
      ),
    },
    value: convertRawAmountToBalance(amount, {
      decimals: 18,
      symbol: nativeTokenSymbol,
    }),
  };
};

export const gweiToWei = gweiAmount => {
  const weiAmount = multiply(gweiAmount, ethUnits.gwei);
  return weiAmount;
};

export const weiToGwei = weiAmount => {
  const gweiAmount = divide(weiAmount, ethUnits.gwei);
  return gweiAmount;
};
