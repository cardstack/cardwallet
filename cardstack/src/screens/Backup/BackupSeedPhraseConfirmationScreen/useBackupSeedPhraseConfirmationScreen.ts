import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useCallback, useRef, useState, useMemo } from 'react';

import { useWalletManualBackup } from '@cardstack/hooks/backup/useWalletManualBackup';
import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
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

  const { dispatch: navDispatch } = useNavigation();

  const { confirmBackup } = useWalletManualBackup();

  const {
    navigateOnboardingTo,
    navigateToNextOnboardingStep,
  } = useShowOnboarding();

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

  const handleClearPressed = useCallback(() => {
    selectedWordsIndexes.length = 0;
    setSelectedWords([]);
  }, [selectedWordsIndexes, setSelectedWords]);

  const handleConfirmPressed = useCallback(() => {
    confirmBackup();

    if (popStackOnSuccess) {
      navDispatch(StackActions.pop(popStackOnSuccess));
    } else {
      navigateToNextOnboardingStep();
    }
  }, [
    confirmBackup,
    popStackOnSuccess,
    navDispatch,
    navigateToNextOnboardingStep,
  ]);

  const handleBackupToCloudPress = useCallback(() => {
    confirmBackup();
    navigateOnboardingTo(Routes.BACKUP_CLOUD_PASSWORD);
  }, [navigateOnboardingTo, confirmBackup]);

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
