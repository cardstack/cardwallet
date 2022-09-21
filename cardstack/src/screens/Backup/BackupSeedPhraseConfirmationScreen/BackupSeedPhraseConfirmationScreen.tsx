import React, { memo } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
  IconProps,
  ScrollView,
  SeedPhraseTable,
} from '@cardstack/components';

import { WordPressableGroup } from './components/WordPressableGroup';
import { strings } from './strings';
import { useBackupSeedPhraseConfirmationScreen } from './useBackupSeedPhraseConfirmationScreen';

const leftIconProps: IconProps = { name: 'x' };

const BackupSeedPhraseConfirmationScreen = () => {
  const {
    handleWordPressed,
    handleConfirmPressed,
    handleClearPressed,
    isSelectionComplete,
    isSeedPhraseValid,
    shuffledWords,
    selectedWordsIndexes,
    selectedSeedPhraseAsString,
  } = useBackupSeedPhraseConfirmationScreen();

  return (
    <PageWithStackHeader showSkip={false} leftIconProps={leftIconProps}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <Container width="90%" paddingBottom={7}>
          <Text variant="pageHeader" paddingBottom={4}>
            {strings.title}
          </Text>
          <Text color="grayText" letterSpacing={0.4}>
            {strings.description}
          </Text>
        </Container>
        <SeedPhraseTable
          seedPhrase={selectedSeedPhraseAsString}
          onClearPressed={handleClearPressed}
        />
        <Container paddingVertical={5} paddingHorizontal={2}>
          <WordPressableGroup
            words={shuffledWords}
            selectedWordsIndexes={selectedWordsIndexes}
            onWordPressed={handleWordPressed}
          />
        </Container>
      </ScrollView>
      {isSelectionComplete && (
        <PageWithStackHeaderFooter>
          <CenteredContainer>
            {isSeedPhraseValid ? (
              <Button onPress={handleConfirmPressed}>{strings.doneBtn}</Button>
            ) : (
              <Button variant="red" onPress={handleClearPressed}>
                {strings.retryBtn}
              </Button>
            )}
          </CenteredContainer>
        </PageWithStackHeaderFooter>
      )}
    </PageWithStackHeader>
  );
};

export default memo(BackupSeedPhraseConfirmationScreen);
