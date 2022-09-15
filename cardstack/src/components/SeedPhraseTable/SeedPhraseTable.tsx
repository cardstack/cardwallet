import React, { useMemo, memo } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  Text,
} from '@cardstack/components';
import { useBooleanState, useCopyToast } from '@cardstack/hooks';

import { strings } from './strings';

interface SeedPhraseTableProps {
  seedPhrase: string;
  hideOnOpen?: boolean;
  allowCopy?: boolean;
  showAsError?: boolean;
}

const WordItem = memo(
  ({
    word,
    index,
    showAsError,
  }: {
    word: string;
    index: number;
    showAsError: boolean;
  }) => (
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
  )
);

export const SeedPhraseTable = ({
  seedPhrase,
  hideOnOpen = false,
  allowCopy = false,
  showAsError = false,
}: SeedPhraseTableProps) => {
  const [phraseVisible, showPhrase] = useBooleanState(!hideOnOpen);

  const { CopyToastComponent, copyToClipboard } = useCopyToast({});

  const wordsColumns = useMemo(() => {
    const words = seedPhrase?.split(' ') || [];
    const filler = new Array(12 - words.length).fill('');

    const filledArray = [...words, ...filler].map((word, index) => ({
      word,
      index,
    }));

    return [filledArray.slice(0, 6), filledArray.slice(6)];
  }, [seedPhrase]);

  return (
    <Container backgroundColor="darkBoxBackground" borderRadius={20}>
      <Container flexDirection="row" justifyContent="space-between" padding={8}>
        {wordsColumns.map(column => (
          <Container width="50%" height={250} justifyContent="space-between">
            {column.map(item => (
              <WordItem
                word={item.word}
                index={item.index}
                showAsError={showAsError}
              />
            ))}
          </Container>
        ))}
      </Container>
      {allowCopy && (
        <CenteredContainer>
          <Button
            iconProps={{ name: 'copy', color: 'white' }}
            marginBottom={7}
            variant="primaryWhite"
            onPress={() => copyToClipboard(seedPhrase)}
          >
            {strings.copyToClipboard}
          </Button>
          <CopyToastComponent />
        </CenteredContainer>
      )}
      {hideOnOpen && !phraseVisible && (
        <Container
          width="100%"
          height="100%"
          borderRadius={20}
          backgroundColor="darkBoxBackground"
          position="absolute"
          justifyContent="center"
          alignItems="center"
        >
          <Button variant="tinyOpacity" onPress={showPhrase}>
            {strings.tapToReveal}
          </Button>
        </Container>
      )}
    </Container>
  );
};
