import { EntityId } from '@reduxjs/toolkit';

import { EOABaseParams } from '../eoa-assets-types';

type BaseParams = Omit<EOABaseParams, 'accountAddress'>;

export type GetPricesByContractParams = BaseParams & {
  addresses: EntityId[];
};

export type Price = { [key: string]: number };

export interface CoingeckoPriceResponse {
  [key: string]: {
    [key: string]: number;
  };
}

export type GetNativeTokensPricesParams = BaseParams;
