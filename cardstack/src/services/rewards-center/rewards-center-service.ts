import { getSDK, Safe, TokenInfo } from '@cardstack/cardpay-sdk';
import BN from 'bn.js';
import {
  addNativePriceToToken,
  updateSafeWithTokenPrices,
} from '../gnosis-service';
import { convertTokenToSpend } from '../exchange-rate-service';
import {
  RegisterGasEstimateQueryParams,
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

const getRewardManagerInstance = async (
  signedParams?: SignedProviderParams
) => {
  const web3 = await Web3Instance.get(signedParams);

  const rewardManagerInstance = await getSDK('RewardManager', web3);

  return rewardManagerInstance;
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

export const getRegisterGasEstimate = async ({
  prepaidCardAddress,
  rewardProgramId,
}: RegisterGasEstimateQueryParams) => {
  const rewardManager = await getRewardManagerInstance();

  const { amount, gasToken } = await rewardManager.registerRewardeeGasEstimate(
    prepaidCardAddress,
    rewardProgramId
  );

  const amountString = new BN(amount).toString();

  const gasEstimateInSpend = await convertTokenToSpend(gasToken, amountString);

  return gasEstimateInSpend;
};

// Mutations

export const registerToRewardProgram = async ({
  prepaidCardAddress,
  rewardProgramId,
  accountAddress,
  walletId,
  network,
}: RewardsRegisterMutationParams) => {
  const rewardManager = await getRewardManagerInstance({ walletId, network });

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

  const receipts = [];

  for (const { leaf, proofArray } of validProofs) {
    const receipt = await rewardPoolInstance.claim(
      safeAddress,
      leaf,
      proofArray,
      false,
      undefined,
      { from: accountAddress }
    );

    receipts.push(receipt);
  }

  return receipts;
};
