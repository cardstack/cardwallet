import { ethers, utils, Wallet } from 'ethers';

import {
  DEFAULT_HD_PATH,
  loadPrivateKey,
  loadSeedPhrase,
} from '@rainbow-me/model/wallet';
import logger from 'logger';

import { NetworkType } from '../types/NetworkType';

import Web3Instance from './web3-instance';
import Web3WsProvider from './web3-provider';

export interface EthersSignerWithSeedParams {
  accountIndex: number;
  walletId: string;
  seedPhrase?: string;
  keychainAcessAskPrompt?: string;
}

export interface EthersSignerParams {
  accountAddress?: string;
  network?: NetworkType;
}

export const getEthersWalletWithSeed = async (
  params?: EthersSignerWithSeedParams
) => {
  if (!params) {
    return;
  }

  const {
    walletId,
    seedPhrase = '',
    accountIndex = 0,
    keychainAcessAskPrompt = '',
  } = params;

  try {
    const seed =
      seedPhrase ||
      (await loadSeedPhrase(walletId, keychainAcessAskPrompt)) ||
      '';

    const hdNode = utils.HDNode.fromMnemonic(seed);

    const derivedNode = hdNode.derivePath(`${DEFAULT_HD_PATH}/${accountIndex}`);

    return new Wallet(derivedNode);
  } catch (e) {
    logger.sentry('Error getting ethersWallet' + e);
  }
};

export const getEthersWallet = async ({
  accountAddress,
  network,
}: EthersSignerParams = {}) => {
  try {
    const privateKey = await loadPrivateKey(accountAddress);

    const provider = (await Web3WsProvider.getEthers(
      network
    )) as ethers.providers.Provider;

    return new Wallet(privateKey, provider);
  } catch (e) {
    logger.sentry('Error getting ethersWallet' + e);
  }
};

export const getWeb3ProviderWithEthSigner = (params?: EthersSignerParams) =>
  Promise.all([Web3Instance.get(), getEthersWallet(params)]);
