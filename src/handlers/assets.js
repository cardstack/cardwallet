import {
  convertAmountToBalanceDisplay,
  convertRawAmountToDecimalFormat,
  getSDK,
} from '@cardstack/cardpay-sdk';

import Web3Instance from '@cardstack/models/web3-instance';
import { isNativeToken } from '@cardstack/utils';
import logger from 'logger';

export async function getOnchainAssetBalance(
  { address, decimals, symbol },
  userAddress,
  network
) {
  if (isNativeToken(symbol, network)) {
    return getOnchainNativeTokenBalance(
      { address, decimals, symbol },
      userAddress
    );
  }

  return getOnchainTokenBalance({ address, decimals, symbol }, userAddress);
}

async function getOnchainTokenBalance(
  { address, decimals, symbol },
  userAddress
) {
  try {
    const web3 = await Web3Instance.get();
    const assets = await getSDK('Assets', web3);
    const balance = await assets.getBalanceForToken(address, userAddress);
    const tokenBalance = convertRawAmountToDecimalFormat(
      balance.toString(),
      decimals
    );
    const displayBalance = convertAmountToBalanceDisplay(tokenBalance, {
      address,
      decimals,
      symbol,
    });

    return {
      amount: tokenBalance,
      display: displayBalance,
    };
  } catch (e) {
    logger.sentry('Error getOnchainTokenBalance', e);
    return { amount: '0', display: '' };
  }
}

async function getOnchainNativeTokenBalance(
  { address, decimals, symbol },
  userAddress
) {
  try {
    const web3 = await Web3Instance.get();
    const assets = await getSDK('Assets', web3);
    const balance = await assets.getNativeTokenBalance(userAddress);

    const tokenBalance = convertRawAmountToDecimalFormat(
      balance.toString(),
      decimals
    );
    const displayBalance = convertAmountToBalanceDisplay(tokenBalance, {
      address,
      decimals,
      symbol,
    });

    return {
      amount: tokenBalance,
      display: displayBalance,
    };
  } catch (e) {
    logger.sentry('Error getOnchainNativeTokenBalance', e);
    return { amount: '0', display: '' };
  }
}
