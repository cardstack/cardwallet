import React, { memo } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
  ScrollView,
  SeedPhraseTable,
} from '@cardstack/components';

import { WordPressableGroup } from './components/WordPressableGroup';
import { strings } from './strings';
import { useBackupSeedPhraseConfirmationScreen } from './useBackupSeedPhraseConfirmationScreen';

const BackupSeedPhraseConfirmationScreen = () => {
  const {
    handleWordPressed,
    handleConfirmPressed,
    handleClearPressed,
    isSelectionComplete,
    isSeedPhraseCorrect,
    shuffledWords,
    selectedWordsIndexes,
    selectedSeedPhraseAsString,
  } = useBackupSeedPhraseConfirmationScreen();

  return (
    <PageWithStackHeader showSkip={false}>
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
          showAsError={isSelectionComplete && !isSeedPhraseCorrect}
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
            {isSeedPhraseCorrect ? (
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
