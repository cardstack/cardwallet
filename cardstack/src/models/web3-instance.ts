import { ethers } from 'ethers';
import { ExternalProvider } from 'ethers/node_modules/@ethersproject/providers';
import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';

import { NetworkType } from '@cardstack/types';

import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import logger from 'logger';

import Web3WsProvider from './web3-provider';

const web3Instance: Web3 = new Web3();

let ethersWeb3Instance: ethers.providers.Web3Provider | null = null;

const Web3Instance = {
  get: async () => {
    const isProviderDisconnected = !(web3Instance.currentProvider as WebsocketProvider)
      ?.connected;

    try {
      if (web3Instance.currentProvider === null || isProviderDisconnected) {
        const network = await getNetwork();

        web3Instance.setProvider(await Web3WsProvider.get(network));
      }
    } catch (e) {
      logger.log('Failed while getting web3Instance', e);
    }

    return web3Instance;
  },
  // Separated instance with custom network for wc requests
  withNetwork: async (network: NetworkType) =>
    new Web3(await Web3WsProvider.get(network)),
  getEthers: async (network?: NetworkType) => {
    if (!ethersWeb3Instance) {
      try {
        const currentNetwork = network || (await getNetwork());

        const provider = ((await Web3WsProvider.get(
          currentNetwork
        )) as unknown) as ExternalProvider;

        ethersWeb3Instance = new ethers.providers.Web3Provider(provider);

        await ethersWeb3Instance?._ready();

        logger.log('[Web3-Ethers]: ready!');
      } catch (e) {
        logger.error('[Web3-Ethers]: Failed getting provider', e);
      }
    }

    return ethersWeb3Instance as ethers.providers.Provider;
  },
};

export default Web3Instance;
