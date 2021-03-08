import Chance from 'chance';
import React from 'react';

import { render } from '../test-utils';
import { Button } from '../../src/components/Button';
import { Text } from '../../src/components/Text';
import * as utils from '@cardstack/utils';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

jest.mock('@cardstack/components/Text', () => ({
  Text: jest.fn(({ children }) => children),
}));

jest.mock('@cardstack/utils');

const chance = new Chance();

describe('Button', () => {
  let expectedTextStyle: object, expectedDisabledTextStyle: object;

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
    const buttonText = chance.string();

    render(<Button>{buttonText}</Button>);

    expect(Text).toHaveBeenCalledWith(
      expect.objectContaining({ children: buttonText }),
      {}
    );
  });

  it('should call useVariantValue four times', () => {
    const buttonText = chance.string();
    const variant = chance.pickone<'secondary' | 'blue'>(['secondary', 'blue']);

    render(<Button variant={variant}>{buttonText}</Button>);

    expect(useVariantValue).toHaveBeenCalledTimes(4);
    expect(useVariantValue).toHaveBeenCalledWith(
      'buttonVariants',
      'width',
      variant
    );

    expect(useVariantValue).toHaveBeenCalledWith(
      'buttonVariants',
      'maxWidth',
      variant
    );

    expect(useVariantValue).toHaveBeenCalledWith(
      'buttonVariants',
      'textStyle',
      variant
    );

    expect(useVariantValue).toHaveBeenCalledWith(
      'buttonVariants',
      'disabledTextStyle',
      variant
    );
  });

  it('should pass the variant return value to text', () => {
    const buttonText = chance.string();

    const variant = chance.pickone<'secondary' | 'blue'>(['secondary', 'blue']);

    render(<Button variant={variant}>{buttonText}</Button>);

    expect(Text).toHaveBeenCalledWith(
      expect.objectContaining(expectedTextStyle),
      {}
    );
  });

  it('should handle disabled styles', () => {
    const buttonText = chance.string();

    const { getByTestId } = render(<Button disabled>{buttonText}</Button>);

    expect(Text).toHaveBeenCalledWith(
      expect.objectContaining(expectedDisabledTextStyle),
      {}
    );

    getByTestId('disabledOverlay');
  });
});
