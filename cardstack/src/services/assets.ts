import {
  convertAmountToBalanceDisplay,
  convertRawAmountToDecimalFormat,
  getSDK,
} from '@cardstack/cardpay-sdk';

import Web3Instance from '@cardstack/models/web3-instance';
import { NetworkType } from '@cardstack/types';
import { isNativeToken } from '@cardstack/utils';

import { Asset } from '@rainbow-me/entities';
import logger from 'logger';

interface GetAssetBalanceParams {
  asset: Omit<Asset, 'name'>;
  accountAddress: string;
  network: NetworkType;
}

export const getOnChainAssetBalance = async (params: GetAssetBalanceParams) =>
  isNativeToken(params.asset.symbol, params.network)
    ? getOnChainNativeTokenBalance(params)
    : getOnChainTokenBalance(params);

const getOnChainTokenBalance = async ({
  asset: { address, decimals, symbol },
  accountAddress,
  network,
}: GetAssetBalanceParams) => {
  try {
    const web3 = await Web3Instance.withNetwork(network);
    const assets = await getSDK('Assets', web3);
    const balance = await assets.getBalanceForToken(address, accountAddress);

    const tokenBalance = convertRawAmountToDecimalFormat(
      balance.toString(),
      decimals
    );

    const displayBalance = convertAmountToBalanceDisplay(tokenBalance, {
      decimals,
      symbol,
    });

    return {
      amount: tokenBalance,
      display: displayBalance,
      wei: balance,
    };
  } catch (e) {
    logger.sentry('Error getOnChainTokenBalance, symbol:', symbol, e);

    return { amount: '0', display: `0 ${symbol}`, wei: '0' };
  }
};

const getOnChainNativeTokenBalance = async ({
  asset: { decimals, symbol },
  accountAddress,
  network,
}: GetAssetBalanceParams) => {
  try {
    const web3 = await Web3Instance.withNetwork(network);
    const assets = await getSDK('Assets', web3);
    const balance = await assets.getNativeTokenBalance(accountAddress);

    const tokenBalance = convertRawAmountToDecimalFormat(
      balance.toString(),
      decimals
    );

    const displayBalance = convertAmountToBalanceDisplay(tokenBalance, {
      decimals,
      symbol,
    });

    return {
      amount: tokenBalance,
      display: displayBalance,
      wei: balance,
    };
  } catch (e) {
    logger.sentry('Error getOnChainNativeTokenBalance,symbol:', symbol, e);

    return { amount: '0', display: `0 ${symbol}`, wei: '0' };
  }
};
