import { getSDK } from '@cardstack/cardpay-sdk';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { getFCMToken } from '@cardstack/models/firebase';
import Web3Instance from '@cardstack/models/web3-instance';
import { MerchantSafeType } from '@cardstack/types';

import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import store, { AppState } from '@rainbow-me/redux/store';
import logger from 'logger';

import {
  getHubAuthToken,
  removeHubAuthToken,
  loadHubAuthToken,
  getHubUrl,
} from '../hub-token-service';
import { safesApi } from '../safes-api';

import { hubApi } from './hub-api';
import {
  BaseQueryExtraOptions,
  CheckHubAuthQueryParams,
  GetExchangeRatesQueryParams,
  PostProfilePurchaseQueryParams,
  UpdateProfileInfoParams,
} from './hub-types';

// Helpers

export const fetchHubBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  BaseQueryExtraOptions
> = async (args, api, extraOptions) => {
  const extraOptionsOverwrite = {
    authenticate: true,
    appendFCMToken: false,
    ...extraOptions,
  };

  const network = await getNetwork();
  const hubUrl = getHubUrl(network);

  const baseQuery = fetchBaseQuery({
    baseUrl: `${hubUrl}/api`,
    prepareHeaders: async (headers, { getState }) => {
      headers.set('Content-Type', 'application/vnd.api+json');
      headers.set('Accept', 'application/vnd.api+json');

      if (extraOptionsOverwrite.authenticate) {
        const walletAddress = (getState() as AppState).settings.accountAddress;

        if (walletAddress && network) {
          try {
            const token = await getHubAuthToken(network, walletAddress);

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
  });

  // Append FCM Token to URL.
  if (extraOptionsOverwrite.appendFCMToken) {
    const { fcmToken } = await getFCMToken();

    if (typeof args === 'string') {
      args += `/${fcmToken}`;
    } else {
      args.url += `/${fcmToken}`;
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  const { error } = result;

  if (error) {
    logger.sentry('Error on hubApi', JSON.stringify(error), args);

    if (error?.status === 401 || error?.status === 403) {
      const walletAddress = store.getState().settings.accountAddress;

      removeHubAuthToken(walletAddress, network);

      // Retry query, it will try to pull new token.
      result = await baseQuery(args, api, extraOptions);
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

export const hubProfilePurchaseBody = (
  path: string,
  params: PostProfilePurchaseQueryParams
): string => {
  const body = {
    data: {
      type: path.replace('/', ''),
      attributes: {
        receipt: params.iapReceipt,
        provider: params.provider,
      },
    },
    relationships: {
      'merchant-info': {
        data: {
          type: 'merchant-infos',
          lid: '1', // local-id, only there so BE can match relationships
        },
      },
    },
    included: [
      {
        type: 'merchant-infos',
        lid: '1',
        attributes: params.profileInfo,
      },
    ],
  };

  return JSON.stringify(body);
};

// Optimistic path profile info
export const patchProfileInfo = (newInfo: UpdateProfileInfoParams) => {
  const { accountAddress: address, nativeCurrency } = store.getState().settings;

  // Helper scoped function
  const findAndUpdateProfileInfo = (
    safes: MerchantSafeType[],
    { name, color, id, ...info }: UpdateProfileInfoParams
  ) =>
    safes.map(safe => {
      const { merchantInfo } = safe;

      return merchantInfo?.id === id
        ? {
            ...safe,
            merchantInfo: {
              ...merchantInfo,
              name,
              color,
              textColor: info['text-color'],
            },
          }
        : safe;
    });

  return store.dispatch(
    safesApi.util.updateQueryData(
      'getSafesData',
      { address, nativeCurrency }, // Params matching query cache
      ({ merchantSafes = [], ...otherSafes }) => ({
        ...otherSafes,
        merchantSafes: findAndUpdateProfileInfo(merchantSafes, newInfo),
      })
    )
  );
};

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

const cacheExpiration = {
  tenMinutes: 60 * 10,
};

export const getExchangeRatesQuery = (params?: GetExchangeRatesQueryParams) => {
  const query = store.dispatch(
    hubApi.endpoints.getExchangeRates.initiate(params, {
      forceRefetch: cacheExpiration.tenMinutes,
    })
  );

  return query;
};
