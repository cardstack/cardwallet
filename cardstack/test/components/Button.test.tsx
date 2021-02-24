import Chance from 'chance';
import React from 'react';

import { render } from '../test-utils';
import { Button } from '@cardstack/components';

const chance = new Chance();

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

describe('Button', () => {
  it('should render without failing', () => {
    const buttonText = chance.string();

    const { getByText } = render(<Button>{buttonText}</Button>);

    getByText(buttonText);
  });
});
