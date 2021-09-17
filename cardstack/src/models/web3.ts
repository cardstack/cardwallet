/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { Network } from '@rainbow-me/helpers/networkTypes';
import logger from 'logger';

let web3ProviderSdk: WebsocketProvider | null = null;

/**
 * @desc get current or create web3 provider
 * @param {String} [network]
 */

export const getWeb3ProviderSdk = async (network?: Network) => {
  if (web3ProviderSdk === null || network) {
    try {
      const currentNetwork = await getNetwork();
      const node = getConstantByNetwork('rpcWssNode', currentNetwork);

      web3ProviderSdk = new Web3.providers.WebsocketProvider(node, {
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
      web3ProviderSdk.on('error', e => logger.sentry('WS socket error', e));
      //@ts-ignore
      web3ProviderSdk.on('end', e => logger.sentry('WS socket ended', e));
    } catch (error) {
      logger.error('provider error', error);
    }
  }

  return web3ProviderSdk;
};
