import URL from 'url-parse';

import { decodeNestedURI } from '@cardstack/utils';

import logger from 'logger';

import store from '../redux/store';
import {
  walletConnectOnSessionRequest,
  walletConnectRemovePendingRedirect,
  walletConnectSetPendingRedirect,
} from '../redux/walletconnect';

export default function handleWcDeepLink(url) {
  if (!url || typeof url !== 'string') return;
  const urlObj = new URL(url);
  if (urlObj.protocol === 'https:' || urlObj.protocol === 'cardwallet:') {
    // cardwallet://wc?uri=wc:xxxx
    // https://wallet.cardstack.com/wc?uri=wc:xxxx
    // https://wallet-staging.stack.cards/wc?uri=wc:xxxx
    const action = urlObj.pathname
      ? urlObj.pathname.split('/')[1]
      : urlObj.hostname;
    switch (action) {
      case 'wc': {
        const wcUri = urlObj.query?.split('?uri=')?.[1];
        if (wcUri) {
          handleWalletConnect(wcUri);
        }
        break;
      }
      default:
        logger.log('no wc deeplink');
    }
  } else if (urlObj.protocol === 'wc:') {
    // Handle direct WC deeplink (wc:xxxx)
    handleWalletConnect(url);
  }
}

function handleWalletConnect(uri) {
  const { dispatch } = store;
  dispatch(walletConnectSetPendingRedirect());
  const decodedUri = decodeNestedURI(uri);
  const { query } = new URL(decodedUri);
  if (decodedUri && query) {
    dispatch(
      walletConnectOnSessionRequest(decodedUri, (status, dappScheme) =>
        dispatch(walletConnectRemovePendingRedirect(status, dappScheme))
      )
    );
  }
}
