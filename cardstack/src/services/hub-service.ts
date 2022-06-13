import { fromWei, getSDK } from '@cardstack/cardpay-sdk';
import axios, { AxiosError } from 'axios';
import { HUB_URL, HUB_URL_STAGING } from 'react-native-dotenv';
import Web3 from 'web3';

import { getFCMToken } from '@cardstack/models/firebase';
import HDProvider from '@cardstack/models/hd-provider';
import {
  BusinessIDUniquenessResponse,
  Inventory,
  ReservationData,
  OrderData,
  WyrePriceData,
  CreateBusinessInfoDIDParams,
  NotificationsPreferenceDataType,
} from '@cardstack/types';

import {
  getLocal,
  saveLocal,
  removeLocal,
} from '@rainbow-me/handlers/localstorage/common';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import { Network } from '@rainbow-me/helpers/networkTypes';
import {
  getAllWallets,
  getWalletByAddress,
  loadAddress,
} from '@rainbow-me/model/wallet';
import logger from 'logger';

const HUBAUTH_PROMPT_MESSAGE =
  'Please authenticate your ownership of this account with the Cardstack Hub server';

const hubAuthPromptMessages = {
  notifications: {
    register: `${HUBAUTH_PROMPT_MESSAGE} to enable notifications`,
    unregister: `${HUBAUTH_PROMPT_MESSAGE} to unregister`,
  },
  default: HUBAUTH_PROMPT_MESSAGE,
};

const HUBTOKEN_KEY = 'hubToken';

export const getHubUrl = (network: Network): string =>
  network === Network.xdai ? HUB_URL : HUB_URL_STAGING;

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
  hubURL: string,
  network: Network,
  walletAddress?: string,
  keychainAcessAskPrompt: string = hubAuthPromptMessages.default
): Promise<string | null> => {
  // load wallet address when not provided as an argument(this keychain access does not require passcode/biometric auth)
  const address = walletAddress || (await loadAddress()) || '';

  // Validate if authToken isn't already saved and use it.
  const savedAuthToken = await loadHubAuthToken(address, network);

  if (savedAuthToken) {
    return savedAuthToken;
  }

  const allWallets = await getAllWallets();

  // get wallet id through allWallets using wallet address
  const walletId =
    getWalletByAddress({ walletAddress: address, allWallets })?.id || '';

  try {
    const hdProvider = await HDProvider.get({
      walletId,
      network,
      keychainAcessAskPrompt,
    });

    // didn't use Web3Instance.get and created new web3 instance to avoid conflicts with asset loading, etc that uses web3 instance
    const web3 = new Web3(hdProvider);
    const authAPI = await getSDK('HubAuth', web3, hubURL);
    const authToken = await authAPI.authenticate({ from: address });

    await storeHubAuthToken(hubTokenStorageKey(network), authToken, address);

    return authToken;
  } catch (e) {
    logger.sentry('Hub authenticate failed', e);

    return null;
  } finally {
    await HDProvider.reset();
  }
};

export const registerFcmToken = async (
  fcmToken: string
): Promise<{ success: boolean } | undefined> => {
  try {
    const network: Network = await getNetwork();
    const hubURL = getHubUrl(network);

    const authToken = await getHubAuthToken(
      hubURL,
      network,
      undefined,
      hubAuthPromptMessages.notifications.register
    );

    if (!authToken) {
      return { success: false };
    }

    const results = await hubApi.post(
      `${hubURL}/api/push-notification-registrations`,
      JSON.stringify({
        data: {
          type: 'push-notification-registration',
          attributes: {
            'push-client-id': fcmToken,
          },
        },
      }),
      axiosConfig(authToken)
    );

    if (results.data) {
      return { success: true };
    }
  } catch (e: any) {
    logger.sentry('Error while registering fcmToken to hub', e?.response || e);
  }
};

export const unregisterFcmToken = async (
  fcmToken: string
): Promise<{ success: boolean } | undefined> => {
  try {
    const network: Network = await getNetwork();
    const hubURL = getHubUrl(network);

    const authToken = await getHubAuthToken(
      hubURL,
      network,
      undefined,
      hubAuthPromptMessages.notifications.unregister
    );

    if (!authToken) {
      return { success: false };
    }

    const results = await hubApi.delete(
      `${hubURL}/api/push-notification-registrations/${fcmToken}`,
      axiosConfig(authToken)
    );

    if (results.data) {
      return { success: true };
    }
  } catch (e: any) {
    logger.sentry(
      'Error while unregistering fcmToken from hub',
      e?.response || e
    );
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

export const getInventories = async (
  hubURL: string,
  authToken: string,
  issuerAddress: string
): Promise<Inventory[] | undefined> => {
  try {
    const results = await axios.get(
      `${hubURL}/api/inventories`,
      axiosConfig(authToken)
    );

    if (results?.data?.data) {
      const inventory = results?.data?.data;

      return inventory
        .filter((item: Inventory) => item.attributes.issuer === issuerAddress)
        .sort((a: Inventory, b: Inventory) => {
          return a.attributes['face-value'] - b.attributes['face-value'];
        })
        .map((item: Inventory) => {
          return {
            ...item,
            isSelected: false,
            amount: fromWei(item?.attributes['ask-price']),
          };
        });
    }
  } catch (e) {
    logger.sentry('Error while fetching inventories', e);
  }
};

export const makeReservation = async (
  hubURL: string,
  authToken: string,
  sku: string
): Promise<ReservationData | undefined> => {
  try {
    const results = await axios.post(
      `${hubURL}/api/reservations`,
      JSON.stringify({
        data: {
          type: 'reservations',
          attributes: {
            sku,
          },
        },
      }),
      axiosConfig(authToken)
    );

    if (results.data?.data) {
      return results.data?.data;
    }
  } catch (e: any) {
    logger.sentry('Error while making reservation', e?.response?.error || e);
  }
};

export const updateOrder = async (
  hubURL: string,
  authToken: string,
  wyreOrderId: string,
  wyreWalletID: string,
  reservationId: string
): Promise<OrderData | undefined> => {
  try {
    const results = await axios.post(
      `${hubURL}/api/orders`,
      JSON.stringify({
        data: {
          type: 'orders',
          attributes: {
            'order-id': wyreOrderId,
            'wallet-id': wyreWalletID,
          },
          relationships: {
            reservation: {
              data: { type: 'reservations', id: reservationId },
            },
          },
        },
      }),
      axiosConfig(authToken)
    );

    if (results.data?.data) {
      return results.data?.data;
    }
  } catch (e: any) {
    logger.sentry('Error updating order', e?.response || e);
  }
};

export const getOrder = async (
  hubURL: string,
  authToken: string,
  orderId: string
): Promise<OrderData | undefined> => {
  try {
    const results = await axios.get(
      `${hubURL}/api/orders/${orderId}`,
      axiosConfig(authToken)
    );

    const prepaidCardAddress =
      results?.data?.included?.[0].attributes?.['prepaid-card-address'] || null;

    return { ...results?.data?.data, prepaidCardAddress };
  } catch (e: any) {
    logger.sentry('Error getting order details', e);
  }
};

export const getWyrePrice = async (
  hubURL: string,
  authToken: string
): Promise<WyrePriceData[] | undefined> => {
  try {
    const results = await axios.get(
      `${hubURL}/api/wyre-prices`,
      axiosConfig(authToken)
    );

    return results?.data?.data;
  } catch (e) {
    logger.sentry('Error getting order details', e);
  }
};

export const checkBusinessIdUniqueness = async (
  businessId: string,
  authToken: string
): Promise<BusinessIDUniquenessResponse | undefined> => {
  try {
    const network: Network = await getNetwork();
    const hubURL = getHubUrl(network);

    const results = await hubApi.get(
      `${hubURL}/api/merchant-infos/validate-slug/${businessId}`,
      axiosConfig(authToken)
    );

    return results?.data as BusinessIDUniquenessResponse;
  } catch (e: any) {
    logger.sentry(
      'Error while checking BusinessIdUniqueness from hub',
      e?.response || e
    );
  }
};

export const createBusinessInfoDID = async (
  merchantInfoData: CreateBusinessInfoDIDParams,
  authToken: string
): Promise<string | undefined> => {
  try {
    const network: Network = await getNetwork();
    const hubURL = getHubUrl(network);

    const results = await hubApi.post(
      `${hubURL}/api/merchant-infos`,
      JSON.stringify({
        data: {
          type: 'merchant-infos',
          attributes: merchantInfoData,
        },
      }),
      axiosConfig(authToken)
    );

    return results?.data?.data?.attributes?.did;
  } catch (e: any) {
    logger.sentry(
      'Error while creating Merchant DID from hub',
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
