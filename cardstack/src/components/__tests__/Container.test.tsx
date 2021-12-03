import React from 'react';

import { render } from '../../test-utils';
import { CenteredContainer, Text } from '@cardstack/components';

describe('Container', () => {
  it('should render the children without failing', () => {
    const { getByText } = render(
      <CenteredContainer>
        <Text>Hello world</Text>
      </CenteredContainer>
    );

    getByText('Hello world');
  });
});
