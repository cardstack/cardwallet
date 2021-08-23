import {
  convertAmountToBalanceDisplay,
  convertRawAmountToDecimalFormat,
  getSDK,
} from '@cardstack/cardpay-sdk';
import Web3 from 'web3';

import { getWeb3ProviderSdk } from './web3';
import { isNativeToken } from '@cardstack/utils';

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
    const web3 = new Web3(await getWeb3ProviderSdk());
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
    return null;
  }
}

async function getOnchainNativeTokenBalance(
  { address, decimals, symbol },
  userAddress
) {
  try {
    const web3 = new Web3(await getWeb3ProviderSdk());
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
    return null;
  }
}
