import { getConstantByNetwork, HubConfig } from '@cardstack/cardpay-sdk';
import { utils, Wallet, providers } from 'ethers';

import { Network } from '@rainbow-me/helpers/networkTypes';
import { isValidSeedPhrase } from '@rainbow-me/helpers/validators';
import {
  DEFAULT_HD_PATH,
  loadPrivateKey,
  loadSeedPhrase,
  EthereumWalletFromSeed,
} from '@rainbow-me/model/wallet';
import { ethereumUtils, sanitizeSeedPhrase } from '@rainbow-me/utils';
import logger from 'logger';

import Web3Instance from './web3-instance';

export interface EthersSignerWithSeedParams {
  accountIndex: number;
  walletId: string;
  seedPhrase?: string;
  keychainAcessAskPrompt?: string;
}

export interface EthersSignerParams {
  accountAddress?: string;
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

const getEthersWallet = async (accountAddress?: string) => {
  try {
    const privateKey = await loadPrivateKey(accountAddress);

    return new Wallet(privateKey);
  } catch (e) {
    logger.sentry('Error getting ethersWallet' + e);
  }
};

export const getWeb3ProviderWithEthSigner = (params?: EthersSignerParams) =>
  Promise.all([Web3Instance.get(), getEthersWallet(params?.accountAddress)]);

/**
 * deriveWalletFromSeed function derive a eth account from a seed phrase input
 * @param seedPhrase : string
 * @returns Promise<EthereumWalletFromSeed | undefined>
 */
export const deriveWalletFromSeed = async (
  seedPhrase: string
): Promise<EthereumWalletFromSeed | undefined> => {
  if (!seedPhrase || !isValidSeedPhrase(seedPhrase)) return undefined;

  const cleanSeedPhrase = sanitizeSeedPhrase(seedPhrase);

  try {
    const wallet = await ethereumUtils.deriveAccountFromWalletInput(
      cleanSeedPhrase
    );

    return wallet;
  } catch (error) {
    logger.log('Error deriving account from seed phrase', error);
  }
};
