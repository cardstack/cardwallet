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

import { getHubAuthToken } from '../hub-service';

// Helpers

export const fetchHubBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const network = await getNetwork();
  const baseUrl = network === Network.xdai ? HUB_URL : HUB_URL_STAGING;

  const result = await fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { getState }) => {
      const walletAddress = (getState() as AppState).settings.accountAddress;

      if (walletAddress && network) {
        try {
          const token = await getHubAuthToken(baseUrl, network, walletAddress);

          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            headers.set('Content-Type', 'application/vnd.api+json');
            headers.set('Accept', 'application/vnd.api+json');
          }
        } catch (error) {
          logger.sentry('Error getting hub token', error);
        }
      }

      return headers;
    },
  })(args, api, extraOptions);

  return result;
};
