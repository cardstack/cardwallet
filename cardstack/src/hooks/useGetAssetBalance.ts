import { useCallback, useEffect, useState } from 'react';

import { getOnChainAssetBalance } from '@cardstack/services/assets';
import { NetworkType } from '@cardstack/types';

import { Asset } from '@rainbow-me/entities';
import { logger } from '@rainbow-me/utils';

interface UseGetAssetBalanceParams {
  asset: Asset;
  accountAddress: string;
  network: NetworkType;
}

/**
 * get asset balance hook
 */
export const useGetAssetBalance = ({
  asset,
  accountAddress,
  network,
}: UseGetAssetBalanceParams) => {
  const [balance, setBalance] = useState({
    amount: '0',
    display: `0 ${asset.symbol}`,
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
      logger.sentry(
        `useGetAssetBalance for ${asset.symbol} on ${network} failed`,
        e
      );
    }
  }, [accountAddress, asset, network]);

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return balance;
};
