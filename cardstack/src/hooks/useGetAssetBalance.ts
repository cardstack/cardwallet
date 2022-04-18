import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useCallback, useEffect, useState } from 'react';

import { getOnChainAssetBalance } from '@cardstack/services/assets';

import { Asset } from '@rainbow-me/entities';
import { Network } from '@rainbow-me/helpers/networkTypes';

interface UseGetAssetBalanceParams {
  asset: Asset;
  accountAddress: string;
  network: Network;
}

/**
 * get asset balance hook
 */
export const useGetAssetBalance = ({
  asset,
  accountAddress,
  network,
}: UseGetAssetBalanceParams) => {
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const [balance, setBalance] = useState({
    amount: '0',
    display: `0 ${nativeTokenSymbol}`,
  });

  const getBalance = useCallback(async () => {
    try {
      const tokenBalance = await getOnChainAssetBalance({
        asset,
        accountAddress,
        network,
      });

      setBalance(tokenBalance);
    } catch (e) {
      console.log(e);
    }
  }, [accountAddress, asset, network]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return balance;
};
