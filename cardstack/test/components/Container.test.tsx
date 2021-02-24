import Chance from 'chance';
import React from 'react';

import { render } from '../test-utils';
import { CenteredContainer, Text } from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

const chance = new Chance();

describe('Container', () => {
  it('should render the children without failing', () => {
    const expectedText = chance.string();

    const { getByText } = render(
      <CenteredContainer>
        <Text>{expectedText}</Text>
      </CenteredContainer>
    );

    getByText(expectedText);
  });
});
