import qs from 'qs';
import URL from 'url-parse';
import store from '../redux/store';
import {
  walletConnectOnSessionRequest,
  walletConnectRemovePendingRedirect,
  walletConnectSetPendingRedirect,
} from '../redux/walletconnect';
import { Navigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { parseQueryParams } from '@rainbow-me/utils';
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
      case 'request': {
        var params = parseQueryParams(urlObj.query);
        //navigate to spend sheet, pass params to be ingested
        Navigation.handleAction(Routes.SPEND_SHEET, { ...params });
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
        if (status === 'reject') {
          dispatch(walletConnectRemovePendingRedirect('reject', dappScheme));
        } else {
          dispatch(walletConnectRemovePendingRedirect('connect', dappScheme));
        }
      })
    );
  } else {
    // This is when we get focused by WC due to a signing request
  }
}
