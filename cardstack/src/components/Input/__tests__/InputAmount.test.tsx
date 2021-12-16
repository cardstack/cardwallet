import React from 'react';

import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { render } from '../../../test-utils';
import { InputAmount, CURRENCY_DISPLAY_MODE } from '../InputAmount';

jest.mock('@rainbow-me/navigation/', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

describe('InputAmount', () => {
  it('should render the children', () => {
    const inputValue = '42';
    const setInputValue = jest.fn();
    const nativeCurrency = NativeCurrency.USD;

    const props = {
      currencyDisplayMode: CURRENCY_DISPLAY_MODE.NO_DISPLAY,
      nativeCurrency: nativeCurrency,
      inputValue,
      setInputValue,
    };

    const { getByDisplayValue, getByText } = render(<InputAmount {...props} />);

    getByDisplayValue(inputValue);
    getByText(nativeCurrency);
  });
});
