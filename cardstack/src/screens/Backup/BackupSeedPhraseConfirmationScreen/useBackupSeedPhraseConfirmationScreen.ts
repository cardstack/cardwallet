import { useRoute } from '@react-navigation/native';
import { useCallback, useState, useMemo } from 'react';

import { RouteType } from '@cardstack/navigation/types';

import { shuffleSeedPhraseAsArray } from './utils';

interface NavParams {
  seedPhrase: string;
}

export const useBackupSeedPhraseConfirmationScreen = () => {
  const {
    params: { seedPhrase = '' },
  } = useRoute<RouteType<NavParams>>();

  const [selectedWordsIndexes, setSelectedWordsIndexes] = useState<number[]>(
    []
  );

  const handleWordPressed = useCallback(
    (index: number) => {
      setSelectedWordsIndexes([...selectedWordsIndexes, index]);
    },
    [selectedWordsIndexes, setSelectedWordsIndexes]
  );

  const handleConfirmPressed = useCallback(() => {
    // tbd
  }, []);

  const handleClearPressed = useCallback(() => setSelectedWordsIndexes([]), [
    setSelectedWordsIndexes,
  ]);

  const shuffledWords = useMemo(() => shuffleSeedPhraseAsArray(seedPhrase), [
    seedPhrase,
  ]);

  const selectedSeedPhraseAsString = useMemo(
    () => selectedWordsIndexes.map(value => shuffledWords[value]).join(' '),
    [selectedWordsIndexes, shuffledWords]
  );

  const isSelectionComplete = useMemo(
    () => selectedWordsIndexes.length === shuffledWords.length,
    [selectedWordsIndexes, shuffledWords]
  );

  const isSeedPhraseValid = useMemo(
    () => isSelectionComplete && seedPhrase === selectedSeedPhraseAsString,
    [isSelectionComplete, seedPhrase, selectedSeedPhraseAsString]
  );

  return {
    handleWordPressed,
    handleConfirmPressed,
    handleClearPressed,
    isSelectionComplete,
    isSeedPhraseValid,
    shuffledWords,
    selectedWordsIndexes,
    selectedSeedPhraseAsString,
  };
};
