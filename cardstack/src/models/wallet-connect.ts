import { convertChainIdToName } from '@cardstack/cardpay-sdk';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { captureException } from '@sentry/react-native';
import { Core } from '@walletconnect/core';
import SignClient from '@walletconnect/sign-client';
import {
  SignClientTypes,
  EngineTypes,
  SessionTypes,
} from '@walletconnect/types/dist/types/sign-client'; // There's some conflict using the global import @walletconnect/types
import { getSdkError } from '@walletconnect/utils';
import { WALLET_CONNECT_PROJECT_ID } from 'react-native-dotenv';

import { appName } from '@cardstack/constants';
import { Navigation, Routes } from '@cardstack/navigation';
import { getRequestDisplayDetails } from '@cardstack/parsers/signing-requests';
import { handleWalletConnectRequests } from '@cardstack/redux/requests';

import store from '@rainbow-me/redux/store';
import { logger } from '@rainbow-me/utils';

const core = new Core({
  projectId: WALLET_CONNECT_PROJECT_ID,
});

const metadata = {
  name: `${appName}`,
  description: `${appName} makes exploring xDai fun and accessible`,
  url: 'https://app.cardstack.com',
  icons: [
    'https://assets.coingecko.com/coins/images/3247/small/cardstack.png?1547037769',
  ],
};

let signClient: SignClient | null = null;

const WalletConnect = {
  init: async (accountAddress: string) => {
    try {
      if (!signClient) {
        signClient = await SignClient.init({
          core,
          metadata,
        });

        signClient?.on(
          'session_proposal',
          (event: SessionProposalParams['event']) =>
            onSessionProposal({ event, accountAddress })
        );

        signClient?.on('session_request', onSessionRequest);

        logger.sentry('[WC-2.0]: Initialized');
      }
    } catch (e) {
      logger.sentry('[WC-2.0]: Init failed', e);
      captureException(e);
    }
  },
  pair: async (params: EngineTypes.PairParams) => {
    try {
      await signClient?.core.pairing.pair(params);
    } catch (e) {
      logger.sentry('[WC-2.0]: Pairing failed', e);
    }
  },
  getActivePairings: () => {
    const pairings = signClient?.core.pairing.getPairings();

    return pairings?.filter(({ active }) => active);
  },
  getAcknowledgedSessions: () =>
    signClient?.session.getAll({ acknowledged: true }),
  isVersion2Uri: (uri: string) => uri.includes('relay-protocol'),
  disconnect: async (params: EngineTypes.DisconnectParams) => {
    try {
      await signClient?.disconnect(params);
    } catch (e) {
      logger.sentry('[WC-2.0]: Disconnect failed', e);
    }
  },
  approveRequest: async ({ topic, id }: RequestEvent, signResult: string) => {
    try {
      await signClient?.respond({
        topic,
        response: formatJsonRpcResult(id, signResult),
      });
    } catch (e) {
      logger.sentry('[WC-2.0]: ApproveRequest failed: ', id, e);
    }
  },
  rejectRequest: async ({ topic, id }: RequestEvent) => {
    try {
      await signClient?.respond({
        topic,
        response: formatJsonRpcError(
          id,
          getSdkError('USER_REJECTED_METHODS').message
        ),
      });
    } catch (e) {
      logger.sentry('[WC-2.0]: User rejected request failed: ', id, e);
    }
  },
  getSessionInfo: (topic: string) => {
    const session = signClient?.session.get(topic);

    return {
      ...session,
      dappInfo: session?.peer.metadata,
    };
  },
};

// Listeners
interface SessionProposalParams {
  accountAddress: string;
  event: EventType<'session_proposal'>;
}

const onSessionProposal = (params: SessionProposalParams) => {
  // TODO: handle timeout
  const { event } = params;

  const dappMeta = event.params.proposer.metadata;

  Navigation.handleAction(Routes.WALLET_CONNECT_APPROVAL_SHEET, {
    callback: async (approved: boolean) => {
      if (approved) {
        try {
          await signClient?.approve({
            id: event.id,
            namespaces: buildNamespacesFromEvent(
              params
            ) as SessionTypes.Namespaces,
          });
        } catch (e) {
          logger.sentry('[WC-2.0]: Pairing approval failed', e);
        }
      } else {
        try {
          await signClient?.reject({
            id: event.id,
            reason: getSdkError('USER_REJECTED'),
          });
        } catch (e) {
          logger.sentry('[WC-2.0]: Pairing rejection failed', e);
        }
      }
    },
    meta: {
      dappName: dappMeta.name,
      dappUrl: dappMeta.url,
      imageUrl: dappMeta.icons[0],
    },
  });
};

const onSessionRequest = (event: RequestEvent) => {
  const { nativeCurrency } = store.getState().settings;

  const {
    params: { request: payload, chainId },
  } = event;

  const { dappInfo } = WalletConnect.getSessionInfo(event.topic);

  // chainId example -> eip155:8001
  const networkId = Number(chainId.split(':')[1]);
  const txNetwork = convertChainIdToName(networkId);

  handleWalletConnectRequests({
    payload,
    displayDetails: getRequestDisplayDetails(payload, [], nativeCurrency),
    event, // To keep retro compatibility for now we need to "duplicate" the data
    dappName: dappInfo?.name,
    dappUrl: dappInfo?.url,
    txNetwork,
  });
};

// Helpers

type EventType<
  T extends SignClientTypes.Event
> = SignClientTypes.EventArguments[T];

type RequestEvent = EventType<'session_request'>;

const buildNamespacesFromEvent = ({
  event,
  accountAddress,
}: SessionProposalParams) =>
  Object.fromEntries(
    Object.entries(event.params.requiredNamespaces).map(([key, namespace]) => [
      key,
      {
        ...namespace,
        accounts: namespace.chains.map(
          (chain: string) => `${chain}:${accountAddress}`
        ),
      },
    ])
  );

export default WalletConnect;
