import { NativeCurrency } from '@cardstack/cardpay-sdk';
import React from 'react';

import { render } from '../../../test-utils';
import { CURRENCY_DISPLAY_MODE, InputAmount } from '../InputAmount/InputAmount';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useAccountSettings: () => ({
    nativeCurrency: 'USD',
  }),
}));

describe('InputAmount', () => {
  it('should render the children', () => {
    const inputValue = '42';
    const setInputValue = jest.fn();
    const nativeCurrency = NativeCurrency.USD;

    const props = {
      currencyDisplayMode: CURRENCY_DISPLAY_MODE.NO_DISPLAY,
      selectedCurrency: nativeCurrency,
      onCurrencyChange: jest.fn(),
      inputValue,
      setInputValue,
    };

    const { getByDisplayValue, getByText } = render(<InputAmount {...props} />);

    getByDisplayValue(inputValue);
    getByText(nativeCurrency);
  });
});
