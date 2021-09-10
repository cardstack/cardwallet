import analytics from '@segment/analytics-react-native';
import { isNil } from 'lodash';
import React, { useCallback } from 'react';
import { CoinIcon, EmojiText, RadioList, RadioListItem } from '../';
import { useAccountSettings } from '@rainbow-me/hooks';
import { supportedNativeCurrencies } from '@rainbow-me/references';

const renderCurrencyIcon = (currency, emojiName) => {
  if (!currency) return null;
  if (!isNil(emojiName)) return <EmojiText name={'flag_' + emojiName} />;

  return <CoinIcon address={currency} size={23} symbol={currency} />;
};

const CurrencyListItem = ({ currency, emojiName, label, ...item }) => (
  <RadioListItem
    {...item}
    icon={renderCurrencyIcon(currency, emojiName)}
    label={`${label}`}
    value={currency}
  />
);

const CurrencySection = () => {
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

  return (
    <RadioList
      items={currencyListItems}
      onChange={onSelectCurrency}
      // value={nativeCurrency}
    />
  );
};

export default CurrencySection;
