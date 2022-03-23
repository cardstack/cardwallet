import { getSDK, Safe, TokenInfo } from '@cardstack/cardpay-sdk';
import {
  addNativePriceToToken,
  updateSafeWithTokenPrices,
} from '../gnosis-service';
import {
  RewardsClaimMutationParams,
  RewardsRegisterMutationParams,
  RewardsSafeQueryParams,
  RewardsSafeType,
} from './rewards-center-types';
import { getSafesInstance } from '@cardstack/models';
import Web3Instance from '@cardstack/models/web3-instance';
import { SignedProviderParams } from '@cardstack/models/hd-provider';

const getRewardsPoolInstance = async (signedParams?: SignedProviderParams) => {
  const web3 = await Web3Instance.get(signedParams);

  const rewardPoolInstance = await getSDK('RewardPool', web3);

  return rewardPoolInstance;
};

// Queries

export const fetchRewardsSafe = async ({
  accountAddress,
  nativeCurrency,
}: RewardsSafeQueryParams) => {
  const safesInstance = await getSafesInstance();

  const rewardSafes: Safe[] =
    (
      await safesInstance?.view(accountAddress, {
        type: 'reward',
      })
    )?.safes || [];

  const extendedRewardSafes = await Promise.all(
    rewardSafes?.map(
      async safe =>
        (updateSafeWithTokenPrices(
          safe,
          nativeCurrency
        ) as unknown) as RewardsSafeType
    )
  );

  return {
    rewardSafes: extendedRewardSafes,
  };
};

export const fetchRewardPoolTokenBalances = async ({
  accountAddress,
  nativeCurrency,
}: RewardsSafeQueryParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance();

  const rewardTokens = await rewardPoolInstance.rewardTokenBalances(
    accountAddress
  );

  const rewardTokensWithPrice = await Promise.all(
    rewardTokens?.map(
      async ({
        tokenSymbol: symbol,
        balance,
        tokenAddress,
        rewardProgramId,
      }) => {
        const tokenWithPrice = await addNativePriceToToken(
          ({
            token: { symbol },
            balance,
          } as unknown) as TokenInfo,
          nativeCurrency
        );

        return { ...tokenWithPrice, tokenAddress, rewardProgramId };
      }
    )
  );

  return {
    rewardPoolTokenBalances: rewardTokensWithPrice,
  };
};

// Mutations

export const registerToRewardProgram = async ({
  prepaidCardAddress,
  rewardProgramId,
  accountAddress,
  walletId,
  network,
}: RewardsRegisterMutationParams) => {
  const web3 = await Web3Instance.get({ walletId, network });

  const rewardManager = await getSDK('RewardManager', web3);

  const result = await rewardManager.registerRewardee(
    prepaidCardAddress,
    rewardProgramId,
    undefined,
    { from: accountAddress }
  );

  return result;
};

export const claimRewards = async ({
  safeAddress,
  tokenAddress,
  rewardProgramId,
  accountAddress,
  walletId,
  network,
}: RewardsClaimMutationParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance({
    walletId,
    network,
  });

  const proofs = await rewardPoolInstance.getProofs(
    accountAddress,
    rewardProgramId,
    tokenAddress,
    false
  );

  const validProofs = proofs.filter(proof => proof.isValid);

  const result = await Promise.all(
    validProofs.map(({ leaf, proofArray }) =>
      rewardPoolInstance.claim(
        safeAddress,
        leaf,
        proofArray,
        false,
        undefined,
        { from: accountAddress }
      )
    )
  );

  return result;
};
