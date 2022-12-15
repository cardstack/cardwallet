import {
  convertAmountAndPriceToNativeDisplay,
  convertHexToString,
  convertRawAmountToDecimalFormat,
  fromWei,
} from '@cardstack/cardpay-sdk';
import { convertHexToUtf8 } from '@walletconnect/legacy-utils';
import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import { get, isNil } from 'lodash';

import { ethUnits } from '@rainbow-me/references';
import smartContractMethods from '@rainbow-me/references/smartcontract-methods.json';
import { ethereumUtils } from '@rainbow-me/utils';
import {
  PERSONAL_SIGN,
  SEND_TRANSACTION,
  SIGN,
  SIGN_TRANSACTION,
  SIGN_TYPED_DATA,
} from '@rainbow-me/utils/signingMethods';

interface GetTransactionDisplayDetailsResult {
  request: {
    asset: any;
    from: any;
    to: any;
    data?: any;
    gasLimit?: any;
    gasPrice?: any;
    nativeAmount?: any;
    nativeAmountDisplay?: any;
    value: any;
    nonce?: number;
  };
  timestampInMs: number;
}

interface GetMessageDisplayDetailsResult {
  request: any;
  timestampInMs: number;
}

const getMessageDisplayDetails = (
  message: any,
  timestampInMs: number
): GetMessageDisplayDetailsResult => ({
  request: message,
  timestampInMs,
});

const getTransactionDisplayDetails = (
  transaction: any,
  assets: any[],
  nativeCurrency: string,
  timestampInMs: number
): GetTransactionDisplayDetailsResult | Record<string, never> => {
  const tokenTransferHash = smartContractMethods.token_transfer.hash;

  if (transaction.data === '0x') {
    const value = fromWei(convertHexToString(transaction.value));
    const asset = ethereumUtils.getNativeTokenAsset(assets);
    // TODO: handle price
    const priceUnit = get(asset, 'price.value', 0);

    const { amount, display } = convertAmountAndPriceToNativeDisplay(
      value,
      priceUnit,
      nativeCurrency
    );

    return {
      request: {
        asset,
        from: transaction.from,
        gasLimit: new BigNumber(convertHexToString(transaction.gasLimit)),
        gasPrice: new BigNumber(convertHexToString(transaction.gasPrice)),
        nativeAmount: amount,
        nativeAmountDisplay: display,
        to: transaction.to,
        value,
        ...(!isNil(transaction.nonce)
          ? { nonce: Number(convertHexToString(transaction.nonce)) }
          : {}),
      },
      timestampInMs,
    };
  }

  if (transaction.data.startsWith(tokenTransferHash)) {
    const contractAddress = transaction.to;
    const asset = ethereumUtils.getAsset(assets, contractAddress);
    const dataPayload = transaction.data.replace(tokenTransferHash, '');
    const toAddress = `0x${dataPayload.slice(0, 64).replace(/^0+/, '')}`;
    const amount = `0x${dataPayload.slice(64, 128).replace(/^0+/, '')}`;

    const value = convertRawAmountToDecimalFormat(
      convertHexToString(amount),
      asset.decimals
    );

    // TODO: handle price
    const priceUnit = get(asset, 'price.value', 0);

    const native = convertAmountAndPriceToNativeDisplay(
      value,
      priceUnit,
      nativeCurrency
    );

    return {
      request: {
        asset,
        from: transaction.from,
        gasLimit: new BigNumber(convertHexToString(transaction.gasLimit)),
        gasPrice: new BigNumber(convertHexToString(transaction.gasPrice)),
        nativeAmount: native.amount,
        nativeAmountDisplay: native.display,
        ...(!isNil(transaction.nonce)
          ? { nonce: Number(convertHexToString(transaction.nonce)) }
          : {}),
        to: toAddress,
        value,
      },
      timestampInMs,
    };
  }

  if (transaction.data) {
    // If it's not a token transfer, let's assume it's an ETH transaction
    // Once it confirmed, zerion will show the correct data
    const asset = ethereumUtils.getNativeTokenAsset(assets);

    const value = transaction.value
      ? fromWei(convertHexToString(transaction.value))
      : 0;

    return {
      request: {
        asset: asset.symbol,
        value,
        to: transaction.to,
        data: transaction.data,
        from: transaction.from,
        ...(!isNil(transaction.gasLimit)
          ? {
              gasLimit: new BigNumber(convertHexToString(transaction.gasLimit)),
            }
          : {}),
        ...(!isNil(transaction.gasPrice)
          ? {
              gasPrice: new BigNumber(convertHexToString(transaction.gasPrice)),
            }
          : {}),
        ...(!isNil(transaction.nonce)
          ? { nonce: Number(convertHexToString(transaction.nonce)) }
          : {}),
      },
      timestampInMs,
    };
  }

  return {};
};

const getTimestampFromPayload = (payload: any): number =>
  parseInt(payload.id.toString().slice(0, -3), 10);

export const getRequestDisplayDetails = (
  payload: any,
  assets: any[],
  nativeCurrency: string
) => {
  let timestampInMs = Date.now();

  if (payload.id) {
    timestampInMs = getTimestampFromPayload(payload);
  }

  if (
    payload.method === SEND_TRANSACTION ||
    payload.method === SIGN_TRANSACTION
  ) {
    const transaction = get(payload, 'params[0]', null);

    // Backwards compatibility with param name change
    if (transaction.gas && !transaction.gasLimit) {
      transaction.gasLimit = transaction.gas;
    }

    // We must pass a number through the bridge
    if (!transaction.gasLimit) {
      transaction.gasLimit = ethUnits.basic_tx;
    }

    // Fallback for dapps sending no data
    if (!transaction.data) {
      transaction.data = '0x';
    }

    return getTransactionDisplayDetails(
      transaction,
      assets,
      nativeCurrency,
      timestampInMs
    );
  }

  if (payload.method === SIGN) {
    const message = get(payload, 'params[1]');
    return getMessageDisplayDetails(message, timestampInMs);
  }

  if (payload.method === PERSONAL_SIGN) {
    let message = get(payload, 'params[0]');

    try {
      if (utils.isHexString(message)) {
        message = convertHexToUtf8(message);
      }
    } catch (error) {
      // TODO error handling
    }

    return getMessageDisplayDetails(message, timestampInMs);
  }

  // There's a lot of inconsistency in the parameter order for this method
  // due to changing EIP-712 spec
  // (eth_signTypedData => eth_signTypedData_v3 => eth_signTypedData_v4)
  // Aside from expecting the address as the first parameter
  // and data as the second one it's safer to verify that
  // and switch order if needed to ensure max compatibility with dapps
  if (payload.method === SIGN_TYPED_DATA) {
    if (payload.params.length && payload.params[0]) {
      let data = get(payload, 'params[0]', null);

      if (ethereumUtils.isEthAddress(get(payload, 'params[0]', ''))) {
        data = get(payload, 'params[1]', null);
      }

      return getMessageDisplayDetails(data, timestampInMs);
    }
  }

  return {};
};
