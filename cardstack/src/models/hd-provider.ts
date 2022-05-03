import HDWalletProvider from 'parity-hdwallet-provider';

import { Network } from '@rainbow-me/helpers/networkTypes';
import { loadSeedPhrase } from '@rainbow-me/model/wallet';
import { ethereumUtils } from '@rainbow-me/utils';
import logger from 'logger';

import Web3Instance from './web3-instance';
import Web3WsProvider from './web3-provider';

// TODO: Remove HDProvider once ethers signer proves to be better
export interface SignedProviderParams {
  walletId: string;
  network: Network;
  seedPhrase?: string;
  keychainAcessAskPrompt?: string;
}

let provider: HDWalletProvider | null = null;

const HDProvider = {
  get: async ({
    walletId,
    network,
    seedPhrase,
    keychainAcessAskPrompt,
  }: SignedProviderParams) => {
    if (provider === null) {
      try {
        // access keychain only when seedPhrase's not provided as an argument
        //(it asks biometric auth/passcode as seedPhrase stored protected in keychain)
        const phrase =
          seedPhrase ||
          (await loadSeedPhrase(walletId, keychainAcessAskPrompt)) ||
          '';

        const chainId = ethereumUtils.getChainIdFromNetwork(network);
        const web3ProviderSdk = await Web3WsProvider.get();

        provider = new HDWalletProvider({
          chainId,
          mnemonic: {
            phrase,
          },
          providerOrUrl: web3ProviderSdk,
        });
      } catch (e) {
        logger.error('Unable to getHdSignedProvider', e);
      }
    }

    return provider;
  },
  // Removes provider from instance and stops it
  reset: async () => {
    try {
      const web3 = await Web3Instance.get();
      web3.setProvider(null);
    } catch (e) {
      logger.log('Failed reseting web3 instance');
    }

    provider?.engine.stop();
    provider = null;
  },
};

export default HDProvider;
