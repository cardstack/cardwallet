import {
  convertAmountAndPriceToNativeDisplay,
  convertHexToString,
  convertRawAmountToDecimalFormat,
  fromWei,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import { convertHexToUtf8 } from '@walletconnect/legacy-utils';
import BigNumber from 'bignumber.js';
import { utils } from 'ethers';

import { coingeckoApiEndpoints } from '@cardstack/services/eoa-assets/coingecko/coingecko-api';
import { eoaAssetsApiEndpoints } from '@cardstack/services/eoa-assets/eoa-assets-api';
import { getNativeTokenInfo } from '@cardstack/services/eoa-assets/eoa-assets-services';

import store from '@rainbow-me/redux/store';
import { ethUnits } from '@rainbow-me/references';
import smartContractMethods from '@rainbow-me/references/smartcontract-methods.json';
import { ethereumUtils } from '@rainbow-me/utils';
import {
  isSignFirstParamType,
  isSignSecondParamType,
  isSignTypedData,
  isTransactionDisplayType,
} from '@rainbow-me/utils/signingMethods';
import logger from 'logger';

import { NetworkType } from '../types/NetworkType';

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
}

const hexToBigNumber = (value: string) =>
  new BigNumber(convertHexToString(value));

const getTransactionDisplayDetails = async (
  transaction: any = {},
  nativeCurrency: NativeCurrency,
  network: NetworkType
): Promise<GetTransactionDisplayDetailsResult | Record<string, never>> => {
  const { from, to, value, gasLimit, gasPrice, nonce } = transaction;

  const transactionBase = {
    from,
    to,
    value: fromWei(convertHexToString(value || '0x0')),
    ...(gasLimit && {
      gasLimit: hexToBigNumber(gasLimit),
    }),
    ...(gasPrice && {
      gasPrice: hexToBigNumber(gasPrice),
    }),
    ...(nonce && {
      nonce: hexToBigNumber(nonce).toNumber(),
    }),
  };

  const { data: nativeTokenPrice } = await store.dispatch(
    coingeckoApiEndpoints.getNativeTokensPrice.initiate({
      nativeCurrency,
      network,
    })
  );

  const nativeToken = getNativeTokenInfo(network);

  if (transaction.data === '0x') {
    const priceUnit = nativeTokenPrice?.[nativeToken.id] || 0;

    const { amount, display } = convertAmountAndPriceToNativeDisplay(
      transactionBase.value,
      priceUnit,
      nativeCurrency
    );

    return {
      request: {
        ...transactionBase,
        asset: nativeToken,
        nativeAmount: amount,
        nativeAmountDisplay: display,
      },
    };
  }

  const tokenTransferHash = smartContractMethods.token_transfer.hash;

  if (transaction.data.startsWith(tokenTransferHash)) {
    const contractAddress = to;
    const dataPayload = transaction.data.replace(tokenTransferHash, '');
    const toAddress = `0x${dataPayload.slice(0, 64).replace(/^0+/, '')}`;
    const amount = `0x${dataPayload.slice(64, 128).replace(/^0+/, '')}`;

    const { data: price } = await store.dispatch(
      coingeckoApiEndpoints.getAssetsPriceByContract.initiate({
        nativeCurrency,
        network,
        addresses: [contractAddress],
      })
    );

    const { accountAddress } = store.getState().settings;

    const { data } = await store.dispatch(
      eoaAssetsApiEndpoints.getEOAAssets.initiate({
        nativeCurrency,
        network,
        accountAddress,
      })
    );

    const asset = data?.assets?.[contractAddress];

    const tokenValue = convertRawAmountToDecimalFormat(
      convertHexToString(amount),
      asset?.decimals
    );

    const priceUnit = price?.[contractAddress] || 0;

    const native = convertAmountAndPriceToNativeDisplay(
      tokenValue,
      priceUnit,
      nativeCurrency
    );

    return {
      request: {
        ...transactionBase,
        asset: asset,
        nativeAmount: native.amount,
        nativeAmountDisplay: native.display,
        to: toAddress,
        value: tokenValue,
      },
    };
  }

  if (transaction.data) {
    // If it's not a token transfer, let's assume it's an ETH transaction
    return {
      request: {
        ...transactionBase,
        asset: nativeToken.symbol,
        data: transaction.data,
      },
    };
  }

  return transactionBase;
};

const getTimestampFromPayload = (payload: any): number =>
  parseInt(payload.id.toString().slice(0, -3));

export interface DisplayDetailsType {
  request: string | GetTransactionDisplayDetailsResult['request'];
  timestampInMs: number;
}

export const getRequestDisplayDetails = async (
  payload: any,
  nativeCurrency: NativeCurrency,
  network: NetworkType
) => {
  const timestampInMs = payload.id
    ? getTimestampFromPayload(payload)
    : Date.now();

  const displayDetails: DisplayDetailsType = {
    request: '',
    timestampInMs,
  };

  if (isTransactionDisplayType(payload.method)) {
    const transaction = payload?.params?.[0] || null;

    // Backwards compatibility with param name change
    if (!transaction.gasLimit) {
      transaction.gasLimit = transaction.gas || ethUnits.basic_tx;
    }

    // Fallback for dapps sending no data
    if (!transaction.data) {
      transaction.data = '0x';
    }

    const { request } = await getTransactionDisplayDetails(
      transaction,
      nativeCurrency,
      network
    );

    displayDetails.request = request;
  }

  if (isSignSecondParamType(payload.method)) {
    displayDetails.request = payload?.params?.[1];
  }

  if (isSignFirstParamType(payload.method)) {
    let message = payload?.params?.[0];

    try {
      if (utils.isHexString(message)) {
        message = convertHexToUtf8(message);
      }
    } catch (error) {
      logger.log('Personal_sign failed error');
    }

    displayDetails.request = message;
  }

  // There's a lot of inconsistency in the parameter order for this method
  // due to changing EIP-712 spec
  // (eth_signTypedData => eth_signTypedData_v3 => eth_signTypedData_v4)
  // Aside from expecting the address as the first parameter
  // and data as the second one it's safer to verify that
  // and switch order if needed to ensure max compatibility with dapps
  if (isSignTypedData(payload.method) && payload?.params?.length) {
    const messageOrAddress = payload?.params?.[0] || '';

    displayDetails.request = ethereumUtils.isEthAddress(messageOrAddress)
      ? payload?.params?.[1]
      : messageOrAddress;
  }

  return displayDetails;
};
