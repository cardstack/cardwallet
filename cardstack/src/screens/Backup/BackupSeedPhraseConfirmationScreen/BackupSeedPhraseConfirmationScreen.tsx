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
  TagCloud,
} from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

import { strings } from './strings';
import { BackupManualSeedPhraseConfirmationParams } from './types';
import { shuffleSeedPhraseAsArray } from './utils';

const leftIconProps: IconProps = { name: 'x' };

const BackupSeedPhraseConfirmationScreen = () => {
  const { params } = useRoute<
    RouteType<BackupManualSeedPhraseConfirmationParams>
  >();

  const { seedPhrase = '', onConfirm } = params;

  const [selectedWords, setSelectedWords] = useState<number[]>([]);

  const onTagSelected = useCallback(
    (index: number) => {
      setSelectedWords([...selectedWords, index]);
    },
    [selectedWords, setSelectedWords]
  );

  const onCleanSelection = useCallback(() => setSelectedWords([]), [
    setSelectedWords,
  ]);

  const shuffledWords = useMemo(() => shuffleSeedPhraseAsArray(seedPhrase), [
    seedPhrase,
  ]);

  const selectedSeedPhraseAsString = useMemo(
    () => selectedWords.map(value => shuffledWords[value]).join(' '),
    [selectedWords, shuffledWords]
  );

  return (
    <PageWithStackHeader showSkip={false} leftIconProps={leftIconProps}>
      <ScrollView flex={1}>
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
          onCleanPressed={onCleanSelection}
        />
        <TagCloud
          tags={shuffledWords}
          selectedTags={selectedWords}
          onTagSelection={onTagSelected}
        />
      </ScrollView>
      <PageWithStackHeaderFooter>
        <CenteredContainer>
          <Button onPress={onConfirm}>{strings.doneBtn}</Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupSeedPhraseConfirmationScreen);
