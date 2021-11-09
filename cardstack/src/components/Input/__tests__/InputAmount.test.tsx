import Chance from 'chance';
import React from 'react';

import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { render } from '../../../test-utils';
import { Input, InputAmount, CURRENCY_DISPLAY_MODE } from '..';
import { Text } from '../../Text';
import { Icon } from '../../Icon';
import * as utils from '@cardstack/utils';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

jest.mock('@cardstack/components/Icon', () => ({
  Icon: jest.fn(() => null),
}));

jest.mock('@cardstack/components/Text', () => ({
  Text: jest.fn(({ children }) => children),
}));

jest.mock('@cardstack/utils');

const chance = new Chance();

describe('Button', () => {
  let expectedTextStyle: Record<string, string>,
    expectedDisabledTextStyle: Record<string, string>;

  const { useVariantValue } = utils as jest.Mocked<typeof utils>;

  beforeEach(() => {
    expectedTextStyle = {
      [chance.string()]: chance.string(),
    };

    expectedDisabledTextStyle = {
      [chance.string()]: chance.string(),
    };

    useVariantValue.mockImplementation((themeKey, key) => {
      if (key === 'disabledTextStyle') {
        return expectedDisabledTextStyle;
      }

      return expectedTextStyle;
    });
  });

  afterEach(() => {
    useVariantValue.mockReset();
  });

  it('should render the children', () => {
    const inputValue = chance.string();
    const setInputValue = jest.fn();
    const nativeCurrency = NativeCurrency.USD;

    const props = {
      currencyDisplayMode: CURRENCY_DISPLAY_MODE.NO_DISPLAY,
      nativeCurrency: NativeCurrency.USD,
      inputValue,
      setInputValue,
    };

    render(<InputAmount {...props} />);

    expect(Input).toHaveBeenCalledWith(
      expect.objectContaining({
        value: inputValue,
      }),
      {}
    );

    expect(Text).toHaveBeenCalledWith(
      expect.objectContaining(nativeCurrency),
      {}
    );

    expect(Icon).toHaveBeenCalledTimes(1);
  });
});
