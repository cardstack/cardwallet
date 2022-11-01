import React, { useMemo, useRef, useCallback } from 'react';
import { ActivityIndicator, Animated, StyleSheet } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  IconProps,
  Image,
} from '@cardstack/components';
import { useBooleanState, useCopyWithFeedback } from '@cardstack/hooks';
import { colors } from '@cardstack/theme';

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
  loading?: boolean;
  onClearPressed?: () => void;
}

const animConfig = {
  duration: 250,
  blurred: 1,
  visible: 0,
};

const copyIconProps: IconProps = { name: 'copy', color: 'white' };

const blurredImage = require('../../assets/seed-phrase-blur/blurredPhrase.png');
const blurredImageWithCopyButton = require('../../assets/seed-phrase-blur/blurredPhraseWithCopyButton.png');

export const SeedPhraseTable = ({
  seedPhrase,
  hideOnOpen = false,
  allowCopy = false,
  showAsError = false,
  loading = false,
  onClearPressed,
}: SeedPhraseTableProps) => {
  const [phraseVisible, showPhrase] = useBooleanState(!hideOnOpen);

  const blurAnimation = useRef(
    new Animated.Value(!hideOnOpen ? animConfig.visible : animConfig.blurred)
  ).current;

  const { copyToClipboard } = useCopyWithFeedback();

  const wordColumns = useMemo(
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

  const WordsTable = useMemo(
    () => (
      <Container
        flexDirection="row"
        justifyContent="space-between"
        padding={8}
        paddingBottom={6}
      >
        {wordColumns.map((column, columnIndex) => (
          <Container width="50%" height={258} justifyContent="space-between">
            {column.map((word, lineIndex) => (
              <WordItem
                word={word}
                numberPrefix={1 + lineIndex + columnIndex * column.length}
                showAsError={showAsError}
              />
            ))}
          </Container>
        ))}
      </Container>
    ),
    [wordColumns, showAsError]
  );

  return (
    <Container
      backgroundColor="blueDarkest"
      borderColor="blueDarkest"
      borderWidth={1}
      borderRadius={20}
    >
      {WordsTable}

      {!!onClearPressed && (
        <Container position="absolute" top={0} right={20}>
          <Button
            marginBottom={4}
            variant="smallLinkWhite"
            onPress={onClearPressed}
          >
            {strings.clearBtn}
          </Button>
        </Container>
      )}

      {allowCopy && (
        <CenteredContainer>
          <Button
            iconProps={copyIconProps}
            marginBottom={4}
            variant="linkWhite"
            onPress={copySeedPhrase}
          >
            {strings.copyToClipboard}
          </Button>
        </CenteredContainer>
      )}

      {!phraseVisible && (
        <Animated.View style={[styles.blurContainer, animatedOpacity]}>
          <Image
            source={allowCopy ? blurredImageWithCopyButton : blurredImage}
            style={[styles.blurContainer, styles.imageBlurView]}
            resizeMode="stretch"
          />
          <CenteredContainer width="100%" height="100%">
            <Button variant="tinyOpacityWhite" onPress={hideOverlay}>
              {strings.tapToReveal}
            </Button>
          </CenteredContainer>
        </Animated.View>
      )}

      {loading && (
        <CenteredContainer style={styles.blurContainer}>
          <ActivityIndicator size={15} color="white" />
        </CenteredContainer>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.blueDarkest,
    borderRadius: 20,
  },
  imageBlurView: {
    borderColor: colors.whiteTinyLightOpacity,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
