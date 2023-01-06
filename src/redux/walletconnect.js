import { captureException } from '@sentry/react-native';
import WalletConnectLegacy from '@walletconnect/legacy-client';
import lang from 'i18n-js';
import {
  forEach,
  get,
  isEmpty,
  mapValues,
  omitBy,
  pickBy,
  values,
} from 'lodash';
import { Alert, Linking } from 'react-native';
import {
  getAllValidWalletConnectSessions,
  removeWalletConnectSessions,
  saveWalletConnectSession,
} from '../handlers/localstorage/walletconnectSessions';
import { sendRpcCall } from '../handlers/web3';
import { dappLogoOverride, dappNameOverride } from '../helpers/dappNameHandler';
import { isSigningMethod } from '../utils/signingMethods';
import { appName } from '@cardstack/constants';
import { getFCMToken } from '@cardstack/models/firebase';
import WalletConnect from '@cardstack/models/wallet-connect';
import { Navigation, Routes } from '@cardstack/navigation';
import {
  addRequestToApprove,
  handleWalletConnectRequests,
} from '@cardstack/redux/requests';
import { WCRedirectTypes } from '@cardstack/screens/sheets/WalletConnectRedirectSheet';
import logger from 'logger';

// -- Constants --------------------------------------- //

const WC_REQUEST_TIMEOUT = 4000; // 4 seconds

const WALLETCONNECT_ADD_REQUEST = 'walletconnect/WALLETCONNECT_ADD_REQUEST';
const WALLETCONNECT_REMOVE_REQUEST =
  'walletconnect/WALLETCONNECT_REMOVE_REQUEST';

const WALLETCONNECT_ADD_SESSION = 'walletconnect/WALLETCONNECT_ADD_SESSION';
const WALLETCONNECT_REMOVE_SESSION =
  'walletconnect/WALLETCONNECT_REMOVE_SESSION';

const WALLETCONNECT_INIT_SESSIONS = 'walletconnect/WALLETCONNECT_INIT_SESSIONS';
const WALLETCONNECT_CLEAR_STATE = 'walletconnect/WALLETCONNECT_CLEAR_STATE';

const WALLETCONNECT_SET_PENDING_REDIRECT =
  'walletconnect/WALLETCONNECT_SET_PENDING_REDIRECT';
const WALLETCONNECT_REMOVE_PENDING_REDIRECT =
  'walletconnect/WALLETCONNECT_REMOVE_PENDING_REDIRECT';

const baseCloudFunctionsUrl =
  'https://us-central1-card-pay-3e9be.cloudfunctions.net';

// -- Actions ---------------------------------------- //
const getNativeOptions = async () => {
  const language = 'en'; // TODO use lang from settings
  const token = await getFCMToken();

  const nativeOptions = {
    clientMeta: {
      description: `${appName} makes exploring xDai fun and accessible`,
      icons: [
        'https://assets.coingecko.com/coins/images/3247/small/cardstack.png?1547037769',
      ],
      name: 'Cardstack',
      ssl: true,
      url: 'https://cardstack.com/',
    },
    push: token
      ? {
          language,
          peerMeta: true,
          token,
          type: 'fcm',
          url: `${baseCloudFunctionsUrl}/push`,
        }
      : undefined,
  };

  return nativeOptions;
};

export const walletConnectSetPendingRedirect = () => dispatch => {
  dispatch({
    type: WALLETCONNECT_SET_PENDING_REDIRECT,
  });
};
export const walletConnectRemovePendingRedirect = (
  type,
  scheme
) => dispatch => {
  dispatch({
    type: WALLETCONNECT_REMOVE_PENDING_REDIRECT,
  });
  if (scheme) {
    Linking.openURL(`${scheme}://`);
  } else {
    return Navigation.handleAction(Routes.WALLET_CONNECT_REDIRECT_SHEET, {
      type,
    });
  }
};

export const walletConnectOnSessionRequest = (
  uri,
  callback
) => async dispatch => {
  let walletConnector = null;
  // Use WC 2.0
  if (WalletConnect.isVersion2Uri(uri)) {
    return WalletConnect.pair({ uri });
  }

  try {
    const { clientMeta, push } = await getNativeOptions();
    try {
      walletConnector = new WalletConnectLegacy({ clientMeta, uri }, push);
      const timeoutHandler = setTimeout(() => {
        callback && callback(WCRedirectTypes.qrcodeInvalid);
      }, WC_REQUEST_TIMEOUT);
      walletConnector.on('session_request', (error, payload) => {
        if (timeoutHandler) {
          clearTimeout(timeoutHandler);
        }
        if (error) {
          logger.log('Error on wc session_request', payload);
          captureException(error);
          throw error;
        }

        const { peerId, peerMeta } = payload.params[0];

        const imageUrl =
          dappLogoOverride(peerMeta.url) || get(peerMeta, 'icons[0]');
        const dappName = dappNameOverride(peerMeta.url) || peerMeta.name;
        const dappUrl = peerMeta.url;
        const dappScheme = peerMeta.scheme;

        Navigation.handleAction(Routes.WALLET_CONNECT_APPROVAL_SHEET, {
          callback: async approved => {
            if (approved) {
              dispatch(setPendingRequest(peerId, walletConnector));
              dispatch(
                walletConnectApproveSession(peerId, callback, dappScheme)
              );
            } else {
              await dispatch(
                walletConnectRejectSession(peerId, walletConnector)
              );
              callback && callback(WCRedirectTypes.reject, dappScheme);
            }
          },
          meta: {
            dappName,
            dappUrl,
            imageUrl,
          },
        });
      });
    } catch (error) {
      logger.log('Exception during wc session_request');

      captureException(error);
      Alert.alert(lang.t('wallet.wallet_connect.error'));
    }
  } catch (error) {
    logger.log('FCM exception during wc session_request');
    captureException(error);
    Alert.alert(lang.t('wallet.wallet_connect.missing_fcm'));
  }
};

const listenOnNewMessages = walletConnector => (dispatch, getState) => {
  walletConnector.on('call_request', async (error, payload) => {
    logger.log('WC Request!', error, payload);
    if (error) {
      logger.log('Error on wc call_request');
      captureException(error);
      throw error;
    }
    const { clientId, peerId, peerMeta } = walletConnector;
    const requestId = payload.id;
    if (!isSigningMethod(payload.method)) {
      sendRpcCall(payload)
        .then(result => {
          walletConnector.approveRequest({
            id: payload.id,
            result,
          });
        })
        .catch(() => {
          walletConnector.rejectRequest({
            error: { message: 'JSON RPC method not supported' },
            id: payload.id,
          });
        });
      return;
    } else {
      const { requests: pendingRequests } = getState().requests;
      const request = !pendingRequests[requestId]
        ? await dispatch(
            addRequestToApprove(clientId, peerId, requestId, payload, peerMeta)
          )
        : null;

      handleWalletConnectRequests(request);
    }
  });
  walletConnector.on('disconnect', error => {
    if (error) {
      throw error;
    }
    dispatch(
      walletConnectDisconnectAllByDappNameOrUrl(
        walletConnector.peerMeta.name || walletConnector.peerMeta.url
      )
    );
  });
  return walletConnector;
};

export const walletConnectLoadState = () => async (dispatch, getState) => {
  const { walletConnectors } = getState().walletconnect;
  let newWalletConnectors = {};
  try {
    if (!isEmpty(walletConnectors)) {
      // Clear the event listeners before reconnecting
      // to prevent having the same callbacks
      Object.keys(walletConnectors).forEach(key => {
        const connector = walletConnectors[key];
        if (connector?._eventManager) {
          connector._eventManager = null;
        }
      });
    }

    const allSessions = await getAllValidWalletConnectSessions();

    const { clientMeta, push } = await getNativeOptions();

    newWalletConnectors = mapValues(allSessions, session => {
      const walletConnector = new WalletConnectLegacy(
        { clientMeta, session },
        push
      );
      return dispatch(listenOnNewMessages(walletConnector));
    });
  } catch (error) {
    logger.log('Error on wc walletConnectLoadState', error);
    captureException(error);
    newWalletConnectors = {};
  }
  if (!isEmpty(newWalletConnectors)) {
    dispatch({
      payload: newWalletConnectors,
      type: WALLETCONNECT_INIT_SESSIONS,
    });
  }
};

export const setPendingRequest = (peerId, walletConnector) => (
  dispatch,
  getState
) => {
  const { pendingRequests } = getState().walletconnect;
  const updatedPendingRequests = {
    ...pendingRequests,
    [peerId]: walletConnector,
  };
  dispatch({
    payload: updatedPendingRequests,
    type: WALLETCONNECT_ADD_REQUEST,
  });
};

export const getPendingRequest = peerId => (dispatch, getState) => {
  const { pendingRequests } = getState().walletconnect;
  return pendingRequests[peerId];
};

export const removePendingRequest = peerId => (dispatch, getState) => {
  const { pendingRequests } = getState().walletconnect;
  const updatedPendingRequests = pendingRequests;
  if (updatedPendingRequests[peerId]) {
    delete updatedPendingRequests[peerId];
  }
  dispatch({
    payload: updatedPendingRequests,
    type: WALLETCONNECT_REMOVE_REQUEST,
  });
};

export const setWalletConnector = walletConnector => (dispatch, getState) => {
  const { walletConnectors } = getState().walletconnect;
  const updatedWalletConnectors = {
    ...walletConnectors,
    [walletConnector.peerId]: walletConnector,
  };
  dispatch({
    payload: updatedWalletConnectors,
    type: WALLETCONNECT_ADD_SESSION,
  });
};

export const getWalletConnector = peerId => (dispatch, getState) => {
  const { walletConnectors } = getState().walletconnect;
  const walletConnector = walletConnectors[peerId];
  return walletConnector;
};

export const removeWalletConnector = peerId => (dispatch, getState) => {
  const { walletConnectors } = getState().walletconnect;
  const updatedWalletConnectors = walletConnectors;
  if (updatedWalletConnectors[peerId]) {
    delete updatedWalletConnectors[peerId];
  }
  dispatch({
    payload: updatedWalletConnectors,
    type: WALLETCONNECT_REMOVE_SESSION,
  });
};

export const walletConnectUpdateSessions = () => (dispatch, getState) => {
  const { accountAddress, chainId } = getState().settings;
  const { walletConnectors } = getState().walletconnect;

  Object.keys(walletConnectors).forEach(key => {
    const connector = walletConnectors[key];
    const newSessionData = {
      accounts: [accountAddress],
      chainId,
    };
    connector.updateSession(newSessionData);

    saveWalletConnectSession(connector.peerId, connector.session);
  });
};

export const walletConnectApproveSession = (peerId, callback, dappScheme) => (
  dispatch,
  getState
) => {
  const { accountAddress, chainId } = getState().settings;
  const walletConnector = dispatch(getPendingRequest(peerId));
  walletConnector.approveSession({
    accounts: [accountAddress],
    chainId,
  });

  dispatch(removePendingRequest(peerId));
  saveWalletConnectSession(walletConnector.peerId, walletConnector.session);

  const listeningWalletConnector = dispatch(
    listenOnNewMessages(walletConnector)
  );

  dispatch(setWalletConnector(listeningWalletConnector));
  if (callback) {
    callback(WCRedirectTypes.connect, dappScheme);
  }
};

export const walletConnectRejectSession = (
  peerId,
  walletConnector
) => dispatch => {
  walletConnector.rejectSession();
  dispatch(removePendingRequest(peerId));
};

export const walletConnectDisconnectAllByDappNameOrUrl = dappNameOrUrl => async (
  dispatch,
  getState
) => {
  const { walletConnectors } = getState().walletconnect;
  const matchingWalletConnectors = values(
    pickBy(
      walletConnectors,
      session =>
        session.peerMeta.name === dappNameOrUrl ||
        session.peerMeta.url === dappNameOrUrl
    )
  );
  try {
    const peerIds = values(
      mapValues(
        matchingWalletConnectors,
        walletConnector => walletConnector.peerId
      )
    );
    await removeWalletConnectSessions(peerIds);
    forEach(matchingWalletConnectors, walletConnector =>
      walletConnector.killSession()
    );
    dispatch({
      payload: omitBy(
        walletConnectors,
        wc =>
          wc.peerMeta.name === dappNameOrUrl ||
          wc.peerMeta.url === dappNameOrUrl
      ),
      type: WALLETCONNECT_REMOVE_SESSION,
    });
  } catch (error) {
    Alert.alert('Failed to disconnect all WalletConnect sessions');
  }
};

export const walletConnectSendStatus = (peerId, requestId, result) => async (
  dispatch,
  getState
) => {
  const walletConnector = getState().walletconnect.walletConnectors[peerId];
  if (walletConnector) {
    try {
      if (result) {
        await walletConnector.approveRequest({ id: requestId, result });
      } else {
        await walletConnector.rejectRequest({
          error: { message: 'User rejected request' },
          id: requestId,
        });
      }
    } catch (error) {
      Alert.alert('Failed to send request status to WalletConnect.');
    }
  } else {
    Alert.alert(
      'WalletConnect session has expired while trying to send request status. Please reconnect.'
    );
  }
};

// -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  pendingRedirect: false,
  pendingRequests: {},
  walletConnectors: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WALLETCONNECT_ADD_REQUEST:
      return { ...state, pendingRequests: action.payload };
    case WALLETCONNECT_REMOVE_REQUEST:
      return { ...state, pendingRequests: action.payload };
    case WALLETCONNECT_ADD_SESSION:
      return { ...state, walletConnectors: action.payload };
    case WALLETCONNECT_REMOVE_SESSION:
      return { ...state, walletConnectors: action.payload };
    case WALLETCONNECT_INIT_SESSIONS:
      return { ...state, walletConnectors: action.payload };
    case WALLETCONNECT_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    case WALLETCONNECT_SET_PENDING_REDIRECT:
      return { ...state, pendingRedirect: true };
    case WALLETCONNECT_REMOVE_PENDING_REDIRECT:
      return { ...state, pendingRedirect: false };
    default:
      return state;
  }
};
