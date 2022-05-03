import { getSDK } from '@cardstack/cardpay-sdk';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import Web3Instance from '@cardstack/models/web3-instance';

import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import store, { AppState } from '@rainbow-me/redux/store';
import logger from 'logger';

import {
  getHubAuthToken,
  removeHubAuthToken,
  loadHubAuthToken,
  getHubUrl,
} from '../hub-service';

import { hubApi } from './hub-api';
import { BaseQueryExtraOptions, CheckHubAuthQueryParams } from './hub-types';

// Helpers

export const fetchHubBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  BaseQueryExtraOptions
> = async (args, api, extraOptions = { authenticate: true }) => {
  const network = await getNetwork();
  const hubUrl = getHubUrl(network);

  const result = await fetchBaseQuery({
    baseUrl: `${hubUrl}/api`,
    prepareHeaders: async (headers, { getState }) => {
      headers.set('Content-Type', 'application/vnd.api+json');
      headers.set('Accept', 'application/vnd.api+json');

      if (extraOptions.authenticate) {
        const walletAddress = (getState() as AppState).settings.accountAddress;

        if (walletAddress && network) {
          try {
            const token = await getHubAuthToken(hubUrl, network, walletAddress);

            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
          } catch (e) {
            logger.sentry('Error getting hub token', e);
          }
        }
      }

      return headers;
    },
  })(args, api, extraOptions);

  const { error } = result;

  if (error) {
    logger.sentry('Error on hubApi', JSON.stringify(error));

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

// Queries

export const checkHubAuth = async ({
  accountAddress,
  network,
}: CheckHubAuthQueryParams) => {
  const authToken = await loadHubAuthToken(accountAddress, network);

  if (!authToken) {
    return false;
  }

  const web3 = Web3Instance.get();
  const hubUrl = getHubUrl(network);

  const hubAuthInstance = await getSDK('HubAuth', web3, hubUrl);
  const isAuthenticated = await hubAuthInstance.checkValidAuth(authToken);

  return isAuthenticated;
};

// External Queries

export const getExchangeRatesQuery = () => {
  const query = store.dispatch(
    hubApi.endpoints.getExchangeRates.initiate(undefined, {
      forceRefetch: 60, // 1 minute
    })
  );

  return query;
};
