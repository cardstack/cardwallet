import { getSDK } from '@cardstack/cardpay-sdk';

import { getWeb3ProviderWithEthSigner } from '@cardstack/models/ethers-wallet';
import { TokenType } from '@cardstack/types';

import {
  ClaimRevenueQueryParams,
  CreateProfileQueryParams,
} from './merchant-types';

// Mutations

export const claimMerchantRevenue = async ({
  accountAddress,
  revenueBalances,
  merchantSafeAddress,
}: ClaimRevenueQueryParams) => {
  const [web3, signer] = await getWeb3ProviderWithEthSigner({ accountAddress });

  const revenuePool = await getSDK('RevenuePool', web3, signer);

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
  selectedPrepaidCardAddress,
  profileDID,
  accountAddress,
}: CreateProfileQueryParams) => {
  const [web3, signer] = await getWeb3ProviderWithEthSigner({ accountAddress });

  const revenuePool = await getSDK('RevenuePool', web3, signer);

  const newProfile = await revenuePool.registerMerchant(
    selectedPrepaidCardAddress,
    profileDID,
    undefined,
    { from: accountAddress }
  );

  return newProfile.merchantSafe;
};
