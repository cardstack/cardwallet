import { getSDK } from '@cardstack/cardpay-sdk';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import Web3Instance from '@cardstack/models/web3-instance';
import { TokenType } from '@cardstack/types';

import {
  ClaimRevenueQueryParams,
  CreateProfileQueryParams,
} from './merchant-types';

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
    await revenuePool.claim(
      merchantSafeAddress,
      token.tokenAddress,
      undefined,
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
  accountAddress,
}: CreateProfileQueryParams) => {
  const web3 = await Web3Instance.get({
    walletId: selectedWallet.id,
    network,
  });

  const revenuePool = await getSDK('RevenuePool', web3);

  const newProfile = await revenuePool.registerMerchant(
    selectedPrepaidCardAddress,
    profileDID,
    undefined,
    { from: accountAddress }
  );

  return newProfile.merchantSafe;
};
