import React, { memo } from 'react';

import { Container, Text } from '@cardstack/components';

interface WordItemProps {
  word: string;
  index: number;
  showAsError: boolean;
}

const WordItem = ({ word, index, showAsError }: WordItemProps) => (
  <Container flexDirection="row" alignItems="flex-end">
    <Container width={30}>
      <Text
        textAlign="right"
        variant="semibold"
        size="body"
        color="white"
        paddingRight={2}
      >
        {index + 1}
      </Text>
    </Container>
    {word ? (
      <Text
        variant="semibold"
        size="body"
        color={showAsError ? 'invalid' : 'teal'}
      >
        {word}
      </Text>
    ) : (
      <Container
        backgroundColor={showAsError ? 'invalid' : 'teal'}
        width={97}
        height={1}
        marginBottom={1}
      />
    )}
  </Container>
);

export default memo(WordItem);
