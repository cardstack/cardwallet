import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { KebabToCamelCaseKeys } from 'globals';

import { CustodialWalletAttrs } from '@cardstack/types';

import { Network } from '@rainbow-me/helpers/networkTypes';

// Note on baseQuery extraOptions, it works only with optional properties.
export interface BaseQueryExtraOptions {
  authenticate?: boolean;
}

export type GetCustodialWalletQueryResult = KebabToCamelCaseKeys<CustodialWalletAttrs>;

export interface RequestCardDropQueryParams {
  email: string;
}

export interface GetEoaClaimedQueryParams {
  eoa: string;
}

export type EoaClaimedAttrsType = {
  timestamp: string;
  'owner-address': string;
  'show-banner': boolean;
  claimed: boolean;
};

export type GetEoaClaimedQueryResult = KebabToCamelCaseKeys<EoaClaimedAttrsType>;

export interface CheckHubAuthQueryParams {
  accountAddress: string;
  network: Network;
}

export interface RegisterFCMTokenQueryParams {
  fcmToken: string;
}

export interface GetExchangeRatesQueryParams {
  from: NativeCurrency | string;
  to: NativeCurrency | string;
  date: string | number;
  e?: 'kucoin' | string;
}
