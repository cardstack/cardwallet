import {
  getConstantByNetwork,
  getWeb3ConfigByNetwork,
  HubConfig,
  supportedChainsArray,
} from '@cardstack/cardpay-sdk';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';

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
    provider?.reconnect();
    logger.sentry('[WS socket] error', e, network);
  });

  //@ts-expect-error ditto
  wssProvider?.on('end', e => {
    provider?.reconnect();
    logger.sentry('[WS socket] ended', e);
  });

  //@ts-expect-error ditto
  wssProvider?.on('close', e => {
    provider?.reconnect();
    logger.sentry('[WS socket] close', e);
  });

  return wssProvider;
};

let provider: WebsocketProvider | null = null;
// Flag to avoid creating multiple instances while connecting
let isConnecting = false;

let ethersProvider: ethers.providers.WebSocketProvider | null = null;
let ethersReady: Promise<ethers.providers.Network>;

const checkProviderConnection = () =>
  new Promise<WebsocketProvider>(resolve => {
    const timer = setInterval(() => {
      if (provider?.connected) {
        clearInterval(timer);
        isConnecting = false;
        resolve(provider);
      }
    }, 10);
  });

const Web3WsProvider = {
  get: async (network: NetworkType) => {
    if (!provider?.connected && !isConnecting) {
      isConnecting = true;

      provider = await createProvider(network);
    }

    const connectedProvider = await checkProviderConnection();

    return connectedProvider;
  },
  getEthers: async (network?: NetworkType) => {
    try {
      const currentNetwork = network || (await getNetwork());

      const node = await getNodeConfig(currentNetwork);

      if (!ethersProvider) {
        ethersProvider = new ethers.providers.WebSocketProvider(node);

        ethersReady = ethersProvider.ready;
      }
    } catch (e) {
      logger.log('[Ethers Wss]: Error setting provider');
    }

    await ethersReady;

    return ethersProvider;
  },
};

export default Web3WsProvider;
