import qs from 'qs';
import URL from 'url-parse';
import store from '../redux/store';
import {
  walletConnectOnSessionRequest,
  walletConnectRemovePendingRedirect,
  walletConnectSetPendingRedirect,
} from '../redux/walletconnect';
import { WCRedirectTypes } from '@cardstack/screen/sheets/WalletConnectRedirectSheet';
import logger from 'logger';

export default function handleDeepLink(url) {
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
    handleWalletConnect(url);
  }
}

function handleWalletConnect(uri) {
  const { dispatch } = store;
  dispatch(walletConnectSetPendingRedirect());
  const { query } = new URL(uri);
  if (uri && query) {
    dispatch(
      walletConnectOnSessionRequest(uri, (status, dappScheme) => {
        if (status === WCRedirectTypes.reject) {
          dispatch(
            walletConnectRemovePendingRedirect(
              WCRedirectTypes.reject,
              dappScheme
            )
          );
        } else {
          dispatch(
            walletConnectRemovePendingRedirect(
              WCRedirectTypes.connect,
              dappScheme
            )
          );
        }
      })
    );
  } else {
    // This is when we get focused by WC due to a signing request
  }
}
