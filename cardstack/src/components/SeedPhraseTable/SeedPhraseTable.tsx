import { BlurView } from '@react-native-community/blur';
import React, { useMemo, useRef, useEffect, memo } from 'react';
import { StyleSheet, Animated } from 'react-native';

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

const animConfig = {
  duration: 250,
  blurred: 1,
  visible: 0,
};

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

  const blurAnimation = useRef(
    new Animated.Value(phraseVisible ? animConfig.visible : animConfig.blurred)
  ).current;

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

  const animatedOpacity = useMemo(
    () => ({
      opacity: blurAnimation,
    }),
    [blurAnimation]
  );

  useEffect(() => {
    Animated.timing(blurAnimation, {
      duration: animConfig.duration,
      toValue: phraseVisible ? animConfig.visible : animConfig.blurred,
      useNativeDriver: true,
    }).start();
  }, [phraseVisible, blurAnimation]);

  return (
    <Container
      backgroundColor="darkBoxBackground"
      borderRadius={20}
      borderColor="darkBoxBackground"
      borderWidth={1}
    >
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

      <>
        <Animated.View style={[styles.blurView, animatedOpacity]}>
          <BlurView
            style={styles.blurView}
            reducedTransparencyFallbackColor="darkBoxBackground"
          />
          <CenteredContainer width="100%" height="100%">
            <Button variant="tinyOpacity" onPress={showPhrase}>
              {strings.tapToReveal}
            </Button>
          </CenteredContainer>
        </Animated.View>
      </>
    </Container>
  );
};

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});
