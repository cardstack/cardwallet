import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useRef, useState, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';

import { useWalletManualBackup } from '@rainbow-me/hooks';

import { shuffleSeedPhraseAsArray } from './utils';

interface NavParams {
  seedPhrase: string;
}

// Selection UI is hard-coded for 12 words.
const SEED_PHRASE_LENGTH = 12;

export const useBackupSeedPhraseConfirmationScreen = () => {
  const {
    params: { seedPhrase },
  } = useRoute<RouteType<NavParams>>();

  const { navigate } = useNavigation();

  const { confirmBackup } = useWalletManualBackup();

  const selectedWordsIndexes = useRef<number[]>([]).current;
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const shuffledWords = useMemo(() => shuffleSeedPhraseAsArray(seedPhrase), [
    seedPhrase,
  ]);

  const selectedSeedPhraseAsString = useMemo(() => selectedWords.join(' '), [
    selectedWords,
  ]);

  const isSelectionComplete = useMemo(
    () => selectedWords.length === SEED_PHRASE_LENGTH,
    [selectedWords]
  );

  const isSeedPhraseCorrect = useMemo(
    () => seedPhrase === selectedSeedPhraseAsString,
    [seedPhrase, selectedSeedPhraseAsString]
  );

  const handleWordPressed = useCallback(
    (index: number) => {
      selectedWordsIndexes.push(index);
      setSelectedWords([...selectedWords, shuffledWords[index]]);
    },
    [shuffledWords, selectedWords, selectedWordsIndexes, setSelectedWords]
  );

  const handleConfirmPressed = useCallback(() => {
    confirmBackup();
    navigate(Routes.WALLET_SCREEN);
  }, [navigate, confirmBackup]);

  const handleClearPressed = useCallback(() => {
    selectedWordsIndexes.length = 0;
    setSelectedWords([]);
  }, [selectedWordsIndexes, setSelectedWords]);

  return {
    handleWordPressed,
    handleConfirmPressed,
    handleClearPressed,
    isSelectionComplete,
    isSeedPhraseCorrect,
    shuffledWords,
    selectedWordsIndexes,
    selectedSeedPhraseAsString,
  };
};
