import { getSDK } from '@cardstack/cardpay-sdk';
import axios, { AxiosError } from 'axios';
import { HUB_URL, HUB_URL_STAGING } from 'react-native-dotenv';

import { getWeb3ProviderWithEthSigner } from '@cardstack/models/ethers-wallet';
import { getFCMToken } from '@cardstack/models/firebase';
import { NotificationsPreferenceDataType } from '@cardstack/types';

import {
  getLocal,
  saveLocal,
  removeLocal,
} from '@rainbow-me/handlers/localstorage/common';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { loadAddress } from '@rainbow-me/model/wallet';
import logger from 'logger';

const HUBTOKEN_KEY = 'hubToken';

export const getHubUrl = (network: Network): string =>
  network === Network.gnosis ? HUB_URL : HUB_URL_STAGING;

const axiosConfig = (authToken: string) => {
  return {
    baseURL: HUB_URL,
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer: ${authToken}`,
      Accept: 'application/vnd.api+json',
    },
  };
};

const hubApi = axios.create(axiosConfig(''));

const hubTokenStorageKey = (network: string): string => {
  return `${HUBTOKEN_KEY}-${network}`;
};

export const loadHubAuthToken = async (
  walletAddress: string,
  network: Network
): Promise<string | null> => {
  const {
    data: { authToken },
  } = ((await getLocal(
    hubTokenStorageKey(network),
    undefined,
    walletAddress
  )) || {
    data: { authToken: null },
  }) as any;

  return authToken;
};

const storeHubAuthToken = async (
  tokenStorageKey: string,
  authToken: string,
  walletAddress: string
) => {
  // expires in a day.
  await saveLocal(
    tokenStorageKey,
    { data: { authToken } },
    1000 * 3600 * 24,
    undefined,
    walletAddress
  );
};

export const removeHubAuthToken = (address: string, network: Network) =>
  removeLocal(hubTokenStorageKey(network), address);

export const getHubAuthToken = async (
  network: Network,
  walletAddress?: string
): Promise<string | null> => {
  // load wallet address when not provided as an argument(this keychain access does not require passcode/biometric auth)
  const address = walletAddress || (await loadAddress()) || '';

  // Validate if authToken isn't already saved and use it.
  const savedAuthToken = await loadHubAuthToken(address, network);

  if (savedAuthToken) {
    return savedAuthToken;
  }

  try {
    const [web3, signer] = await getWeb3ProviderWithEthSigner({
      accountAddress: address,
    });

    const authAPI = await getSDK('HubAuth', web3, undefined, signer);

    const authToken = await authAPI.authenticate({ from: address });

    await storeHubAuthToken(hubTokenStorageKey(network), authToken, address);

    return authToken;
  } catch (e) {
    logger.sentry('Hub authenticate failed', e);

    return null;
  }
};

export const getNotificationsPreferences = async (
  authToken: string
): Promise<NotificationsPreferenceDataType[] | undefined> => {
  try {
    const network: Network = await getNetwork();
    const hubURL = getHubUrl(network);
    const { fcmToken } = await getFCMToken();

    const results = await hubApi.get(
      `${hubURL}/api/notification-preferences/${fcmToken}`,
      axiosConfig(authToken)
    );

    return results?.data?.data as NotificationsPreferenceDataType[];
  } catch (e: any) {
    logger.sentry(
      'Error while fetching notifications preferences from hub',
      e?.response || e
    );
  }
};

export const setNotificationsPreferences = async (
  authToken: string,
  update: NotificationsPreferenceDataType
) => {
  try {
    const network: Network = await getNetwork();
    const hubURL = getHubUrl(network);
    const { fcmToken } = await getFCMToken();

    await hubApi.put(
      `${hubURL}/api/notification-preferences/${fcmToken}`,
      JSON.stringify({
        data: {
          type: 'notification-preference',
          attributes: {
            'notification-type': update.attributes['notification-type'],
            status: update.attributes.status,
          },
        },
      }),
      axiosConfig(authToken)
    );
  } catch (e: any) {
    logger.sentry(
      'Error while saving notifications preferences on hub',
      e?.response || e
    );
  }
};

hubApi?.interceptors?.response?.use?.(undefined, async (error: AxiosError) => {
  if (error?.response?.status !== 401) {
    return Promise.reject(error);
  }
  // Got API error 401, auth token should be refreshed.

  // Remove token from local storage
  const network: Network = await getNetwork();
  await removeLocal(hubTokenStorageKey(network));

  // We can't refresh and re-run the request without improving
  // how the auth token is being kept outside this scope.
  // So ftm, we reject the request.
  return Promise.reject(error);
});
