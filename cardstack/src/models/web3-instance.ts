import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';

import logger from 'logger';

import HDProvider, { SignedProviderParams } from './hd-provider';
import Web3WsProvider from './web3-provider';

const web3Instance: Web3 = new Web3();

const Web3Instance = {
  /**
   * Return web3Instance either with a signed provider or not.
   * @param signedProviderParams - info to sign the provider
   *
   * WARNING: After using a signed provider,
   * it's recommended to reset it with `HDProvider.reset()`
   */
  get: async (signedProviderParams?: SignedProviderParams) => {
    const isProviderDisconnected = !(web3Instance.currentProvider as WebsocketProvider)
      ?.connected;

    try {
      if (signedProviderParams) {
        web3Instance.setProvider(await HDProvider.get(signedProviderParams));
      } else if (
        web3Instance.currentProvider === null ||
        isProviderDisconnected
      ) {
        web3Instance.setProvider(await Web3WsProvider.get());
      }
    } catch (e) {
      logger.log('Failed while getting web3Instance', e);
    }

    return web3Instance;
  },
};

export default Web3Instance;
