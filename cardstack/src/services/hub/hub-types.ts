import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { KebabToCamelCaseKeys } from 'globals';

import {
  CustodialWalletAttrs,
  IAPProviderType,
  NetworkType,
} from '@cardstack/types';

export interface HubBaseResponse<Attrs> {
  id: string;
  type: string;
  attributes: Attrs;
}

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
  network: NetworkType;
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

export interface CreateProfileInfoParams {
  name: string;
  slug: string;
  color: string;
  'text-color': string;
  'owner-address'?: string;
}

export type UpdateProfileInfoParams = CreateProfileInfoParams & { id: string };

export interface PostProfilePurchaseQueryParams {
  iapReceipt: string;
  provider: IAPProviderType;
  profileInfo?: CreateProfileInfoParams;
}

export interface GetValidateProfileSlugParams {
  slug: string;
}

export interface PostProfilePurchaseQueryResult
  extends HubBaseResponse<CreateProfileInfoParams & { did: string }> {
  included: [
    {
      id: string;
      type: 'job-tickets';
      attributes: {
        state: string;
      };
    }
  ];
}

export type JobStateType = 'pending' | 'success' | 'failed';

export type JobTicketTypeResult = HubBaseResponse<{
  'job-type': string | 'create-profile';
  state: JobStateType;
  result: {
    id: string;
  };
}>;
