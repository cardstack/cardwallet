import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useCallback, useRef, useState, useMemo } from 'react';

import { useWalletManualBackup } from '@cardstack/hooks/backup/useWalletManualBackup';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';

import { BackupRouteParams } from '../types';

import { shuffleSeedPhraseAsArray } from './utils';

// Selection UI is hard-coded for 12 words.
const SEED_PHRASE_LENGTH = 12;

export const useBackupSeedPhraseConfirmationScreen = () => {
  const {
    params: { seedPhrase, popStackOnSuccess = 0 },
  } = useRoute<RouteType<BackupRouteParams>>();

  const { navigate, dispatch: navDispatch } = useNavigation();

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

    console.log(':::', { popStackOnSuccess });

    if (popStackOnSuccess) {
      navDispatch(StackActions.pop(popStackOnSuccess));
    }
  }, [confirmBackup, popStackOnSuccess, navDispatch]);

  const handleClearPressed = useCallback(() => {
    selectedWordsIndexes.length = 0;
    setSelectedWords([]);
  }, [selectedWordsIndexes, setSelectedWords]);

  const handleBackupToCloudPress = useCallback(() => {
    confirmBackup();
    navigate(Routes.BACKUP_CLOUD_PASSWORD);
  }, [navigate, confirmBackup]);

  return {
    handleWordPressed,
    handleConfirmPressed,
    handleClearPressed,
    isSelectionComplete,
    isSeedPhraseCorrect,
    shuffledWords,
    selectedWordsIndexes,
    selectedSeedPhraseAsString,
    handleBackupToCloudPress,
  };
};
