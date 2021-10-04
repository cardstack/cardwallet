import React, { useCallback } from 'react';
import supportedNativeCurrencies from '@cardstack/cardpay-sdk/sdk/native-currencies';
import { RadioList } from '../';
import usePayment from '@cardstack/redux/hooks/usePayment';

export const CurrencySelection = ({
  onChange,
}: {
  onChange: (selectedCurrency: string) => void;
}) => {
  const { paymentChangeCurrency, currency: paymentCurrency } = usePayment();

  const onSelectCurrency = useCallback(
    (selectedCurrency: string) => {
      if (paymentCurrency !== selectedCurrency) {
        paymentChangeCurrency(selectedCurrency);
        onChange(selectedCurrency);
      }
    },
    [paymentCurrency, paymentChangeCurrency, onChange]
  );

  const currencyListItems = Object.values(supportedNativeCurrencies)
    .filter(
      ({ currency }) =>
        currency !== 'ETH' && currency !== 'DAI' && currency !== 'CARD'
    )
    .map(({ currency, label, ...item }, index) => ({
      ...item,
      disabled: false,
      label: `${label} (${currency === 'SPD' ? '§1 = 0.01 USD' : currency})`,
      key: index,
      index: index,
      value: currency,
      selected: currency === paymentCurrency,
    }));

  return (
    <RadioList
      items={[{ data: currencyListItems }]}
      onChange={onSelectCurrency}
    />
  );
};
