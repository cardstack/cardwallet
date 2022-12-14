import {
  convertAmountAndPriceToNativeDisplay,
  convertAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { EntityId } from '@reduxjs/toolkit';
import { utils as ethersUtils } from 'ethers';
import { useCallback, useMemo } from 'react';

import {
  useGetAssetsPriceByContractQuery,
  useGetNativeTokensPriceQuery,
} from '@cardstack/services/eoa-assets/coingecko/coingecko-api';
import {
  useGetEOAAssetsQuery,
  useGetCardPayTokensPricesQuery,
  useGetOnChainTokenBalancesQuery,
} from '@cardstack/services/eoa-assets/eoa-assets-api';
import { AssetsDictionary } from '@cardstack/services/eoa-assets/eoa-assets-types';
import { AssetWithNativeType } from '@cardstack/types';

import { useAccountSettings } from '@rainbow-me/hooks';

const emptyState = {
  balance: { amount: '0', display: '' },
};

const useAssets = () => {
  const {
    accountAddress,
    nativeCurrency,
    network,
    isOnCardPayNetwork,
  } = useAccountSettings();

  const {
    data: { assets = {} as AssetsDictionary, ids = [] } = {},
    isLoading: isLoadingAssets,
  } = useGetEOAAssetsQuery(
    {
      accountAddress,
      nativeCurrency,
      network,
    },
    { skip: !accountAddress }
  );

  const {
    data: prices,
    isLoading: isLoadingPrices,
  } = useGetAssetsPriceByContractQuery(
    { addresses: ids, nativeCurrency, network },
    { skip: !ids.length }
  );

  const {
    data: gnosisPrices,
    isLoading: isLoadingGnosisPrices,
  } = useGetCardPayTokensPricesQuery(
    { nativeCurrency },
    { skip: !ids.length || !isOnCardPayNetwork }
  );

  const { data: nativeTokenPrice } = useGetNativeTokensPriceQuery({
    network,
    nativeCurrency,
  });

  const {
    data: balances,
    isLoading: isLoadingBalances,
  } = useGetOnChainTokenBalancesQuery(
    { assets, accountAddress, network },
    { skip: !ids.length }
  );

  const getAsset = useCallback((id: EntityId) => assets[id], [assets]);

  const getAssetPrice = useCallback(
    (id: EntityId) =>
      prices?.[id] ||
      gnosisPrices?.[getAsset(id)?.symbol as string] ||
      nativeTokenPrice?.[id] ||
      0,
    [getAsset, gnosisPrices, nativeTokenPrice, prices]
  );

  const getAssetBalance = useCallback(
    (id: EntityId) => balances?.[id] || emptyState.balance,
    [balances]
  );

  const getAssetNativeCurrencyBalance = useCallback(
    (id: EntityId) =>
      convertAmountAndPriceToNativeDisplay(
        getAssetBalance(id).amount,
        getAssetPrice(id),
        nativeCurrency
      ),
    [getAssetBalance, getAssetPrice, nativeCurrency]
  );

  const assetsIdWithoutNfts = useMemo(
    () =>
      ids.filter(
        id =>
          ethersUtils.isHexString(id) ||
          id === getConstantByNetwork('nativeTokenAddress', network)
      ),
    [ids, network]
  );

  const getTotalAssetNativeBalance = useCallback(
    (idsTosSum: EntityId[]) => {
      const total = idsTosSum.reduce(
        (sum: number, key) =>
          sum + Number(getAssetNativeCurrencyBalance(key).amount),
        0
      );

      return convertAmountToNativeDisplay(total.toString(), nativeCurrency);
    },
    [getAssetNativeCurrencyBalance, nativeCurrency]
  );

  const legacyAssetsStruct = useMemo(
    () =>
      assetsIdWithoutNfts.reduce(
        (legacyAssets, id) => [
          ...legacyAssets,
          {
            ...assets[id],
            balance: getAssetBalance(id),
            native: { balance: getAssetNativeCurrencyBalance(id) },
          },
        ],
        [] as Partial<AssetWithNativeType>[]
      ),
    [
      assetsIdWithoutNfts,
      assets,
      getAssetBalance,
      getAssetNativeCurrencyBalance,
    ]
  );

  const isLoading = useMemo(
    () =>
      isLoadingPrices ||
      isLoadingBalances ||
      isLoadingGnosisPrices ||
      isLoadingAssets,
    [isLoadingAssets, isLoadingBalances, isLoadingGnosisPrices, isLoadingPrices]
  );

  const refresh = useCallback(() => {
    // TODO: refresh data
  }, []);

  return {
    assetsIdWithoutNfts,
    assets,
    assetsIds: ids,
    legacyAssetsStruct,
    isLoading,
    refresh,
    getAsset,
    getAssetPrice,
    getAssetBalance,
    getAssetNativeCurrencyBalance,
    getTotalAssetNativeBalance,
  };
};

export { useAssets };
