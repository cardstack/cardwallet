import { CARDWALLET_SCHEME } from '@cardstack/cardpay-sdk';
import Url from 'url-parse';

export const isEncodedUri = (uri = ''): boolean =>
  uri !== decodeURIComponent(uri);

export const decodeNestedURI = (uri: string): string => {
  while (isEncodedUri(uri)) {
    uri = decodeURIComponent(uri);
  }

  return uri;
};

// convert https:// to `${CARDWALLET_SCHEME}:/`
export const convertDeepLinkToCardWalletProtocol = (deepLink: string) => {
  const url = new Url(deepLink);

  if (url.protocol === 'https:') {
    return `${CARDWALLET_SCHEME}:/${url.pathname}${url.query || ''}`;
  }

  return deepLink;
};
