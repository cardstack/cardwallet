import { HDNode } from '@ethersproject/hdnode';
import { Wallet } from '@ethersproject/wallet';

import { DEFAULT_HD_PATH, loadSeedPhrase } from '@rainbow-me/model/wallet';
import logger from 'logger';

import Web3Instance from './web3-instance';

export interface EthersSignerParams {
  accountIndex: number;
  walletId: string;
  seedPhrase?: string;
  keychainAcessAskPrompt?: string;
}

export interface SignerParamsBase {
  signerParams: EthersSignerParams;
}

export const getEthersWallet = async (params?: EthersSignerParams) => {
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

    const hdNode = HDNode.fromMnemonic(seed);

    const derivedNode = hdNode.derivePath(`${DEFAULT_HD_PATH}/${accountIndex}`);

    return new Wallet(derivedNode);
  } catch (e) {
    logger.sentry('Error getting ethersWallet' + e);
  }
};

export const getWeb3ProviderWithEthSigner = (params?: EthersSignerParams) =>
  Promise.all([Web3Instance.get(), getEthersWallet(params)]);
