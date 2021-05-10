import { Assets } from '@cardstack/cardpay-sdk';
import Web3 from 'web3';

import {
  convertAmountToBalanceDisplay,
  convertRawAmountToDecimalFormat,
} from '../helpers/utilities';
import { web3Provider } from './web3';

export async function getOnchainAssetBalance(
  { address, decimals, symbol },
  userAddress
) {
  // we should export a way for us to check if an address is a native token address from the SDK
  if (address === 'eth' || address === 'spoa') {
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
    const web3 = new Web3(web3Provider);
    const assets = new Assets(web3);
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
    const web3 = new Web3(web3Provider);
    const assets = new Assets(web3);
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
