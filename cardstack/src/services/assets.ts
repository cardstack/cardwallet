import {
  convertAmountToBalanceDisplay,
  convertRawAmountToDecimalFormat,
  getSDK,
} from '@cardstack/cardpay-sdk';

import Web3Instance from '@cardstack/models/web3-instance';
import { isNativeToken } from '@cardstack/utils';
import { Asset } from '@rainbow-me/entities';
import { Network } from '@rainbow-me/helpers/networkTypes';
import logger from 'logger';

interface GetAssetBalanceParams {
  asset: Asset;
  accountAddress: string;
  network: Network;
}

export const getOnChainAssetBalance = async (params: GetAssetBalanceParams) =>
  isNativeToken(params.asset.symbol, params.network)
    ? getOnChainNativeTokenBalance(params)
    : getOnChainTokenBalance(params);

const getOnChainTokenBalance = async ({
  asset: { address, decimals, symbol },
  accountAddress,
}: GetAssetBalanceParams) => {
  try {
    const web3 = await Web3Instance.get();
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
    };
  } catch (e) {
    logger.sentry('Error getOnChainTokenBalance, symbol:', symbol, e);

    return { amount: '0', display: '' };
  }
};

export const getOnChainNativeTokenBalance = async ({
  asset: { decimals, symbol },
  accountAddress,
}: GetAssetBalanceParams) => {
  try {
    const web3 = await Web3Instance.get();
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
    };
  } catch (e) {
    logger.sentry('Error getOnChainNativeTokenBalance,symbol:', symbol, e);

    return { amount: '0', display: '' };
  }
};
