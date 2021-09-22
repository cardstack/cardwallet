import Chance from 'chance';
import React from 'react';

import { render } from '../test-utils';
import { Input, InputAmount } from '../../src/components/Input';
import { Text } from '../../src/components/Text';
import { Icon } from '../../src/components/Icon';
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
    const nativeCurrency = 'USD';

    const props = {
      hasCurrencySymbol: false,
      nativeCurrency: 'USD',
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
