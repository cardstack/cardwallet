import {
  convertAmountAndPriceToNativeDisplay,
  convertAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { EntityId } from '@reduxjs/toolkit';
import { BN } from 'ethereumjs-util';
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
  } = useGetEOAAssetsQuery(
    {
      accountAddress,
      nativeCurrency,
      network,
    },
    { skip: !accountAddress }
  );

  const { data: prices } = useGetAssetsPriceByContractQuery(
    { addresses: ids, nativeCurrency, network },
    { skip: !ids.length }
  );

  const { data: gnosisPrices } = useGetCardPayTokensPricesQuery(
    { nativeCurrency },
    { skip: !ids.length || !isOnCardPayNetwork }
  );

  const { data: nativeTokenPrice } = useGetNativeTokensPriceQuery({
    network,
    nativeCurrency,
  });

  const { data: balances } = useGetOnChainTokenBalancesQuery(
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

  const getTotalAssetsNativeBalance = useMemo(() => {
    const assetsWithoutNfts = ids.filter(
      id =>
        ethersUtils.isHexString(id) ||
        id === getConstantByNetwork('nativeTokenAddress', network)
    );

    const total = assetsWithoutNfts.reduce(
      (sum, key) => sum.add(new BN(getAssetBalance(key).amount)),
      new BN(0)
    );

    return convertAmountToNativeDisplay(total.toString(), nativeCurrency);
  }, [getAssetBalance, ids, nativeCurrency, network]);

  return {
    getAsset,
    getAssetPrice,
    getAssetBalance,
    getAssetNativeCurrencyBalance,
    getTotalAssetsNativeBalance,
  };
};

export { useAssets };
