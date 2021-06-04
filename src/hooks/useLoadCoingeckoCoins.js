import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCoingeckoCoins } from '@rainbow-me/redux/coingecko';
import coingeckoIdsFallback from '@rainbow-me/references/coingecko/ids.json';

export default function useLoadCoingeckoCoins() {
  const dispatch = useDispatch();

  const loadCoingeckoCoins = useCallback(async () => {
    try {
      const request = await fetch(
        'https://api.coingecko.com/api/v3/coins/list?include_platform=true&asset_platform_id=ethereum'
      );
      const coingeckoCoins = await request.json();

      dispatch(setCoingeckoCoins(coingeckoCoins));
    } catch (error) {
      dispatch(setCoingeckoCoins(coingeckoIdsFallback));
    }
  }, [dispatch]);

  return loadCoingeckoCoins;
}
