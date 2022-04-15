import React from 'react';

import { CenteredContainer } from '@cardstack/components/Container/Container';
import { Text } from '@cardstack/components/Text/Text';

import { render } from '../../test-utils';

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
