/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { Network } from '@rainbow-me/helpers/networkTypes';
import logger from 'logger';

let provider: WebsocketProvider | null = null;

const Web3WsProvider = {
  get: async (network?: Network) => {
    if (provider === null || network) {
      try {
        const currentNetwork = await getNetwork();
        const node = getConstantByNetwork('rpcWssNode', currentNetwork);

        provider = new Web3.providers.WebsocketProvider(node, {
          timeout: 30000,
          reconnect: {
            auto: true,
            delay: 1000,
            maxAttempts: 10,
          },
          clientConfig: {
            keepalive: true,
            keepaliveInterval: -1,
          },
        });

        //@ts-ignore it's wrongly typed bc it says it doesn't have param, but it does
        provider.on('error', e => logger.sentry('WS socket error', e));
        //@ts-ignore
        provider.on('end', e => logger.sentry('WS socket ended', e));
      } catch (error) {
        logger.error('provider error', error);
      }
    }

    return provider;
  },
};

Object.freeze(Web3WsProvider);

export default Web3WsProvider;
