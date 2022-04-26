import { KebabToCamelCaseKeys } from 'globals';

import { CustodialWalletAttrs } from '@cardstack/types';

export type GetCustodialWalletQueryResult = KebabToCamelCaseKeys<CustodialWalletAttrs>;

export interface RequestCardDropQueryParams {
  email: string;
}

export interface GetEoaClaimedQueryParams {
  eoa: string;
}

export type GetEoaClaimedResultType = boolean;

// Note on baseQuery extraOptions, it works only with optional properties.
export interface BaseQueryExtraOptions {
  authenticate?: boolean;
}
