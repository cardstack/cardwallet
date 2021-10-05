/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { Network } from '@rainbow-me/helpers/networkTypes';
import logger from 'logger';
import { Navigation } from '@rainbow-me/navigation';
import { MainRoutes } from '@cardstack/navigation/routes';

let provider: WebsocketProvider | null = null;

const Web3WsProvider = {
  get: async (network?: Network) => {
    if (provider === null || network || !provider?.connected) {
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
          keepaliveInterval: 60000,
        },
      });

      //@ts-ignore it's wrongly typed bc it says it doesn't have param, but it does
      provider?.on('error', e => {
        logger.sentry('WS socket error', e);

        // Navigate to error screen to force restart
        Navigation.handleAction(
          MainRoutes.ERROR_FALLBACK_SCREEN,
          { message: 'the web3 socket disconnected' },
          true
        );
      });

      //@ts-ignore
      provider?.on('end', e => {
        provider?.reconnect();
        logger.sentry('WS socket ended', e);
      });

      //@ts-ignore
      provider.on('close', e => {
        logger.sentry('WS socket close', e);
      });
    }

    return provider;
  },
};

export default Web3WsProvider;
