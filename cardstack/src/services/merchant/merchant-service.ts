import { getSDK } from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import {
  ClaimRevenueQueryParams,
  CreateProfileQueryParams,
} from './merchant-types';
import { TokenType } from '@cardstack/types';
import Web3Instance from '@cardstack/models/web3-instance';

// Mutations

export const claimMerchantRevenue = async ({
  selectedWallet,
  network,
  accountAddress,
  revenueBalances,
  merchantSafeAddress,
}: ClaimRevenueQueryParams) => {
  const web3 = await Web3Instance.get({
    walletId: selectedWallet.id,
    network,
  });

  const revenuePool = await getSDK('RevenuePool', web3);

  const promises = revenueBalances.map(async (token: TokenType) => {
    // divide amount by 2 for estimate since we can't estimate the full amount
    // and the amount doesn't affect the gas price
    const claimEstimateAmount = Web3.utils.toWei(
      new BigNumber(token.balance.amount).div(new BigNumber('2')).toString()
    );

    const gasEstimate = await revenuePool.claimGasEstimate(
      merchantSafeAddress,
      token.tokenAddress,
      claimEstimateAmount
    );

    const claimAmount = new BigNumber(Web3.utils.toWei(token.balance.amount))
      .minus(new BigNumber(gasEstimate))
      .toString();

    await revenuePool.claim(
      merchantSafeAddress,
      token.tokenAddress,
      claimAmount,
      undefined,
      { from: accountAddress }
    );
  });

  await Promise.all(promises);
};

export const createProfile = async ({
  selectedWallet,
  network,
  selectedPrepaidCardAddress,
  profileDID,
}: CreateProfileQueryParams) => {
  const web3 = await Web3Instance.get({
    walletId: selectedWallet.id,
    network,
  });

  const revenuePool = await getSDK('RevenuePool', web3);

  const newProfile = await revenuePool.registerMerchant(
    selectedPrepaidCardAddress,
    profileDID
  );

  return newProfile.merchantSafe;
};
