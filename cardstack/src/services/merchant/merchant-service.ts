import { getSDK } from '@cardstack/cardpay-sdk';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { getWeb3ProviderWithEthSigner } from '@cardstack/models/ethers-wallet';
import { TokenType } from '@cardstack/types';

import {
  ClaimRevenueQueryParams,
  CreateProfileQueryParams,
} from './merchant-types';

// Mutations

export const claimMerchantRevenue = async ({
  signerParams,
  accountAddress,
  revenueBalances,
  merchantSafeAddress,
}: ClaimRevenueQueryParams) => {
  const [web3, signer] = await getWeb3ProviderWithEthSigner(signerParams);

  const revenuePool = await getSDK('RevenuePool', web3, signer);

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
  signerParams,
  selectedPrepaidCardAddress,
  profileDID,
  accountAddress,
}: CreateProfileQueryParams) => {
  const [web3, signer] = await getWeb3ProviderWithEthSigner(signerParams);

  const revenuePool = await getSDK('RevenuePool', web3, signer);

  const newProfile = await revenuePool.registerMerchant(
    selectedPrepaidCardAddress,
    profileDID,
    undefined,
    { from: accountAddress }
  );

  return newProfile.merchantSafe;
};
