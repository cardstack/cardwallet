import { nativeCurrencies, NativeCurrency } from '@cardstack/cardpay-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';

import { Container, SheetHandle, RadioList } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

interface NavParams {
  onCurrencyChange?: (currency: NativeCurrency) => void;
  selectedCurrency: NativeCurrency;
}

const CurrencySelectionGlobalModal = () => {
  const {
    params: { selectedCurrency, onCurrencyChange },
  } = useRoute<RouteType<NavParams>>();

  const { goBack } = useNavigation();

  const onSelectCurrency = useCallback(
    (currency: NativeCurrency) => {
      if (selectedCurrency !== currency) {
        onCurrencyChange?.(currency);
        goBack();
      }
    },
    [selectedCurrency, onCurrencyChange, goBack]
  );

  const items = useMemo(() => {
    const currencyListItems = Object.values(nativeCurrencies)
      .filter(({ currency }) => currency !== NativeCurrency.SPD)
      .map(({ currency, label, ...item }, index) => ({
        ...item,
        disabled: false,
        label: `${label} (${currency})`,
        key: index,
        index: index,
        value: currency,
        selected: currency === selectedCurrency,
      }));

    return [{ data: currencyListItems }];
  }, [selectedCurrency]);

  return (
    <Container flex={1} justifyContent="flex-end" alignItems="center">
      <Container
        width="100%"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        height="50%"
        backgroundColor="white"
        overflow="scroll"
        paddingBottom={10}
      >
        <Container width="100%" alignItems="center" padding={5}>
          <SheetHandle />
        </Container>
        <RadioList items={items} onChange={onSelectCurrency} />
      </Container>
    </Container>
  );
};

export default CurrencySelectionGlobalModal;
