import {
  fromWei,
  getSDK,
  Proof,
  Safe,
  TokenInfo,
  WithSymbol,
} from '@cardstack/cardpay-sdk';
import BN from 'bn.js';

import {
  EthersSignerParams,
  getWeb3ProviderWithEthSigner,
} from '@cardstack/models/ethers-wallet';
import { getSafesInstance } from '@cardstack/models/safes-providers';

import { convertTokenToSpend } from '../exchange-rate-service';
import {
  addNativePriceToToken,
  updateSafeWithTokenPrices,
} from '../gnosis-service';
import {
  parseTemplateExplanation,
  parseExplanationAmount,
} from '../utils/reward-explanation';

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
  RewardValidProofsResult,
  RewardProofType,
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
    undefined,
    tokenAddress,
    false
  );

  const validProofs = proofs.filter(({ isValid }) => isValid);

  cachedValidProofs = validProofs;

  return validProofs;
};

const getTokenSymbolForAddress = async (tokenAddress: string) => {
  const rewardPoolInstance = await getRewardsPoolInstance();

  const token = await rewardPoolInstance.addTokenSymbol([{ tokenAddress }]);

  return token?.[0]?.tokenSymbol;
};

// Queries

export const fetchValidProofsWithToken = async ({
  rewardProgramId,
  accountAddress,
  safeAddress,
  nativeCurrency,
}: RewardsSafeQueryParams): Promise<RewardValidProofsResult> => {
  const rewardPoolInstance = await getRewardsPoolInstance();

  const allProofs = await rewardPoolInstance.getUnclaimedValidProofs(
    accountAddress,
    rewardProgramId
  );

  const claimableProofs = safeAddress
    ? await rewardPoolInstance.getUnclaimedValidProofsWithoutDust(
        accountAddress,
        rewardProgramId,
        safeAddress
      )
    : [];

  const allProofsWithNativeCurrency = await Promise.all(
    allProofs?.map(async currentProof => {
      const tokenWithPrice = await addNativePriceToToken(
        ({
          token: { symbol: currentProof.tokenSymbol },
          balance: currentProof.amount,
        } as unknown) as TokenInfo,
        nativeCurrency,
        true
      );

      // Adds data needed for claiming a proof to the general proofs list
      // rootHash is used as a merging ID.
      const claimingInfo =
        claimableProofs.find(
          findProof => findProof.rootHash === proof.rootHash
        ) || ({} as Proof);

      const proof: RewardProofType = {
        ...currentProof,
        ...tokenWithPrice,
        ...claimingInfo,
        isClaimable: !!claimingInfo.rootHash,
      };

      if (proof.explanationData?.token) {
        const tokenSymbol = await getTokenSymbolForAddress(
          proof.explanationData.token
        );

        if (tokenSymbol) {
          proof.explanationData.token = tokenSymbol;
        }
      }

      if (proof.explanationData?.amount) {
        proof.explanationData.amount = parseExplanationAmount(
          proof.explanationData.amount
        );
      }

      if (proof.explanationData?.rollover_amount) {
        proof.explanationData.rollover_amount = parseExplanationAmount(
          proof.explanationData.rollover_amount
        );
      }

      if (proof.explanationData && proof.explanationTemplate) {
        proof.parsedExplanation = parseTemplateExplanation(
          proof.explanationTemplate,
          proof.explanationData
        );
      }

      return proof;
    })
  );

  return allProofsWithNativeCurrency;
};

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
  rewardProgramId,
  safeAddress,
  nativeCurrency,
}: RewardsSafeQueryParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance();

  const rewardTokens = safeAddress
    ? await rewardPoolInstance.rewardTokenBalancesWithoutDust(
        accountAddress,
        rewardProgramId,
        safeAddress
      )
    : await rewardPoolInstance.rewardTokenBalances(
        accountAddress,
        rewardProgramId
      );

  const rewardTokensWithPrice = await Promise.all(
    rewardTokens?.map(
      async ({ tokenSymbol: symbol, balance, tokenAddress }) => {
        const tokenWithPrice = await addNativePriceToToken(
          ({
            token: { symbol },
            balance,
          } as unknown) as TokenInfo,
          nativeCurrency,
          true
        );

        return {
          ...tokenWithPrice,
          tokenAddress,
          rewardProgramId,
        };
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
  rewardsToClaim,
}: RewardsClaimGasEstimateParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance();

  const validProofs =
    rewardsToClaim ||
    (await getValidProofs({
      accountAddress,
      rewardProgramId,
      tokenAddress,
    }));

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

export const getClaimAllRewardsGasEstimate = async ({
  safeAddress,
  tokenAddress,
  rewardProgramId,
}: RewardsClaimGasEstimateParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance();

  const totalEstimatedGas = await rewardPoolInstance.claimAllGasEstimate(
    safeAddress,
    tokenAddress,
    rewardProgramId
  );

  const totalEstimatedGasInEth = fromWei(totalEstimatedGas.amount.toString());

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

export const getRewardProgramExplainer = async (rewardProgramId: string) => {
  const rewardManager = await getRewardManagerInstance();

  const programInfo = await rewardManager.getRewardProgramInfo(rewardProgramId);

  return programInfo.programExplainer;
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
  rewardsToClaim,
}: RewardsClaimMutationParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance({ accountAddress });

  const validProofs =
    rewardsToClaim ||
    (await getValidProofs({
      accountAddress,
      rewardProgramId,
      tokenAddress,
    }));

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

export const claimAllRewards = async ({
  safeAddress,
  tokenAddress,
  rewardProgramId,
  accountAddress,
}: RewardsClaimMutationParams) => {
  const rewardPoolInstance = await getRewardsPoolInstance({ accountAddress });

  const receipts = await rewardPoolInstance.claimAll(
    safeAddress,
    rewardProgramId,
    tokenAddress,
    undefined,
    {
      from: accountAddress,
    }
  );

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
