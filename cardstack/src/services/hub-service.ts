import axios from 'axios';
import { fromWei, getSDK } from '@cardstack/cardpay-sdk';
import { getSelectedWallet, loadAddress } from '@rainbow-me/model/wallet';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';
import {
  CustodialWallet,
  Inventory,
  ReservationData,
  OrderData,
  WyrePriceData,
} from '@cardstack/types';
import logger from 'logger';
import { Network } from '@rainbow-me/helpers/networkTypes';
import Web3Instance from '@cardstack/models/web3-instance';
import HDProvider from '@cardstack/models/hd-provider';

const HUB_URL_STAGING = 'https://hub-staging.stack.cards';
const HUB_URL_PROD = 'https://hub.cardstack.com';

const HUBAUTH_PROMPT_MESSAGE =
  'To enable notifications, please authenticate your ownership of this account with the Cardstack Hub server';

export const getHubUrl = (network: Network): string =>
  network === Network.xdai ? HUB_URL_PROD : HUB_URL_STAGING;

const axiosConfig = (authToken: string) => {
  return {
    baseURL: HUB_URL_PROD,
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer: ${authToken}`,
      Accept: 'application/vnd.api+json',
    },
  };
};

export const getHubAuthToken = async (
  hubURL: string,
  network: Network,
  walletAddress?: string,
  seedPhrase?: string
): Promise<string | null> => {
  const selectedWallet = await getSelectedWallet();

  if (selectedWallet) {
    try {
      const web3 = await Web3Instance.get({
        walletId: selectedWallet.wallet.id,
        network,
        seedPhrase,
        keychainAcessAskPrompt: HUBAUTH_PROMPT_MESSAGE,
      });

      const authAPI = await getSDK('HubAuth', web3, hubURL);

      // load wallet address when not provided as an argument(this keychain access does not require passcode/biometric auth)
      const address = walletAddress || (await loadAddress()) || '';
      const authToken = await authAPI.authenticate({ from: address });

      // resets signed provider and web3 instance to kill poller
      await HDProvider.reset();

      return authToken;
    } catch (e) {
      logger.sentry('Hub authenticate failed', e);

      return null;
    }
  }

  return null;
};

export const registerFcmToken = async (
  fcmToken: string,
  walletAddress?: string,
  seedPhrase?: string
): Promise<ReservationData | undefined> => {
  try {
    const network: Network = await getNetwork();
    const hubURL = getHubUrl(network);

    const authToken = await getHubAuthToken(
      hubURL,
      network,
      walletAddress,
      seedPhrase
    );

    if (!authToken) {
      return;
    }

    const results = await axios.post(
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

    if (results.data?.data) {
      return results.data?.data;
    }
  } catch (e: any) {
    logger.sentry('Error while registering fcmToken to hub', e?.response || e);
  }
};

export const getCustodialWallet = async (
  hubURL: string,
  authToken: string
): Promise<CustodialWallet | undefined> => {
  try {
    const results = await axios.get(
      `${hubURL}/api/custodial-wallet`,
      axiosConfig(authToken)
    );

    if (results.data?.data) {
      return await results.data?.data;
    }
  } catch (e) {
    logger.sentry('Error while getting custodial wallet', e);
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
