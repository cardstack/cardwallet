import {
  getConstantByNetwork,
  getWeb3ConfigByNetwork,
  HubConfig,
  supportedChainsArray,
} from '@cardstack/cardpay-sdk';
import { ethers } from 'ethers';
import Web3 from 'web3';
import type { WebsocketProvider } from 'web3-core';

import { remoteFlags } from '@cardstack/services/remote-config';
import { NetworkType } from '@cardstack/types';

import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import logger from 'logger';

type NetworksMap = Record<NetworkType, string>;

const networks = supportedChainsArray.reduce(
  (chains, network) => ({ ...chains, [network]: '' }),
  {} as NetworksMap
);

const nodeConfigCache = { current: networks };

const getNodeConfig = async (network: NetworkType) => {
  const currentNode = nodeConfigCache.current[network];

  if (!currentNode) {
    const hubConfig = new HubConfig(getConstantByNetwork('hubUrl', network));

    const shouldUseSokolHttpNode =
      network === NetworkType.sokol && remoteFlags().useHttpSokolNode;

    const hubConfigResponse = await hubConfig.getConfig();

    const { rpcNodeWssUrl } = getWeb3ConfigByNetwork(
      hubConfigResponse,
      network
    );

    const node = shouldUseSokolHttpNode
      ? hubConfigResponse.web3.layer2RpcNodeHttpsUrl
      : rpcNodeWssUrl;

    nodeConfigCache.current = { ...nodeConfigCache.current, [network]: node };

    return node;
  }

  return currentNode;
};

const createProvider = async (network: NetworkType) => {
  const node = await getNodeConfig(network);

  const wssProvider = new Web3.providers.WebsocketProvider(node, {
    timeout: 30000,
    reconnect: {
      auto: true,
      delay: 1000,
      onTimeout: true,
      maxAttempts: 10,
    },
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000,
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000,
    },
  });

  wssProvider?.on('connect', () => {
    logger.sentry('[WS socket] connected', network);
  });

  //@ts-expect-error it's wrongly typed bc it says it doesn't have param, but it does
  wssProvider?.on('error', e => {
    providers[network]?.provider?.reconnect();
    logger.sentry('[WS socket] error', e, network);
  });

  //@ts-expect-error ditto
  wssProvider?.on('end', e => {
    providers[network]?.provider?.reconnect();
    logger.sentry('[WS socket] ended', e);
  });

  //@ts-expect-error ditto
  wssProvider?.on('close', e => {
    providers[network]?.provider?.reconnect();
    logger.sentry('[WS socket] close', e);
  });

  return wssProvider;
};

const providers = supportedChainsArray.reduce(
  (chains, network) => ({
    ...chains,
    [network]: {
      provider: null,
      isConnecting: false,
      ethers: null,
    },
  }),
  {} as Record<
    NetworkType,
    {
      provider: WebsocketProvider;
      isConnecting: boolean;
      ethers: ethers.providers.WebSocketProvider;
    }
  >
);

const checkProviderConnection = (network: NetworkType) =>
  new Promise<WebsocketProvider>(resolve => {
    const current = providers[network];

    const timer = setInterval(() => {
      if (current.provider?.connected) {
        clearInterval(timer);
        current.isConnecting = false;
        resolve(current.provider);
      }
    }, 10);
  });

const Web3WsProvider = {
  get: async (network: NetworkType) => {
    const current = providers[network];

    if (!current.provider?.connected && !current.isConnecting) {
      current.isConnecting = true;

      current.provider = (await createProvider(network)) as any;
    }

    const connectedProvider = await checkProviderConnection(network);

    return connectedProvider;
  },
  getEthers: async (network?: NetworkType) => {
    try {
      const currentNetwork = network || ((await getNetwork()) as NetworkType);

      const current = providers[currentNetwork];

      const node = await getNodeConfig(currentNetwork);

      if (!current.ethers) {
        current.ethers = new ethers.providers.WebSocketProvider(node);

        logger.log('[Ether Ws]: Creating provider', currentNetwork);
      }

      await current.ethers.ready;

      return current.ethers;
    } catch (e) {
      logger.log('[Ethers Ws]: Error setting provider');
    }
  },
};

export default Web3WsProvider;
