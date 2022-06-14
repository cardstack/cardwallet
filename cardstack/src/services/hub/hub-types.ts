import { KebabToCamelCaseKeys } from 'globals';

import { CustodialWalletAttrs } from '@cardstack/types';

import { Network } from '@rainbow-me/helpers/networkTypes';
import { string } from 'prop-types';

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
  claimed: boolean;
  'owner-address': string;
  'rate-limited': boolean;
};

export type GetEoaClaimedQueryResult = KebabToCamelCaseKeys<EoaClaimedAttrsType>;

export interface CheckHubAuthQueryParams {
  accountAddress: string;
  network: Network;
}

export interface RegisterFCMTokenQueryParams {
  fcmToken: string;
}
