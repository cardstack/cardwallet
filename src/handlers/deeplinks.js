import qs from 'qs';
import URL from 'url-parse';
import store from '../redux/store';
import {
  walletConnectOnSessionRequest,
  walletConnectRemovePendingRedirect,
  walletConnectSetPendingRedirect,
} from '../redux/walletconnect';
import { fullyDecodeURI } from '@cardstack/utils';
import logger from 'logger';

export default function handleDeepLink(url) {
  if (!url || typeof url !== 'string') return;
  const urlObj = new URL(url);
  if (urlObj.protocol === 'https:') {
    const action = urlObj.pathname.split('/')[1];
    switch (action) {
      case 'wc': {
        const { uri } = qs.parse(urlObj.query.substring(1));
        handleWalletConnect(uri);
        break;
      }
      default:
        logger.log('unknown deeplink');
    }
    // Android uses normal deeplinks
  } else if (urlObj.protocol === 'wc:') {
    handleWalletConnect(fullyDecodeURI(url));
  } else if (urlObj.origin === 'cardwallet://wc') {
    const wcUri = urlObj.query?.split('?uri=')?.[1];
    if (wcUri) {
      handleWalletConnect(fullyDecodeURI(wcUri));
    }
  }
}

function handleWalletConnect(uri) {
  const { dispatch } = store;
  dispatch(walletConnectSetPendingRedirect());
  const { query } = new URL(uri);
  if (uri && query) {
    dispatch(
      walletConnectOnSessionRequest(uri, (status, dappScheme) => {
        dispatch(walletConnectRemovePendingRedirect(status, dappScheme));
      })
    );
  }
}
