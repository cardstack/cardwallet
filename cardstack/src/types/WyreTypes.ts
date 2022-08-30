import { KebabToCamelCaseKeys } from 'globals';

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

export type OrderStatus =
  | 'waiting-for-order'
  | 'received-order'
  | 'waiting-for-reservation'
  | 'provisioning'
  | 'error-provisioning'
  | 'complete';

export interface OrderAttrs {
  'order-id': string;
  'user-address': string;
  'wallet-id': string;
  status: OrderStatus;
}

export interface WyrePriceAttrs {
  'source-currency': string;
  'dest-currency': string;
  'source-currency-price': number;
  'includes-fee': boolean;
}

export type CustodialWallet = HubBaseResponse<CustodialWalletAttrs>;

export type Inventory = HubBaseResponse<InventoryAttrs>;

export type GetProductsQueryResult = Array<
  KebabToCamelCaseKeys<InventoryAttrs> & KebabToCamelCaseKeys<WyrePriceAttrs>
>;

export type ReservationQueryResult = HubBaseResponse<ReservationAttrs>;

export type WyrePriceQueryResult = HubBaseResponse<WyrePriceAttrs>;

export type OrderQueryResult = HubBaseResponse<OrderAttrs>;
