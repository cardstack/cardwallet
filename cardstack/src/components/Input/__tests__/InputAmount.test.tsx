import Chance from 'chance';
import React from 'react';

import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { render } from '../../../test-utils';
import { InputAmount, CURRENCY_DISPLAY_MODE } from '../';

const chance = new Chance();

describe('InputAmount', () => {
  it.only('should render the field', () => {
    const inputValue = chance.string();
    const setInputValue = jest.fn();
    const nativeCurrency = NativeCurrency.USD;

    const props = {
      currencyDisplayMode: CURRENCY_DISPLAY_MODE.NO_DISPLAY,
      nativeCurrency: NativeCurrency.USD,
      inputValue,
      setInputValue,
    };

    const { getByTestId, getByText, getByDisplayValue } = render(
      <InputAmount {...props} />
    );

    getByDisplayValue(inputValue);
    getByText(nativeCurrency);
    getByTestId('icon-doubleCaret');
  });
});
