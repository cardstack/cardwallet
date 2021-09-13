import analytics from '@segment/analytics-react-native';
import React, { useCallback } from 'react';
import { RadioList } from '../';
import { useAccountSettings } from '@rainbow-me/hooks';
import { supportedNativeCurrencies } from '@rainbow-me/references';

// ToDo: Refactor RadioListItem with ability to show icon like i.e. renderCurrencyIcon

export const CurrencySelection = () => {
  const { nativeCurrency, settingsChangeNativeCurrency } = useAccountSettings();

  const onSelectCurrency = useCallback(
    currency => {
      settingsChangeNativeCurrency(currency);
      analytics.track('Changed native currency', { currency });
    },
    [settingsChangeNativeCurrency]
  );

  const currencyListItems = Object.values(supportedNativeCurrencies)
    .map(({ currency, ...item }, index) => ({
      title: currency,
      data: [
        {
          ...item,
          disabled: false,
          label: currency,
          key: index,
          value: currency,
          default: !!currency,
          selected: currency === nativeCurrency,
        },
      ],
    }))
    .filter(({ title }) => title !== 'ETH');

  return <RadioList items={currencyListItems} onChange={onSelectCurrency} />;
};
