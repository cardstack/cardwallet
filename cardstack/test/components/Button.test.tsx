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
  let expectedTextStyle: object;

  const { useVariantValue } = utils as jest.Mocked<typeof utils>;

  beforeEach(() => {
    expectedTextStyle = {
      [chance.string()]: chance.string(),
    };

    useVariantValue.mockReturnValue(expectedTextStyle);
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

  it('should call useVariantValue and the return value to text', () => {
    const buttonText = chance.string();

    const variant = chance.pickone<'secondary' | 'blue'>(['secondary', 'blue']);

    render(<Button variant={variant}>{buttonText}</Button>);

    expect(useVariantValue).toHaveBeenCalledTimes(1);
    expect(useVariantValue).toHaveBeenCalledWith(
      'buttonVariants',
      'textStyle',
      variant
    );

    expect(Text).toHaveBeenCalledWith(
      expect.objectContaining(expectedTextStyle),
      {}
    );
  });
});
