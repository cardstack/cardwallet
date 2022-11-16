import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { orderBy } from 'lodash';

import {
  CustodialWallet,
  Inventory,
  GetProductsQueryResult,
  OrderQueryResult,
  ReservationQueryResult,
  WyrePriceQueryResult,
  OrderStatus,
  NetworkType,
} from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { hubApi } from '../hub-api';
import { hubBodyBuilder } from '../hub-service';
import { GetCustodialWalletQueryResult } from '../hub-types';

type BaseQueryReturn<T> = QueryReturnValue<{ data?: T }, FetchBaseQueryError>;

const routes = {
  custodialWallet: '/custodial-wallet',
  wyrePrices: '/wyre-prices',
  inventories: '/inventories',
  reservations: '/reservations',
  orders: '/orders',
};

export const hubWyre = hubApi.injectEndpoints({
  endpoints: builder => ({
    getCustodialWallet: builder.query<GetCustodialWalletQueryResult, void>({
      query: () => routes.custodialWallet,
      transformResponse: (response: { data: CustodialWallet }) =>
        transformObjKeysToCamelCase(response?.data?.attributes),
    }),
    getProducts: builder.query<GetProductsQueryResult, NetworkType>({
      async queryFn(network, _queryApi, _extraOptions, fetchWithBQ) {
        const prices = (await fetchWithBQ(
          routes.wyrePrices
        )) as BaseQueryReturn<WyrePriceQueryResult[]>;

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
          [] as GetProductsQueryResult
        );

        const orderedProducts = orderBy(products, 'sourceCurrencyPrice', 'asc');

        return { data: orderedProducts };
      },
    }),
    makeReservation: builder.mutation<ReservationQueryResult, { sku: string }>({
      query: params => ({
        url: routes.reservations,
        method: 'POST',
        body: hubBodyBuilder(routes.reservations, params),
      }),
      transformResponse: (response: { data: ReservationQueryResult }) =>
        response?.data,
    }),
    updateOrder: builder.mutation<
      OrderQueryResult,
      { wyreOrderId: string; walletId: string; reservationId: string }
    >({
      query: ({ wyreOrderId, walletId, reservationId }) => ({
        url: routes.orders,
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'orders',
            attributes: {
              'order-id': wyreOrderId,
              'wallet-id': walletId,
            },
            relationships: {
              reservation: {
                data: { type: 'reservations', id: reservationId },
              },
            },
          },
        }),
      }),
      transformResponse: (response: { data: OrderQueryResult }) =>
        response.data,
    }),
    getOrderStatus: builder.query<OrderStatus, { orderId: string }>({
      query: ({ orderId }) => ({
        url: `${routes.orders}/${orderId}`,
      }),
      transformResponse: (response: { data: OrderQueryResult }) =>
        response.data?.attributes?.status,
    }),
  }),
});

export const {
  useGetCustodialWalletQuery,
  useGetProductsQuery,
  useMakeReservationMutation,
  useUpdateOrderMutation,
  useGetOrderStatusQuery,
} = hubWyre;
