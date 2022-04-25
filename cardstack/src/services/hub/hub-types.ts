import { KebabToCamelCaseKeys } from 'globals';

import { CustodialWalletAttrs } from '@cardstack/types';

export type GetCustodialWalletQueryResult = KebabToCamelCaseKeys<CustodialWalletAttrs>;

export interface RequestCardDropQueryParams {
  email: string;
}
