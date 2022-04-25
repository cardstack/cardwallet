import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { HUB_URL, HUB_URL_STAGING } from 'react-native-dotenv';

import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { AppState } from '@rainbow-me/redux/store';
import logger from 'logger';

import { getHubAuthToken, removeHubAuthToken } from '../hub-service';

// Helpers

export const fetchHubBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const network = await getNetwork();
  const hubUrl = network === Network.xdai ? HUB_URL : HUB_URL_STAGING;

  return await fetchBaseQuery({
    baseUrl,
    prepareHeaders: async headers => {
      headers.set('Content-Type', 'application/vnd.api+json');
      headers.set('Accept', 'application/vnd.api+json');

      return headers;
    },
  })(args, api, extraOptions);
};

export const fetchHubAuthenticatedQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const network = await getNetwork();
  const baseUrl = network === Network.xdai ? HUB_URL : HUB_URL_STAGING;

  const result = await fetchBaseQuery({
    baseUrl: `${hubUrl}/api`,
    prepareHeaders: async (headers, { getState }) => {
      const walletAddress = (getState() as AppState).settings.accountAddress;

      if (walletAddress && network) {
        try {
          const token = await getHubAuthToken(hubUrl, network, walletAddress);

          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            headers.set('Content-Type', 'application/vnd.api+json');
            headers.set('Accept', 'application/vnd.api+json');
          }
        } catch (e) {
          logger.sentry('Error getting hub token', e);
        }
      }

      return headers;
    },
  })(args, api, extraOptions);

  const { error } = result;

  if (error) {
    logger.sentry('Error on hubApi', error);

    if (error?.status === 401) {
      removeHubAuthToken(network);
    }
  }

  return result;
};

export const hubBodyBuilder = <Attrs>(path: string, attributes: Attrs) =>
  JSON.stringify({
    data: {
      type: path.replace('/', ''),
      attributes,
    },
  });
