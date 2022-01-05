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
  'customization-DID'?: string;
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

export interface OrderAttrs {
  'order-id': string;
  'user-address': string;
  'wallet-id': string;
  status: string;
}

export interface OrderData {
  id: string;
  type: string;
  attributes: OrderAttrs;
  prepaidCardAddress?: string;
}

export interface WyrePriceData {
  id: string;
  type: string;
  attributes: WyrePriceAttrs;
}

export interface WyrePriceAttrs {
  'source-currency': string;
  'dest-currency': string;
  'source-currency-price': number;
  'includes-fee': boolean;
}
