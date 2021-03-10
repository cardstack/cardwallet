import Chance from 'chance';
import React from 'react';

import { render } from '../test-utils';
import { Button } from '../../src/components/Button';
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

  it('should render the icon if iconProps are passed', () => {
    const buttonText = chance.string();

    const iconProps: {
      [key: string]: any;
      name: 'pin';
    } = {
      [chance.string()]: chance.string(),
      name: 'pin',
    };

    render(<Button iconProps={iconProps}>{buttonText}</Button>);

    expect(Icon).toHaveBeenCalledTimes(1);
    expect(Icon).toHaveBeenCalledWith(expect.objectContaining(iconProps), {});
  });

  it('should render the icon with the correct color if iconProps and disabled', () => {
    const buttonText = chance.string();

    const iconProps: {
      [key: string]: any;
      name: 'pin';
    } = {
      [chance.string()]: chance.string(),
      name: 'pin',
    };

    render(
      <Button iconProps={iconProps} disabled>
        {buttonText}
      </Button>
    );

    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({ color: 'blueText' }),
      {}
    );
  });
});
