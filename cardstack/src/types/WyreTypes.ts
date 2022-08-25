import { KebabToCamelCase, KebabToCamelCaseKeys } from 'globals';

import { HubBaseResponse } from '@cardstack/services/hub/hub-types';

export interface CustodialWalletAttrs {
  'wyre-wallet-id': string;
  'user-address': string;
  'deposit-address': string;
}

export interface InventoryAttrs {
  issuer: string;
  sku: string;
  'issuing-token-symbol': string;
  'issuing-token-address': string;
  'face-value': number;
  'ask-price': string;
  'customization-DID'?: string;
  quantity: number;
  reloadable: boolean;
  transferrable: boolean;
}

export interface ReservationAttrs {
  'user-address': string;
  sku: string;
  'transaction-hash': null;
  'prepaid-card-address': null;
}

export interface OrderAttrs {
  'order-id': string;
  'user-address': string;
  'wallet-id': string;
  status: string;
}

export interface WyrePriceAttrs {
  'source-currency': string;
  'dest-currency': string;
  'source-currency-price': number;
  'includes-fee': boolean;
}

export type CustodialWallet = HubBaseResponse<CustodialWalletAttrs>;

export type Inventory = HubBaseResponse<InventoryAttrs>;

export type InventoryWithPrice = KebabToCamelCaseKeys<InventoryAttrs> &
  KebabToCamelCaseKeys<WyrePriceAttrs>;

export type ReservationData = HubBaseResponse<ReservationAttrs>;

export type WyrePriceData = HubBaseResponse<WyrePriceAttrs>;

export interface OrderData extends HubBaseResponse<OrderAttrs> {
  prepaidCardAddress?: string;
}
