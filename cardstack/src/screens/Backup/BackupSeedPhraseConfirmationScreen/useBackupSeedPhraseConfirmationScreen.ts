import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useRef, useState, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';

import { useWalletManualBackup } from '@rainbow-me/hooks';

import { shuffleSeedPhraseAsArray } from './utils';

interface NavParams {
  seedPhrase: string;
  walletId: string;
}

export const useBackupSeedPhraseConfirmationScreen = () => {
  const {
    params: { seedPhrase, walletId },
  } = useRoute<RouteType<NavParams>>();

  const { navigate } = useNavigation();

  const { onManuallyBackupWalletId } = useWalletManualBackup();

  const selectedWordsIndexes = useRef<number[]>([]).current;
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const shuffledWords = useMemo(() => shuffleSeedPhraseAsArray(seedPhrase), [
    seedPhrase,
  ]);

  const selectedSeedPhraseAsString = useMemo(() => selectedWords.join(' '), [
    selectedWords,
  ]);

  const isSelectionComplete = useMemo(
    () => selectedWords.length === shuffledWords.length,
    [selectedWords, shuffledWords]
  );

  const isSeedPhraseCorrect = useMemo(
    () => isSelectionComplete && seedPhrase === selectedSeedPhraseAsString,
    [isSelectionComplete, seedPhrase, selectedSeedPhraseAsString]
  );

  const handleWordPressed = useCallback(
    (index: number) => {
      selectedWordsIndexes.push(index);
      setSelectedWords([...selectedWords, shuffledWords[index]]);
    },
    [shuffledWords, selectedWords, selectedWordsIndexes, setSelectedWords]
  );

  const handleConfirmPressed = useCallback(() => {
    onManuallyBackupWalletId(walletId);
    navigate(Routes.WALLET_SCREEN);
  }, [walletId, navigate, onManuallyBackupWalletId]);

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
