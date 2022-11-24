import { currencies, isCardPaySupportedNetwork } from '@cardstack/cardpay-sdk';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { settingsChangeNativeCurrency as changeNativeCurrency } from '../redux/settings';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

export default function useAccountSettings() {
  const dispatch = useDispatch();
  const settingsData = useRainbowSelector(
    ({ settings: { accountAddress, chainId, nativeCurrency, network } }) => ({
      accountAddress,
      chainId,
      nativeCurrency,
      nativeCurrencySymbol: currencies[nativeCurrency].symbol,
      nativeCurrencyInfo: currencies[nativeCurrency],
      network,
    })
  );

  const settingsChangeNativeCurrency = useCallback(
    currency => dispatch(changeNativeCurrency(currency)),
    [dispatch]
  );

  const isOnCardPayNetwork = useMemo(
    () => isCardPaySupportedNetwork(settingsData.network),
    [settingsData.network]
  );

  const noCardPayAccount = useMemo(
    () => !settingsData.accountAddress || !isOnCardPayNetwork,
    [isOnCardPayNetwork, settingsData.accountAddress]
  );

  return {
    settingsChangeNativeCurrency,
    ...settingsData,
    noCardPayAccount,
    isOnCardPayNetwork,
  };
}
