import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { orderBy } from 'lodash';

import {
  CustodialWallet,
  Inventory,
  InventoryWithPrice,
  WyrePriceData,
} from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { Network } from '@rainbow-me/helpers/networkTypes';

import { hubApi } from '../hub-api';
import { GetCustodialWalletQueryResult } from '../hub-types';

type BaseQueryReturn<T> = QueryReturnValue<{ data?: T }, FetchBaseQueryError>;

const routes = {
  custodialWallet: '/custodial-wallet',
  wyrePrices: '/wyre-prices',
  inventories: '/inventories',
};

export const hubWyre = hubApi.injectEndpoints({
  endpoints: builder => ({
    getCustodialWallet: builder.query<GetCustodialWalletQueryResult, void>({
      query: () => routes.custodialWallet,
      transformResponse: (response: { data: CustodialWallet }) =>
        transformObjKeysToCamelCase(response?.data?.attributes),
    }),
    getProducts: builder.query<InventoryWithPrice[], Network>({
      async queryFn(network, _queryApi, _extraOptions, fetchWithBQ) {
        const prices = (await fetchWithBQ(
          routes.wyrePrices
        )) as BaseQueryReturn<WyrePriceData[]>;

        const inventories = (await fetchWithBQ(
          routes.inventories
        )) as BaseQueryReturn<Inventory[]>;

        const error = inventories.error || prices.error;

        if (error) {
          return { error };
        }

        const products = inventories.data.data?.reduce(
          (inventoryWithPrice = [], inventory) => {
            const wyreIssuer = getAddressByNetwork('wyreIssuer', network);

            const { issuer, sku } = inventory.attributes;

            if (issuer === wyreIssuer) {
              const skuPrice = prices.data.data?.find(
                price => price.id === sku
              );

              if (skuPrice) {
                inventoryWithPrice.push({
                  ...transformObjKeysToCamelCase(inventory.attributes),
                  ...transformObjKeysToCamelCase(skuPrice.attributes),
                });
              }
            }

            return inventoryWithPrice;
          },
          [] as InventoryWithPrice[]
        );

        const orderedProducts = orderBy(products, 'sourceCurrencyPrice', 'asc');

        return { data: orderedProducts };
      },
    }),
  }),
});

export const { useGetCustodialWalletQuery, useGetProductsQuery } = hubWyre;
