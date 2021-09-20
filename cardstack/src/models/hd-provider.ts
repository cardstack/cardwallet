import HDWalletProvider from 'parity-hdwallet-provider';
import Web3WsProvider from './web3-provider';
import Web3Instance from './web3-instance';
import { getSeedPhrase, RainbowWallet } from '@rainbow-me/model/wallet';
import logger from 'logger';
import { ethereumUtils } from '@rainbow-me/utils';
import { Network } from '@rainbow-me/helpers/networkTypes';

export interface SignedProviderParams {
  selectedWallet: RainbowWallet;
  network: Network;
}

let provider: HDWalletProvider | null = null;

const HDProvider = {
  get: async ({ selectedWallet, network }: SignedProviderParams) => {
    if (provider === null) {
      try {
        const seedPhrase = await getSeedPhrase(selectedWallet.id);
        const chainId = ethereumUtils.getChainIdFromNetwork(network);
        const web3ProviderSdk = await Web3WsProvider.get();

        const hdProvider = new HDWalletProvider({
          chainId,
          mnemonic: {
            phrase: seedPhrase?.seedphrase || '',
          },
          providerOrUrl: web3ProviderSdk,
        });

        provider = hdProvider;
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

Object.freeze(HDProvider);

export default HDProvider;
