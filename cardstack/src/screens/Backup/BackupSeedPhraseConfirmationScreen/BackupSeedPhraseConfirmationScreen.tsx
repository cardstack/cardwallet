import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback, useState, useMemo } from 'react';

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
import { RouteType } from '@cardstack/navigation/types';

import { WordPressableGroup } from './components/WordPressableGroup';
import { strings } from './strings';
import { shuffleSeedPhraseAsArray } from './utils';

interface NavParams {
  seedPhrase: string;
}

const leftIconProps: IconProps = { name: 'x' };

const BackupSeedPhraseConfirmationScreen = () => {
  const { params } = useRoute<RouteType<NavParams>>();

  const { seedPhrase = '' } = params;

  const [selectedWordsIndexes, setSelectedWordsIndexes] = useState<number[]>(
    []
  );

  const onWordPressed = useCallback(
    (index: number) => {
      setSelectedWordsIndexes([...selectedWordsIndexes, index]);
    },
    [selectedWordsIndexes, setSelectedWordsIndexes]
  );

  const onClearSelection = useCallback(() => setSelectedWordsIndexes([]), [
    setSelectedWordsIndexes,
  ]);

  const shuffledWords = useMemo(() => shuffleSeedPhraseAsArray(seedPhrase), [
    seedPhrase,
  ]);

  const selectedSeedPhraseAsString = useMemo(
    () => selectedWordsIndexes.map(value => shuffledWords[value]).join(' '),
    [selectedWordsIndexes, shuffledWords]
  );

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
          onClearPressed={onClearSelection}
        />
        <Container paddingVertical={5} paddingHorizontal={2}>
          <WordPressableGroup
            words={shuffledWords}
            selectedWordsIndexes={selectedWordsIndexes}
            onWordPressed={onWordPressed}
          />
        </Container>
      </ScrollView>
      <PageWithStackHeaderFooter>
        <CenteredContainer>
          <Button>{strings.doneBtn}</Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupSeedPhraseConfirmationScreen);
