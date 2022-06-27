import {
  fromWei,
  getSDK,
  Proof,
  Safe,
  TokenInfo,
  WithSymbol,
} from '@cardstack/cardpay-sdk';
import BN from 'bn.js';

import { getSafesInstance } from '@cardstack/models';
import {
  EthersSignerParams,
  getWeb3ProviderWithEthSigner,
} from '@cardstack/models/ethers-wallet';

import { convertTokenToSpend } from '../exchange-rate-service';
import {
  addNativePriceToToken,
  updateSafeWithTokenPrices,
} from '../gnosis-service';

import {
  RegisterGasEstimateQueryParams,
  RewardsClaimGasEstimateParams,
  RewardsClaimMutationParams,
  RewardsRegisterMutationParams,
  RewardsSafeQueryParams,
  RewardsSafeType,
  RewardWithdrawGasEstimateParams,
  RewardWithdrawParams,
  ValidProofsParams,
} from './rewards-center-types';

const getRewardsPoolInstance = async (signedParams?: EthersSignerParams) => {
  const [web3, signer] = await getWeb3ProviderWithEthSigner(signedParams);

  const rewardPoolInstance = await getSDK('RewardPool', web3, signer);

  return rewardPoolInstance;
};

const getRewardManagerInstance = async (signedParams?: EthersSignerParams) => {
  const [web3, signer] = await getWeb3ProviderWithEthSigner(signedParams);

  const rewardManagerInstance = await getSDK('RewardManager', web3, signer);

  return rewardManagerInstance;
};

let cachedValidProofs: WithSymbol<Proof>[] | null = null;

const getValidProofs = async ({
  tokenAddress,
  rewardProgramId,
  accountAddress,
}: ValidProofsParams) => {
  if (cachedValidProofs) {
    return cachedValidProofs;
  }

  const rewardPoolInstance = await getRewardsPoolInstance();

  const proofs = await rewardPoolInstance.getProofs(
    accountAddress,
    rewardProgramId,
    tokenAddress,
    false
  );

  const validProofs = proofs.filter(({ isValid }) => isValid);

  cachedValidProofs = validProofs;

  return validProofs;
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

export const getClaimRewardsGasEstimate = async ({
  safeAddress,
  tokenAddress,
  rewardProgramId,
  accountAddress,
}: RewardsClaimGasEstimateParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance();

  const validProofs = await getValidProofs({
    accountAddress,
    rewardProgramId,
    tokenAddress,
  });

  const estimatedAmounts = await Promise.all(
    validProofs?.map(async ({ leaf, proofArray }) => {
      const { amount } = await rewardPoolInstance.claimGasEstimate(
        safeAddress,
        leaf,
        proofArray,
        false
      );

      return new BN(amount);
    })
  );

  const totalEstimatedGas = estimatedAmounts.reduce(
    (total, amount) => total.add(amount),
    new BN(0)
  );

  const totalEstimatedGasInEth = fromWei(totalEstimatedGas.toString());

  const formattedTotalEstimatedGas = parseFloat(totalEstimatedGasInEth).toFixed(
    2
  );

  return formattedTotalEstimatedGas;
};

export const getWithdrawGasEstimate = async ({
  from,
  to,
  tokenAddress,
  amount = '0',
}: RewardWithdrawGasEstimateParams) => {
  const rewardManager = await getRewardManagerInstance();

  const gasEstimate = await rewardManager.withdrawGasEstimate(
    from,
    to,
    tokenAddress,
    amount
  );

  return gasEstimate.amount;
};

// Mutations

export const registerToRewardProgram = async ({
  prepaidCardAddress,
  rewardProgramId,
  accountAddress,
}: RewardsRegisterMutationParams) => {
  const rewardManager = await getRewardManagerInstance({ accountAddress });

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
}: RewardsClaimMutationParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance({ accountAddress });

  const validProofs = await getValidProofs({
    accountAddress,
    rewardProgramId,
    tokenAddress,
  });

  const receipts = [];

  // Needs to be sequential, promise.all won't work
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

  cachedValidProofs = null;

  return receipts;
};

export const withdrawFromRewardSafe = async ({
  from,
  to,
  tokenAddress,
  amount,
  accountAddress,
}: RewardWithdrawParams) => {
  const rewardManager = await getRewardManagerInstance({ accountAddress });

  const result = await rewardManager.withdraw(
    from,
    to,
    tokenAddress,
    amount,
    undefined,
    { from: accountAddress }
  );

  return result;
};
