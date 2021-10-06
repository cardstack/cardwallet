import axios from 'axios';
import { fromWei } from '@cardstack/cardpay-sdk';
import { PrepaidCardCustomization } from '@cardstack/types';
import logger from 'logger';

export const axiosService = (authToken: string) => {
  return axios.create({
    baseURL: 'https://hub-staging.stack.cards/',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer: ${authToken}`,
      Accept: 'application/vnd.api+json',
    },
  });
};

export interface CustodialWalletAttrs {
  'wyre-wallet-id': string;
  'user-address': string;
  'deposit-address': string;
}

export interface CustodialWallet {
  id: string;
  type: string;
  attributes: CustodialWalletAttrs;
}

export interface Inventory {
  id: string;
  type: string;
  isSelected: boolean;
  amount: number;
  attributes: InventoryAttrs;
}

export interface InventoryAttrs {
  issuer: string;
  sku: string;
  'issuing-token-symbol': string;
  'issuing-token-address': string;
  'face-value': number;
  'ask-price': string;
  'customization-DID': PrepaidCardCustomization;
  quantity: number;
  reloadable: boolean;
  transferrable: boolean;
}

export interface ReservationData {
  id: string;
  type: string;
  attributes: ReservationAttrs;
}

export interface ReservationAttrs {
  'user-address': string;
  sku: string;
  'transaction-hash': null;
  'prepaid-card-address': null;
}

export const getCustodialWallet = async (
  hubURL: string,
  authToken: string
): Promise<CustodialWallet | undefined> => {
  try {
    const results = await axiosService(authToken).get(
      `${hubURL}/api/custodial-wallet`
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
  authToken: string
): Promise<Inventory[] | undefined> => {
  try {
    const results = await axiosService(authToken).get('/api/inventories');

    if (results?.data?.data) {
      const inventory = results?.data?.data;

      return inventory
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
    return await axiosService(authToken).post(
      `${hubURL}/api/reservations`,
      JSON.stringify({
        data: {
          type: 'reservations',
          attributes: {
            sku,
          },
        },
      })
    );
  } catch (e) {
    logger.sentry('Error while making reservation', e.response.error);
  }
};
