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
import { jsTimestampToUnixString } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

const emptyState = {
  balance: { amount: '0', display: '' },
};

const pollingInterval = {
  ten_seconds: 10000,
  one_minute: 60000,
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
    isFetching: isRefetchingAssets,
    refetch: refetchAssets,
    fulfilledTimeStamp: assetsFulfilledTimeStamp = 0,
  } = useGetEOAAssetsQuery(
    {
      accountAddress,
      nativeCurrency,
      network,
    },
    {
      skip: !accountAddress,
      refetchOnMountOrArgChange: pollingInterval.one_minute,
    }
  );

  const {
    data: prices,
    isLoading: isLoadingPrices,
    refetch: refetchPrices,
  } = useGetAssetsPriceByContractQuery(
    { addresses: ids, nativeCurrency, network },
    { skip: !ids.length, pollingInterval: pollingInterval.ten_seconds }
  );

  const {
    data: gnosisPrices,
    isLoading: isLoadingGnosisPrices,
    refetch: refetchGnosisPrices,
  } = useGetCardPayTokensPricesQuery(
    { nativeCurrency },
    {
      skip: !ids.length || !isOnCardPayNetwork,
      pollingInterval: pollingInterval.one_minute,
    }
  );

  const {
    data: nativeTokenPrice,
    refetch: refetchNativePrice,
    isLoading: isLoadingNativePrice,
  } = useGetNativeTokensPriceQuery(
    {
      network,
      nativeCurrency,
    },
    { pollingInterval: pollingInterval.ten_seconds }
  );

  const {
    data: balances,
    isLoading: isLoadingBalances,
    refetch: refetchBalances,
    isFetching: isRefetchingBalances,
    fulfilledTimeStamp: balancesFullfiledTimestamp = 0,
  } = useGetOnChainTokenBalancesQuery(
    { assets, accountAddress, network },
    {
      skip: !ids.length,
      refetchOnMountOrArgChange: pollingInterval.one_minute,
    }
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

  const refresh = useCallback(() => {
    if (isOnCardPayNetwork) {
      refetchGnosisPrices();
    }

    refetchAssets();
    refetchBalances();
    refetchPrices();
    refetchNativePrice();
  }, [
    isOnCardPayNetwork,
    refetchAssets,
    refetchBalances,
    refetchGnosisPrices,
    refetchNativePrice,
    refetchPrices,
  ]);

  const isLoading = useMemo(
    () =>
      isLoadingPrices ||
      isLoadingBalances ||
      isLoadingGnosisPrices ||
      isLoadingAssets ||
      isLoadingNativePrice,
    [
      isLoadingAssets,
      isLoadingBalances,
      isLoadingGnosisPrices,
      isLoadingNativePrice,
      isLoadingPrices,
    ]
  );

  const isRefetching = useMemo(
    () => isRefetchingBalances || isRefetchingAssets,
    [isRefetchingAssets, isRefetchingBalances]
  );

  const unixFulfilledTimestamp = useMemo(() => {
    const timestamps = [balancesFullfiledTimestamp, assetsFulfilledTimeStamp];
    const latestTimestamp = Math.max(...timestamps);

    return jsTimestampToUnixString(latestTimestamp);
  }, [assetsFulfilledTimeStamp, balancesFullfiledTimestamp]);

  return {
    assetsIdWithoutNfts,
    assets,
    assetsIds: ids,
    legacyAssetsStruct,
    isLoading,
    isRefetching,
    unixFulfilledTimestamp,
    refresh,
    refetchBalances,
    getAsset,
    getAssetPrice,
    getAssetBalance,
    getAssetNativeCurrencyBalance,
    getTotalAssetNativeBalance,
  };
};

export { useAssets };
