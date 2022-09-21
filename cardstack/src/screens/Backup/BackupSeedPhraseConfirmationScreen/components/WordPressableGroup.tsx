import React, { memo } from 'react';

import { Container, WordPressable } from '@cardstack/components';

interface Props {
  words: Array<string>;
  selectedWordsIndexes?: Array<number>;
  onWordPressed?: (index: number) => void;
}

export const WordPressableGroup = memo(
  ({ words, selectedWordsIndexes = [], onWordPressed }: Props) => {
    return (
      <Container flexDirection="row" justifyContent="center" flexWrap="wrap">
        {words.map((tag: string, index: number) => (
          <Container padding={1}>
            <WordPressable
              text={tag}
              disabled={selectedWordsIndexes.includes(index)}
              onPress={() => onWordPressed?.(index)}
            />
          </Container>
        ))}
      </Container>
    );
  }
);
