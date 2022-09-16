import { BlurView, BlurViewProps } from '@react-native-community/blur';
import React, { useMemo, useRef, useCallback } from 'react';
import { Animated, StyleSheet } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  IconProps,
} from '@cardstack/components';
import { useBooleanState, useCopyToast } from '@cardstack/hooks';
import { Device } from '@cardstack/utils/device';

import WordItem from './components/WordItem';
import { strings } from './strings';
import {
  filledArrayFromSeedPhraseString,
  splitSeedPhraseArrayInTwoColunms,
} from './utils';

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

const copyIconProps: IconProps = { name: 'copy', color: 'white' };

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

  const words = useMemo(
    () =>
      splitSeedPhraseArrayInTwoColunms(
        filledArrayFromSeedPhraseString(seedPhrase)
      ),
    [seedPhrase]
  );

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

  const copySeedPhrase = useCallback(() => copyToClipboard(seedPhrase), [
    copyToClipboard,
    seedPhrase,
  ]);

  const renderWordItem = useCallback(
    ({ word, index }: { word: string; index: number }) => (
      <WordItem word={word} index={index} showAsError={showAsError} />
    ),
    [showAsError]
  );

  const WordsColumns = useMemo(
    () => (
      <Container flexDirection="row" justifyContent="space-between" padding={8}>
        {words.map((column, j) => (
          <Container width="50%" height={250} justifyContent="space-between">
            {column.map((word, i) =>
              renderWordItem({ word, index: i + j * column.length })
            )}
          </Container>
        ))}
      </Container>
    ),
    [words, renderWordItem]
  );

  return (
    <Container
      backgroundColor="darkBoxBackground"
      borderColor="darkBoxBackground"
      borderWidth={1}
      borderRadius={20}
    >
      {WordsColumns}

      {allowCopy && (
        <CenteredContainer>
          <Button
            iconProps={copyIconProps}
            marginBottom={7}
            variant="linkWhite"
            onPress={copySeedPhrase}
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
            <Button variant="tinyOpacityWhite" onPress={hideOverlay}>
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
