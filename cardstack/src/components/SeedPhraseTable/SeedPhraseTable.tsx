import React, { useMemo } from 'react';

import { Container, Text } from '@cardstack/components';

interface SeedPhraseTableProps {
  seedPhrase: string;
  mode: 'view' | 'validate' | 'input';
}

const WordItem = ({
  word,
  index,
  state,
}: {
  word: string;
  index: number;
  state: 'filled' | 'empty' | 'error';
}) => (
  <Container flexDirection="row">
    <Text variant="semibold" size="body" color="white" paddingRight={2}>
      {index + 1}
    </Text>
    <Text variant="semibold" size="body" color="teal">
      {word}
    </Text>
  </Container>
);

export const SeedPhraseTable = ({ seedPhrase, mode }: SeedPhraseTableProps) => {
  const wordsColumns = useMemo(() => {
    const words = seedPhrase.split(' ');

    const filledArray = words
      .fill('', words.length, 12) // does not add more items
      .map((word, index) => ({ word, index }));

    return [filledArray.slice(0, 6), filledArray.slice(6)];
  }, [seedPhrase]);

  return (
    <Container
      backgroundColor="darkBoxBackground"
      borderRadius={20}
      padding={8}
      flexDirection="row"
      justifyContent="space-between"
    >
      {wordsColumns.map(column => (
        <Container width="50%">
          {column.map(item => (
            <WordItem word={item.word} index={item.index} state="filled" />
          ))}
        </Container>
      ))}
    </Container>
  );
};
