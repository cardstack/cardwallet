import React from 'react';
import { CenteredContainer, Text } from '@cardstack/components';
import { neverRerender } from '@rainbow-me/utils';

const NoResults = () => {
  return (
    <CenteredContainer centered margin={3}>
      <Text color="backgroundBlue" size="lmedium" weight="medium">
        No results found
      </Text>
    </CenteredContainer>
  );
};

export default neverRerender(NoResults);
