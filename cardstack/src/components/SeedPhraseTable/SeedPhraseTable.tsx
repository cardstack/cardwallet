import { BlurView, BlurViewProps } from '@react-native-community/blur';
import React, { useMemo, useRef, memo, useCallback } from 'react';
import { StyleSheet, Animated } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  Text,
} from '@cardstack/components';
import { useBooleanState, useCopyToast } from '@cardstack/hooks';
import { Device } from '@cardstack/utils/device';

import { strings } from './strings';
import { backgroundColor } from '@shopify/restyle';

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

// BlurView is crashing and spilling a dark opacity on Android for an unknown reason.
// TODO: Investigate fix for crash and spillage on Android.
const BlurViewWrapper = (props: BlurViewProps) =>
  Device.isIOS ? (
    <BlurView {...props} />
  ) : (
    <Container style={props.style} backgroundColor="darkBoxBackground" />
  );

export const SeedPhraseTable = ({
  seedPhrase,
  hideOnOpen = false,
  allowCopy = false,
  showAsError = false,
}: SeedPhraseTableProps) => {
  const [phraseVisible, showPhrase] = useBooleanState(!hideOnOpen);

  const blurAnimation = useRef(
    new Animated.Value(!hideOnOpen ? animConfig.visible : animConfig.blurred)
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

  const hideOverlay = useCallback(() => {
    Animated.timing(blurAnimation, {
      duration: animConfig.duration,
      toValue: animConfig.visible,
      useNativeDriver: true,
    }).start(() => showPhrase());
  }, [blurAnimation, showPhrase]);

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
            variant="linkWhite"
            onPress={() => copyToClipboard(seedPhrase)}
          >
            {strings.copyToClipboard}
          </Button>
          <CopyToastComponent />
        </CenteredContainer>
      )}

      {!phraseVisible && (
        <Animated.View style={[styles.blurView, animatedOpacity]}>
          <BlurViewWrapper
            style={styles.blurView}
            reducedTransparencyFallbackColor="darkBoxBackground"
          />
          <CenteredContainer width="100%" height="100%">
            <Button variant="tinyOpacity" onPress={hideOverlay}>
              {strings.tapToReveal}
            </Button>
          </CenteredContainer>
        </Animated.View>
      )}
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
