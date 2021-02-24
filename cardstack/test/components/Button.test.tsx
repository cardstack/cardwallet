import Chance from 'chance';
import React from 'react';

import { render } from '../test-utils';
import { Button } from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

const chance = new Chance();

describe('Button', () => {
  it('should render the children', () => {
    const buttonText = chance.string();

    const { getByText } = render(<Button>{buttonText}</Button>);

    getByText(buttonText);
  });
});
