import { captureException } from '@sentry/react-native';

import { constants, Contract } from 'ethers';

import { toHex } from '../handlers/web3';
import { loadWallet } from '../model/wallet';
import { ethUnits } from '../references';
import erc20ABI from '../references/erc20-abi.json';
import Web3Instance from '@cardstack/models/web3-instance';
import logger from 'logger';

const estimateApproveWithExchange = async (owner, spender, exchange) => {
  try {
    const gasLimit = await exchange.estimateGas.approve(
      spender,
      constants.MaxUint256,
      {
        from: owner,
      }
    );
    return gasLimit ? gasLimit.toString() : ethUnits.basic_approval;
  } catch (error) {
    logger.sentry('error estimateApproveWithExchange');
    captureException(error);
    return ethUnits.basic_approval;
  }
};

const estimateApprove = async (owner, tokenAddress, spender) => {
  logger.sentry('exchange estimate approve', { owner, spender, tokenAddress });
  const web3Provider = await Web3Instance.getEthers();
  const exchange = new Contract(tokenAddress, erc20ABI, web3Provider);
  return await estimateApproveWithExchange(owner, spender, exchange);
};

const approve = async (
  tokenAddress,
  spender,
  gasLimit,
  gasPrice,
  wallet = null
) => {
  const walletToUse = wallet || (await loadWallet());
  if (!walletToUse) return null;
  const exchange = new Contract(tokenAddress, erc20ABI, walletToUse);
  const approval = await exchange.approve(spender, constants.MaxUint256, {
    gasLimit: toHex(gasLimit) || undefined,
    gasPrice: toHex(gasPrice) || undefined,
  });
  return {
    approval,
    creationTimestamp: Date.now(),
  };
};

const getRawAllowance = async (owner, token, spender) => {
  try {
    const { address: tokenAddress } = token;
    const web3Provider = await Web3Instance.getEthers();
    const tokenContract = new Contract(tokenAddress, erc20ABI, web3Provider);
    const allowance = await tokenContract.allowance(owner, spender);
    return allowance.toString();
  } catch (error) {
    logger.sentry('error getRawAllowance');
    captureException(error);
    return null;
  }
};

export default {
  approve,
  estimateApprove,
  getRawAllowance,
};
